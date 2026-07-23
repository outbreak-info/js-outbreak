<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { defaultColor, colorPalette } from "../utils/colorSchemes";
import { defaultFontSize, defaultFontFamily } from "../utils/chartDefaults";
import * as Plot from "@observablehq/plot";

const props = defineProps({
  data: { type: Array, required: true },
  horizontal: { type: Boolean, default: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginTop: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  marginRight: { type: Number, default: 50 },
  barColor: { type: String, default: defaultColor },
  xKey: { type: String, default: "value" }, // TODO: xKey is currently used for x-axis in horizontal and y-axis in vertical. Fix this.
  yKey: { type: String, default: "key" },
  xLabel: { type: String, default: "value" },
  yLabel: { type: String, default: "key" },
  // Optional tooltip labels. If empty, the tooltip shows the value only (existing behavior).
  // Use these when the axis label and tooltip label need to differ.
  xTooltipLabel: { type: String, default: "" },
  yTooltipLabel: { type: String, default: "" },
  sortOrder: { type: String, default: "desc" },
  groupBy: { type: String, default: "" },
  colorBy: { type: String, default: "" }, // Use barColor to color bars by category and colorBy to set BOTH fill and tick label to attribute. Change this in the future?
  stacked: { type: Boolean, default: false },
  showProportion: { type: Boolean, default: false },
  tooltipDecimalPlaces: { type: Number, default: 1 },
  legendDomain: { type: Array, default: null },
  legendRange: { type: Array, default: null },
  showLegend: { type: Boolean, default: true },
  categoryOrder: { type: Array, default: null },
  xMin: { type: Number, default: null },
  xMax: { type: Number, default: null },
  yMin: { type: Number, default: null },
  yMax: { type: Number, default: null },
  fontSize: { type: Number, default: defaultFontSize },
  showLabels: { type: Boolean, default: false },
  labelKey: { type: String, default: "" },
  missingAttribute: { type: Array, default: () => [] },
  // Highlights bar(s) whose yKey value matches one of these, by filling
  // them with highlightColor. Intended for single-color charts.
  // It takes priority over missingAttribute if a value happens
  // to appear in both.
  highlightKeys: { type: Array, default: () => [] },
  highlightColor: { type: String, default: colorPalette[19] },
  // Single horizontal/vertical reference line (kept for backwards compatibility)
  hLine: { type: Number, default: null },
  vLine: { type: Number, default: null },
  // Multiple horizontal/vertical reference lines, each optionally annotated.
  // Shape: { value, color, strokeDasharray, strokeWidth, label, dx, dy, textAnchor, lineAnchor, maxLabelWidth }
  //  - value: required. The y-position (hLines) or x-position (vLines) of the line.
  //  - color: stroke (and label) color. Defaults to colorPalette[6].
  //  - strokeDasharray / strokeWidth: line styling. Defaults to "6,4" / 2.
  //  - label: optional annotation text rendered next to the line.
  // Label position is fully manual, using the same vocabulary as SVG/Plot text - no automatic
  // positioning is derived from `value` or chart orientation:
  //  - The label is anchored to the line's own value on the axis the line fixes (e.g. for an
  //    hLine, the label's y always equals `value`). On the other axis, it starts centered on
  //    the chart frame; use dx/dy to move it from there.
  //  - dx / dy: pixel offset from the anchor point above. Both default to 0.
  //  - textAnchor: "start" | "middle" | "end" (default "middle"). Same as SVG's text-anchor -
  //    controls how the label flows horizontally from its anchor point.
  //  - lineAnchor: "top" | "middle" | "bottom" (default "middle"). Controls how the label flows
  //    vertically from its anchor point (similar to SVG's dominant-baseline).
  //  - maxLabelWidth: max pixel width before the label wraps onto multiple lines. Defaults to 140.
  hLines: { type: Array, default: () => [] },
  vLines: { type: Array, default: () => [] },
  integerTicks: { type: Boolean, default: false },
  // When set, forces the numeric value axis to only show tick labels 
  // that are exact multiples of this number. The step between
  // ticks is itself sized to a multiple of this number is chosen
  // based on the available axis width so labels never overlap.
  tickMultiple: { type: Number, default: null },
  // Append a literal '%' after the numeric value in the tooltip.
  // Independent of showProportion, which computes and appends a derived percentage.
  appendPercentX: { type: Boolean, default: false },
  appendPercentY: { type: Boolean, default: false },
});

const chartContainer = ref(null);

const DEFAULT_LINE_COLOR = colorPalette[6];
const DEFAULT_LINE_DASH = "6,4";
const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_MAX_LABEL_WIDTH = 140;
const LINE_LABEL_LINE_HEIGHT = 1.2; // em, spacing between wrapped label lines

const VALID_TEXT_ANCHORS = new Set(["start", "middle", "end"]);
const VALID_LINE_ANCHORS = new Set(["top", "middle", "bottom"]);

// Merges the legacy single-value prop (hLine/vLine) with the new array prop
// (hLines/vLines) into one normalized list, filling in defaults for any
// unspecified styling/annotation fields.
function normalizeLines(singleValue, lines) {
  const merged = [];
  if (singleValue !== null && singleValue !== undefined) {
    merged.push({ value: singleValue });
  }
  if (Array.isArray(lines)) {
    merged.push(...lines);
  }
  return merged
    .filter((line) => line && line.value !== null && line.value !== undefined)
    .map((line) => ({
      value: line.value,
      color: line.color ?? DEFAULT_LINE_COLOR,
      strokeDasharray: line.strokeDasharray ?? DEFAULT_LINE_DASH,
      strokeWidth: line.strokeWidth ?? DEFAULT_LINE_WIDTH,
      label: line.label ?? null,
      dx: line.dx ?? 0,
      dy: line.dy ?? 0,
      textAnchor: VALID_TEXT_ANCHORS.has(line.textAnchor) ? line.textAnchor : "middle",
      lineAnchor: VALID_LINE_ANCHORS.has(line.lineAnchor) ? line.lineAnchor : "middle",
      maxLabelWidth: line.maxLabelWidth ?? DEFAULT_MAX_LABEL_WIDTH,
    }));
}

// Average glyph width as a fraction of fontSize, used to estimate how many
// characters fit in maxWidth without needing real text measurement.
const AVG_CHAR_WIDTH_FACTOR = 0.55;

// Wraps a label into multiple lines (joined with "\n", which Plot.text
// renders as separate tspans) so that no line exceeds roughly maxWidth
// pixels.
function wrapLabel(label, maxWidth, fontSize) {
  const text = String(label);
  if (!maxWidth) return text;

  const maxChars = Math.max(1, Math.floor(maxWidth / (fontSize * AVG_CHAR_WIDTH_FACTOR)));
  if (text.length <= maxChars) return text;

  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  const flush = () => {
    if (current) {
      lines.push(current);
      current = "";
    }
  };

  for (let word of words) {
    // Break up a single word that's longer than a whole line on its own.
    while (word.length > maxChars) {
      flush();
      lines.push(word.slice(0, maxChars));
      word = word.slice(maxChars);
    }

    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxChars) {
      flush();
      current = word;
    } else {
      current = candidate;
    }
  }
  flush();

  return lines.join("\n");
}

