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

function computeIntegerTicks(
  data,
  valueKey,
  categoryKey,
  stacked,
  propMin,
  propMax,
) {
  if (!data || data.length === 0) return [];

  let effectiveMax;
  if (propMax !== null) {
    effectiveMax = propMax;
  } else if (stacked) {
    const sums = data.reduce((acc, d) => {
      const cat = d[categoryKey];
      acc[cat] = (acc[cat] || 0) + Number(d[valueKey] || 0);
      return acc;
    }, {});
    effectiveMax = Math.max(...Object.values(sums));
  } else {
    effectiveMax = Math.max(...data.map((d) => Number(d[valueKey] || 0)));
  }

  const min = Math.floor(propMin !== null ? propMin : 0);
  const max = Math.ceil(effectiveMax);
  if (!isFinite(min) || !isFinite(max) || max <= min)
    return [min, max].filter(isFinite);

  const step = Math.max(1, Math.ceil((max - min) / 10));
  const ticks = [];
  for (let t = min; t <= max; t += step) ticks.push(t);
  return ticks;
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

  let colorMap = null;
  if (hasMissing && props.colorBy) {
    const domain = props.legendDomain ?? [
      ...new Set(props.data.map((d) => d[props.colorBy])),
    ];
    const range = props.legendRange ?? colorPalette;
    colorMap = new Map(domain.map((v, i) => [v, range[i % range.length]]));
  }

  const fillFn = hasMissing
    ? (d) =>
        props.missingAttribute.includes(d[missingKey])
          ? colorPalette[19]
          : colorMap
            ? (colorMap.get(d[props.colorBy]) ?? props.barColor)
            : props.barColor
    : null;

  const fill = hasMissing ? fillFn : props.colorBy || props.barColor;

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
            ...(props.integerTicks && {
              ticks: computeIntegerTicks(
                props.data,
                props.xKey,
                props.yKey,
                props.stacked,
                props.xMin,
                props.xMax,
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
              ? Plot.barX(
                  props.data,
                  Plot.stackX({
                    y: props.yKey,
                    x: props.xKey,
                    fx: props.groupBy,
                    fill: hasMissing ? fillFn : props.colorBy,
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
            tickRotate: -45,
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
            ...(props.integerTicks && {
              ticks: computeIntegerTicks(
                props.data,
                props.xKey,
                props.yKey,
                props.stacked,
                props.yMin,
                props.yMax,
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
                    fill: hasMissing ? fillFn : props.colorBy,
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
watch(() => props.integerTicks, renderChart);
watch(() => props.hLine, renderChart);
watch(() => props.vLine, renderChart);
watch(() => props.hLines, renderChart, { deep: true });
watch(() => props.vLines, renderChart, { deep: true });
watch(() => props.xTooltipLabel, renderChart);
watch(() => props.yTooltipLabel, renderChart);
watch(() => props.appendPercentX, renderChart);
watch(() => props.appendPercentY, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = "";
  }
});
</script>
