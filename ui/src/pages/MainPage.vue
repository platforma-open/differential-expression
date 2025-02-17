<script setup lang="ts">
import {
  listToOptions,
  PlAgDataTable,
  PlAgDataTableToolsPanel,
  PlBlockPage,
  PlBtnGhost,
  PlDataTableSettings,
  PlDropdown,
  PlDropdownMulti,
  PlDropdownRef,
  PlMaskIcon24,
  PlSlideModal
} from '@platforma-sdk/ui-vue';
import { computed, reactive, ref } from 'vue';
import { useApp } from '../app';
import ErrorBoundary from '../components/ErrorBoundary.vue';

const app = useApp();

const tableSettings = computed<PlDataTableSettings>(() => ({
  sourceType: "ptable",
  pTable: app.model.outputs.pt,
}));

const settingsAreShown = ref(app.model.outputs.pt === undefined)
const showSettings = () => { settingsAreShown.value = true }

const covariateOptions = computed(() => {
  return app.model.outputs.metadataOptions?.map(v => ({
    value: v.ref,
    label: v.label
  })) ?? []
})



const contrastFactorOptions = computed(() => {
  return app.model.args.covariateRefs.map((ref) => ({
    value: ref,
    label: covariateOptions.value.find((m) => m.value.name === ref.name)?.label ?? ""
  }))
})


// Generate list of comparisons with all possible numerator x denominator combinations
const comparisonOptions = computed(() => {
  let options: string[] = [];
  if (app.model.args.numerators.length !== 0 &&
        app.model.args.denominator !== undefined) {
      
      for (var num of app.model.args.numerators) {
        options.push(num + " - vs - " + app.model.args.denominator)
          }
      // Select first option when available
      if (app.model.args.comparison === undefined) {
        app.model.args.comparison = options[0]
      }
  }
  return listToOptions(options);
})

const numeratorOptions = computed(() => {
  return app.model.outputs.denominatorOptions?.map(v => ({
    value: v,
    label: v
  }));
})

// Only options not selected as numerators[] are accepted as denominator
const denominatorOptions = computed(() => {
  return numeratorOptions.value?.filter(op => 
                                  !app.model.args.numerators.includes(op.value));
})

</script>

<template>
  <PlBlockPage>
    <template #title>Differential Gene Expression</template>
    <PlDropdown v-model="app.model.args.comparison" :options="comparisonOptions" label="Comparison" >
      <template #tooltip>
          Select the specific Numerator - vs - Denominator comparison to be shown in table and plots
      </template>
    </PlDropdown>
    <template #append>
      <PlAgDataTableToolsPanel>
        <PlBtnGhost @click.stop="showSettings">
          Settings
          <template #append>
            <PlMaskIcon24 name="settings" />
          </template>
        </PlBtnGhost>
      </PlAgDataTableToolsPanel>
    </template>
    <ErrorBoundary>
      <PlAgDataTable
        :settings="tableSettings"
        v-model="app.model.ui.tableState"
        show-columns-panel
        show-export-button
      />
    </ErrorBoundary>
    <PlSlideModal v-model="settingsAreShown">
      <template #title>Settings</template>
      <PlDropdownRef v-model="app.model.args.countsRef" :options="app.model.outputs.countsOptions"
        label="Select dataset" />
      <PlDropdownMulti v-model="app.model.args.covariateRefs" :options="covariateOptions" label="Design" />
      <PlDropdown v-model="app.model.args.contrastFactor" :options="contrastFactorOptions" label="Contrast factor" />
      <PlDropdownMulti v-model="app.model.args.numerators" :options="numeratorOptions" label="Numerator" >
        <template #tooltip>
          Calculate a contrast per each one of the selected Numerators versus the selected control/baseline
        </template>
      </PlDropdownMulti>
      <PlDropdown v-model="app.model.args.denominator" :options="denominatorOptions" label="Denominator" />
    </PlSlideModal>
  </PlBlockPage>
</template>