// Builds the ruleY mark (plus an optional annotation text mark) for each
// horizontal line. The label's y always equals the line's own value, so it
// tracks the line; x is left unset (Plot centers it on the frame) and is
// then fully controlled via dx/textAnchor.
function buildHLineMarks(lines, fontSize) {
  const marks = [];

  for (const line of lines) {
    marks.push(
      Plot.ruleY([line.value], {
        stroke: line.color,
        strokeDasharray: line.strokeDasharray,
        strokeWidth: line.strokeWidth,
      }),
    );

    if (!line.label) continue;

    marks.push(
      Plot.text(
        [{ y: line.value, text: wrapLabel(line.label, line.maxLabelWidth, fontSize) }],
        {
          y: "y",
          text: "text",
          textAnchor: line.textAnchor,
          lineAnchor: line.lineAnchor,
          lineHeight: LINE_LABEL_LINE_HEIGHT,
          dx: line.dx,
          dy: line.dy,
          fill: line.color,
        },
      ),
    );
  }

  return marks;
}

// Builds the ruleX mark (plus an optional annotation text mark) for each
// vertical line. The label's x always equals the line's own value, so it
// tracks the line; y is left unset (Plot centers it on the frame) and is
// then fully controlled via dy/lineAnchor.
function buildVLineMarks(lines, fontSize) {
  const marks = [];

  for (const line of lines) {
    marks.push(
      Plot.ruleX([line.value], {
        stroke: line.color,
        strokeDasharray: line.strokeDasharray,
        strokeWidth: line.strokeWidth,
      }),
    );

    if (!line.label) continue;

    marks.push(
      Plot.text(
        [{ x: line.value, text: wrapLabel(line.label, line.maxLabelWidth, fontSize) }],
        {
          x: "x",
          text: "text",
          textAnchor: line.textAnchor,
          lineAnchor: line.lineAnchor,
          lineHeight: LINE_LABEL_LINE_HEIGHT,
          dx: line.dx,
          dy: line.dy,
          fill: line.color,
        },
      ),
    );
  }

  return marks;
}

