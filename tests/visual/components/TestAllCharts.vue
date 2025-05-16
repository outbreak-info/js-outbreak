<template>
  <div class="test-container">
    <h1>Charts Testing Dashboard</h1>

    <div class="dashboard-layout">
      <!-- Left sidebar menu -->
      <div class="sidebar-menu">
        <button
            v-for="(tab, index) in tabs"
            :key="index"
            @click="currentTab = tab.id"
            :class="{ 'active-tab': currentTab === tab.id }"
            class="menu-button"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Main content area -->
      <div class="tab-content">
        <div v-if="currentTab === 'all'" class="all-charts-view">
          <div
              v-for="(component, index) in chartComponents"
              :key="index"
              class="chart-component"
          >
            <component :is="component" />
          </div>
        </div>

        <div v-else class="single-chart-view">
          <component :is="currentComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Define a generic component type
type ComponentType = any

// Define the type for tab objects
interface TabItem {
  id: string;
  name: string;
  component?: ComponentType;
}

// Import all test components
const modules = import.meta.glob('./Test*.vue'); //TODO: What if import.meta is not supported?
const chartComponents = ref<ComponentType[]>([]);
const tabs = ref<TabItem[]>([{ id: 'all', name: 'All Charts', component: null }]);

const loadComponents = async () => {
  const moduleEntries = Object.entries(modules);

// Sort modules alphabetically
  moduleEntries.sort(([pathA], [pathB]) => {
    const nameA = pathA.replace('./', '').replace('.vue', '');
    const nameB = pathB.replace('./', '').replace('.vue', '');
    return nameA.localeCompare(nameB);
  });

// Process all components
  const componentResults = await Promise.all(
      moduleEntries.map(async ([path, importFunc]) => {
        const componentName = path.replace('./', '').replace('.vue', '');
        if (componentName === 'TestAllCharts') return null;

        const imported = await (importFunc as () => Promise<{ default: ComponentType }>)();
        const component = imported.default;

        const prefixName = componentName
            .replace('Test', '')
            .replace(/([A-Z])/g, ' $1');
        const displayName = prefixName.trim();
        const tabId = prefixName.toLowerCase();

        return {
          id: tabId,
          name: displayName,
          component: component
        };
      })
  )

  componentResults
      .filter(result => result !== null)
      .forEach(info => {
        if (info) {
          // Add to tabs
          tabs.value.push({
            id: info.id,
            name: info.name,
            component: info.component
          });

          // Add to "All" view
          chartComponents.value.push(info.component);
        }
      });
}


const currentTab = ref('all');

// Compute the current component based on the selected tab
const currentComponent = computed(() => {
  const tab = tabs.value.find(t => t.id === currentTab.value);
  return tab ? tab.component : null;
})

onMounted(() => {
  loadComponents();
});
</script>

<style scoped>
.test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.dashboard-layout {
  display: flex;
  gap: 20px;
}

/* Left sidebar menu */
.sidebar-menu {
  width: 250px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
  padding-right: 15px;
}

.menu-button {
  padding: 12px;
  text-align: left;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  cursor: pointer;
  font-size: 15px;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: all 0.2s;
  width:250px;
}

.menu-button:hover {
  background-color: #f5f5f5;
}

.active-tab {
  border-left: 3px solid #4CAF50;
  background-color: #f0f9f0;
}

/* Main content area */
.tab-content {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-component {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

.chart-component:last-child {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar-menu {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }

  .menu-button {
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .active-tab {
    border-left: none;
    border-bottom: 3px solid #4CAF50;
  }
}
</style>