function getSortOrder(sortOrder, horizontal) {
  let desc = { x: "-y" };
  let asc = { x: "y" };

  if (horizontal) {
    desc = { y: "-x" };
    asc = { y: "x" };
  }

  switch (props.sortOrder) {
    case "desc": // descending
      return desc;

    case "asc": // ascending
      return asc;

    case "None": // leave unsorted
      return false;
  }
  return false;
}

// Minimum horizontal gap (px) to keep between adjacent tick labels, on top of their
// estimated text width, so they don't visually touch or overlap.
const MIN_TICK_LABEL_GAP = 16;

// Estimates the rendered pixel width of a text label for tick-fitting calculations.
function estimateLabelWidth(label, fontSize) {
  return String(label).length * fontSize * AVG_CHAR_WIDTH_FACTOR;
}

// Estimates how many evenly spaced ticks can fit along an axis of `availableWidth` px
// without overlapping, sized off the widest of the given sample labels.
function estimateMaxTickCount(availableWidth, fontSize, sampleLabels) {
  if (!isFinite(availableWidth) || availableWidth <= 0) return 2;
  const maxLabelWidth = Math.max(
    1,
    ...sampleLabels.map((l) => estimateLabelWidth(l, fontSize)),
  );
  const slot = maxLabelWidth + MIN_TICK_LABEL_GAP;
  return Math.max(2, Math.floor(availableWidth / slot));
}

// Rounds a raw tick step up to a "nice" number
function niceIntegerStep(rawStep) {
  if (!isFinite(rawStep) || rawStep <= 0) return 1;

  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)) - 1);
  const unit = magnitude * 5;
  const rounded = Math.round(rawStep / unit) * unit;

  return Math.max(1, Math.round(rounded));
}

// Rounds a raw tick step up to the nearest multiple of `multiple`. Unlike
// niceIntegerStep (which rounds to a "nice" 5/10/50/... number), this
// guarantees the step (and therefore every tick derived from it) is an 
// exact multiple of `multiple`
// (e.g. multiple=10 -> steps of 10, 20, 30, ...).
function multipleStep(rawStep, multiple) {
  if (!isFinite(rawStep) || rawStep <= 0 || !multiple || multiple <= 0) return multiple || 1;
  return Math.max(multiple, Math.ceil(rawStep / multiple) * multiple);
}

// Computes the effective numeric domain [min, max] for the value axis.
//
// This mirrors what Observable Plot's bar marks actually render: Plot.barX/Plot.barY
// always apply an implicit stack transform internally (see @observablehq/plot's
// marks/bar.js), summing together any data points that land in the same
// (facet, categoryKey) band - regardless of whether our own `stacked` prop is set.
// Our `stacked` prop only changes *which* field is used as that band key (and adds an
// explicit fill-ordered stack): when stacked it's always yKey; when not stacked it's
// `colorBy || yKey` (see renderChart, where colorBy is substituted in as the mark's
// y/x channel). Whenever that key repeats across rows - most commonly because colorBy
// groups many rows under a shared category - Plot will sum them into one bar, so our
// domain estimate must sum the same way or our tick calculations (and any explicit
// tick list, e.g. from tickMultiple/integerTicks) will fall short of the real bars.
function computeEffectiveDomain(data, valueKey, categoryKey, facetKey, propMin, propMax) {
  if (!data || data.length === 0) return [0, 0];

  let effectiveMax;
  if (propMax !== null) {
    effectiveMax = propMax;
  } else {
    const sums = data.reduce((acc, d) => {
      const groupKey = `${facetKey ? d[facetKey] : ""}\u0000${d[categoryKey]}`;
      acc[groupKey] = (acc[groupKey] || 0) + Number(d[valueKey] || 0);
      return acc;
    }, {});
    effectiveMax = Math.max(...Object.values(sums));
  }

  const min = propMin !== null ? propMin : 0;
  return [min, effectiveMax];
}

// Computes the `ticks` value for a numeric Plot scale, covering three cases in one
// place:
//  - tickMultiple set: returns explicit tick values that are all exact multiples of
//    tickMultiple, with the step between them also sized to a multiple of tickMultiple
//    (width-aware, like integerTicks below). Takes priority over integerTicks.
//  - integerTicks true (and no tickMultiple): returns explicit, integer-stepped tick
//    values, "nicely" rounded (see niceIntegerStep).
//  - neither: returns a desired tick *count* (a plain number), letting Plot/d3 still
//    choose nicely-rounded tick values, just at a width-aware density.
// `categoryKey` must already be resolved by the caller to whatever field Plot will
// actually use as the band/grouping channel (yKey when stacked, colorBy || yKey when
// not; `facetKey` is the groupBy/fx field, if any.
// `width`/`marginLeft`/`marginRight` are optional: when omitted, falls back to the
// original fixed ~10-tick budget.
function computeNumericTicks(
  data,
  valueKey,
  categoryKey,
  facetKey,
  propMin,
  propMax,
  integerTicks,
  fontSize,
  decimalPlaces,
  width = null,
  marginLeft = 0,
  marginRight = 0,
  tickMultiple = null,
) {
  const wantsExplicitTicks = integerTicks || !!tickMultiple;

  if (!data || data.length === 0) return wantsExplicitTicks ? [] : undefined;

  const [domainMin, domainMax] = computeEffectiveDomain(
    data,
    valueKey,
    categoryKey,
    facetKey,
    propMin,
    propMax,
  );
  if (!isFinite(domainMin) || !isFinite(domainMax))
    return wantsExplicitTicks ? [] : undefined;

  // When width info is available, size the tick count to fit; otherwise keep the
  // original fixed budget of ~10 ticks.
  const availableWidth = width !== null ? width - marginLeft - marginRight : null;

  if (tickMultiple) {
    // Align the domain edges to the multiple first, so every subsequent tick (min,
    // min + step, min + 2*step, ...) is guaranteed to also be a multiple of it, since
    // step is itself a multiple of tickMultiple.
    const min = Math.floor(domainMin / tickMultiple) * tickMultiple;
    const max = Math.ceil(domainMax / tickMultiple) * tickMultiple;
    if (!isFinite(min) || !isFinite(max) || max <= min)
      return [min, max].filter(isFinite);

    const maxTickCount =
      availableWidth !== null
        ? estimateMaxTickCount(availableWidth, fontSize, [
            min.toLocaleString(),
            max.toLocaleString(),
          ])
        : 10;

    const step = multipleStep((max - min) / maxTickCount, tickMultiple);
    const ticks = [];
    for (let t = min; t <= max; t += step) ticks.push(t);
    return ticks;
  }

  if (integerTicks) {
    const min = Math.floor(domainMin);
    const max = Math.ceil(domainMax);
    if (!isFinite(min) || !isFinite(max) || max <= min)
      return [min, max].filter(isFinite);

    const maxTickCount =
      availableWidth !== null
        ? estimateMaxTickCount(availableWidth, fontSize, [
            min.toLocaleString(),
            max.toLocaleString(),
          ])
        : 10;

    const step = niceIntegerStep((max - min) / maxTickCount);
    const ticks = [];
    for (let t = min; t <= max; t += step) ticks.push(t);
    return ticks;
  }

  // Non-integer continuous scale: a width-aware count is only meaningful when width
  // info is actually provided (the only current caller for this branch).
  if (availableWidth === null) return undefined;

  const fmt = (v) =>
    v.toLocaleString(undefined, { maximumFractionDigits: decimalPlaces });

  return estimateMaxTickCount(availableWidth, fontSize, [fmt(domainMin), fmt(domainMax)]);
}

// Decides whether the categorical axis (x-axis in vertical orientation) needs rotated
// tick labels to avoid overlap, based on the width available per category vs. the
// estimated label width. Returns 0 (horizontal, no rotation) when labels comfortably
// fit, or -45 (matching the original always-rotated behavior) when they don't.
function computeCategoricalTickRotation(data, categoryKey, categoryOrder, availableWidth, fontSize) {
  if (!data || data.length === 0) return 0;

  const categories = categoryOrder ?? [...new Set(data.map((d) => d[categoryKey]))];
  const numCategories = categories.length || 1;
  const widthPerCategory = availableWidth / numCategories;

  const maxLabelWidth = Math.max(
    1,
    ...categories.map((c) => estimateLabelWidth(c, fontSize)),
  );

  return maxLabelWidth + MIN_TICK_LABEL_GAP <= widthPerCategory ? 0 : -45;
}

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = "";

  const total = props.data.reduce(
    (sum, d) => sum + Number(d[props.xKey] || 0),
    0,
  );

  const hasMissing =
    props.missingAttribute && props.missingAttribute.length > 0;
  const missingKey = props.yKey;

  const hasHighlight =
    props.highlightKeys && props.highlightKeys.length > 0;
  const highlightKey = props.yKey;

  let colorMap = null;
  if (hasMissing && props.colorBy) {
    const domain = props.legendDomain ?? [
      ...new Set(props.data.map((d) => d[props.colorBy])),
    ];
    const range = props.legendRange ?? colorPalette;
    colorMap = new Map(domain.map((v, i) => [v, range[i % range.length]]));
  }

  const fillFn = hasMissing || hasHighlight
    ? (d) =>
        hasHighlight && props.highlightKeys.includes(d[highlightKey])
          ? props.highlightColor
          : hasMissing && props.missingAttribute.includes(d[missingKey])
            ? colorPalette[19]
            : colorMap
              ? (colorMap.get(d[props.colorBy]) ?? props.barColor)
              : props.barColor
    : null;

  const fill = hasMissing || hasHighlight ? fillFn : props.colorBy || props.barColor;

  const labelMap = props.labelKey
    ? new Map(props.data.map((d) => [Number(d[props.xKey]), d[props.labelKey]]))
    : null;

  // Format function for the x (numeric/value) channel in tooltips.
  // Preserves the existing showProportion behavior and adds optional '%' suffix
  // and optional tooltip label prefix via xTooltipLabel.
  const formatXValue = (d) => {
    if (typeof d === "number") {
      const text = d.toLocaleString(undefined, {
        maximumFractionDigits: props.tooltipDecimalPlaces,
      });
      const suffix = props.appendPercentX ? "%" : "";
      if (props.showProportion && total > 0) {
        if (labelMap && labelMap.has(d)) {
          return `${text}${suffix} (${labelMap.get(d)})`;
        }
        const pct = ((d / total) * 100).toFixed(props.tooltipDecimalPlaces);
        return `${text}${suffix} (${pct}%)`;
      }
      const value = `${text}${suffix}`;
      return props.xTooltipLabel ? `${props.xTooltipLabel}: ${value}` : value;
    }
    return d;
  };

  // Format function for the y (numeric/value) channel in tooltips.
  // Mirrors formatXValue for the vertical chart orientation.
  const formatYValue = (d) => {
    if (typeof d === "number") {
      const text = d.toLocaleString(undefined, {
        maximumFractionDigits: props.tooltipDecimalPlaces,
      });
      const suffix = props.appendPercentY ? "%" : "";
      const value = `${text}${suffix}`;
      return props.yTooltipLabel ? `${props.yTooltipLabel}: ${value}` : value;
    }
    return d;
  };

  const horizontalTipFormat = {
    format: { x: formatXValue, y: false, fill: false },
  };

  const verticalTipFormat = {
    format: { y: formatYValue, x: false, fill: false },
  };

  // Normalize the legacy single-value props together with the new array
  // props into one list of fully-specified line definitions.
  const hLineList = normalizeLines(props.hLine, props.hLines);
  const vLineList = normalizeLines(props.vLine, props.vLines);

  // Available pixel width for the plot area itself (excluding margins), used to size
  // x-axis ticks/rotation so labels don't overlap regardless of orientation.
  const plotAreaWidth = props.width - props.marginLeft - props.marginRight;

  // Create chart
  const chart = props.horizontal
    ? (() => {
        const hLineMarks = buildHLineMarks(hLineList, props.fontSize);
        const vLineMarks = buildVLineMarks(vLineList, props.fontSize);

        return Plot.plot({
          marginLeft: props.marginLeft,
          marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          marginRight: props.marginRight,
          height: props.height,
          width: props.width,
          fx: props.groupBy,
          style: {
            fontSize: `${props.fontSize}px`,
            fontFamily: defaultFontFamily,
            background: "transparent",
          },
          y: {
            label: props.yLabel,
            labelAnchor: "center",
            labelArrow: "none",
            ...(props.categoryOrder && { domain: props.categoryOrder }),
          },
          x: {
            label: props.xLabel,
            labelAnchor: "center",
            labelArrow: "none",
            ...(props.xMin !== null && props.xMax !== null
              ? { domain: [props.xMin, props.xMax] }
              : {}),
            grid: true,
            // x is the numeric value axis in horizontal orientation: size the number of
            // ticks (tick-multiple-stepped, integer-stepped, or auto-rounded) to the
            // available plot width so labels don't overlap. The categoryKey passed in
            // must match the actual y/band channel used by the marks below - yKey when
            // stacked, colorBy || yKey otherwise - so the domain estimate accounts for
            // Plot's implicit stacking.
            ticks: computeNumericTicks(
              props.data,
              props.xKey,
              props.stacked ? props.yKey : (props.colorBy || props.yKey),
              props.groupBy,
              props.xMin,
              props.xMax,
              props.integerTicks,
              props.fontSize,
              props.tooltipDecimalPlaces,
              props.width,
              props.marginLeft,
              props.marginRight,
              props.tickMultiple,
            ),
            ...((props.integerTicks || props.tickMultiple) && {
              tickFormat: (d) => d.toLocaleString(),
            }),
          },
          color: {
            legend: props.showLegend,
            style: { fontSize: `${props.fontSize}px` },
            ...(props.legendDomain
              ? { domain: props.legendDomain }
              : hasMissing && props.colorBy
                ? {
                    domain: [...new Set(props.data.map((d) => d[props.colorBy]))],
                  }
                : {}),
            range: props.legendRange || colorPalette,
          },
          marks: [
            props.stacked
              ? Plot.barX(
                  props.data,
                  Plot.stackX({
                    y: props.yKey,
                    x: props.xKey,
                    fx: props.groupBy,
                    fill: (hasMissing || hasHighlight) ? fillFn : props.colorBy,
                    ...(props.legendDomain && { order: props.legendDomain }),
                    tip: horizontalTipFormat,
                  }),
                )
              : Plot.barX(props.data, {
                  y: props.colorBy || props.yKey,
                  x: props.xKey,
                  fx: props.groupBy,
                  fill: fill,
                  sort: getSortOrder(props.sortOrder, props.horizontal),
                  tip: horizontalTipFormat,
                }),
            Plot.ruleX([0]),
            ...hLineMarks,
            ...vLineMarks,
            props.showLabels && !props.stacked
              ? Plot.text(props.data, {
                  x: props.xKey,
                  y: props.colorBy || props.yKey,
                  text: (d) =>
                    props.labelKey && d[props.labelKey] != null
                      ? String(d[props.labelKey])
                      : Number(d[props.xKey]).toLocaleString(),
                  textAnchor: "start",
                  dx: 4,
                  sort: getSortOrder(props.sortOrder, props.horizontal),
                })
              : null,
            props.showLabels && props.stacked
              ? Plot.text(
                  props.data,
                  Plot.stackX({
                    x: props.xKey,
                    y: props.yKey,
                    fill: props.colorBy,
                    text: (d) =>
                      props.labelKey && d[props.labelKey] != null
                        ? String(d[props.labelKey])
                        : Number(d[props.xKey]).toLocaleString(),
                    textAnchor: "middle",
                    ...(props.legendDomain && { order: props.legendDomain }),
                  }),
                )
              : null,
          ],
        });
      })()
    : (() => {
        const hLineMarks = buildHLineMarks(hLineList, props.fontSize);
        const vLineMarks = buildVLineMarks(vLineList, props.fontSize);

        return Plot.plot({
          marginBottom: props.marginBottom,
          marginTop: props.marginTop,
          marginLeft: props.marginLeft,
          marginRight: props.marginRight,
          height: props.height,
          width: props.width,
          fx: props.groupBy,
          style: {
            fontSize: `${props.fontSize}px`,
            fontFamily: defaultFontFamily,
            background: "transparent",
          },
          x: {
            // x is the categorical axis in vertical orientation: only rotate labels
            // (matching the original fixed -45 deg) when they wouldn't otherwise fit
            // in the width available per category; keep them horizontal when they do.
            tickRotate: computeCategoricalTickRotation(
              props.data,
              props.colorBy || props.yKey,
              props.categoryOrder,
              plotAreaWidth,
              props.fontSize,
            ),
            label: props.xLabel,
            labelAnchor: "center",
            labelArrow: "none",
            ...(props.categoryOrder && { domain: props.categoryOrder }),
          },
          y: {
            grid: true,
            label: props.yLabel,
            labelAnchor: "center",
            labelArrow: "none",
            ...(props.yMin !== null && props.yMax !== null
              ? { domain: [props.yMin, props.yMax] }
              : {}),
            ...((props.integerTicks || props.tickMultiple) && {
              // Same categoryKey resolution as the horizontal x-ticks case above,
              // adapted to the vertical orientation's x/band channel.
              ticks: computeNumericTicks(
                props.data,
                props.xKey,
                props.stacked ? props.yKey : (props.colorBy || props.yKey),
                props.groupBy,
                props.yMin,
                props.yMax,
                props.integerTicks,
                props.fontSize,
                props.tooltipDecimalPlaces,
                null,
                0,
                0,
                props.tickMultiple,
              ),
              tickFormat: (d) => d.toLocaleString(),
            }),
          },
          color: {
            legend: props.showLegend,
            style: { fontSize: `${props.fontSize}px` },
            ...(props.legendDomain
              ? { domain: props.legendDomain }
              : hasMissing && props.colorBy
                ? {
                    domain: [...new Set(props.data.map((d) => d[props.colorBy]))],
                  }
                : {}),
            range: props.legendRange || colorPalette,
          },
          marks: [
            props.stacked
              ? Plot.barY(
                  props.data,
                  Plot.stackY({
                    x: props.yKey,
                    y: props.xKey,
                    fx: props.groupBy,
                    fill: (hasMissing || hasHighlight) ? fillFn : props.colorBy,
                    ...(props.legendDomain && { order: props.legendDomain }),
                    tip: verticalTipFormat,
                  }),
                )
              : Plot.barY(props.data, {
                  x: props.colorBy || props.yKey,
                  y: props.xKey,
                  fx: props.groupBy,
                  fill: fill,
                  sort: getSortOrder(props.sortOrder, props.horizontal),
                  tip: verticalTipFormat,
                }),
            Plot.ruleY([0]),
            ...hLineMarks,
            ...vLineMarks,
            props.showLabels && !props.stacked
              ? Plot.text(props.data, {
                  x: props.colorBy || props.yKey,
                  y: props.xKey,
                  text: (d) =>
                    props.labelKey && d[props.labelKey] != null
                      ? String(d[props.labelKey])
                      : Number(d[props.xKey]).toLocaleString(),
                  textAnchor: "middle",
                  dy: -6,
                  sort: getSortOrder(props.sortOrder, props.horizontal),
                })
              : null,
            props.showLabels && props.stacked
              ? Plot.text(
                  props.data,
                  Plot.stackY({
                    x: props.yKey,
                    y: props.xKey,
                    fill: props.colorBy,
                    text: (d) =>
                      props.labelKey && d[props.labelKey] != null
                        ? String(d[props.labelKey])
                        : Number(d[props.xKey]).toLocaleString(),
                    textAnchor: "middle",
                    ...(props.legendDomain && { order: props.legendDomain }),
                  }),
                )
              : null,
          ],
        });
      })();

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.barColor, renderChart);
watch(() => props.horizontal, renderChart);
watch(() => props.groupBy, renderChart);
watch(() => props.colorBy, renderChart);
watch(() => props.stacked, renderChart);
watch(() => props.showProportion, renderChart);
watch(() => props.tooltipDecimalPlaces, renderChart);
watch(() => props.legendDomain, renderChart, { deep: true });
watch(() => props.legendRange, renderChart, { deep: true });
watch(() => props.showLegend, renderChart);
watch(() => props.categoryOrder, renderChart, { deep: true });
watch(() => props.xMin, renderChart);
watch(() => props.xMax, renderChart);
watch(() => props.yMin, renderChart);
watch(() => props.yMax, renderChart);
watch(() => props.fontSize, renderChart);
watch(() => props.showLabels, renderChart);
watch(() => props.labelKey, renderChart);
watch(() => props.missingAttribute, renderChart, { deep: true });
watch(() => props.highlightKeys, renderChart, { deep: true });
watch(() => props.highlightColor, renderChart);
watch(() => props.integerTicks, renderChart);
watch(() => props.tickMultiple, renderChart);
watch(() => props.hLine, renderChart);
watch(() => props.vLine, renderChart);
watch(() => props.hLines, renderChart, { deep: true });
watch(() => props.vLines, renderChart, { deep: true });
watch(() => props.xTooltipLabel, renderChart);
watch(() => props.yTooltipLabel, renderChart);
watch(() => props.appendPercentX, renderChart);
watch(() => props.appendPercentY, renderChart);
watch(() => props.width, renderChart);
watch(() => props.marginLeft, renderChart);
watch(() => props.marginRight, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = "";
  }
});
</script>
