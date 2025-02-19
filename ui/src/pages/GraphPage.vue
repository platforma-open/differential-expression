<script setup lang="ts">
import type { GraphMakerProps } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import { useApp } from '../app';
import { computed, ref, watch } from 'vue';
import { listToOptions, PlDropdown } from '@platforma-sdk/ui-vue';
import type { PColumnIdAndSpec } from '@platforma-sdk/model';

const app = useApp();

// Set defaults (only set on first execution)
const defaultOptions = computed((): GraphMakerProps['defaultOptions'] => {
  const topTablePcols = app.model.outputs.topTablePcols;

  if (!topTablePcols) {
    return undefined;
  }

  function getIndex(name: string, pcols: PColumnIdAndSpec[]): number {
    return pcols.findIndex((p) => p.spec.name === name);
  }

  const defaults: GraphMakerProps['defaultOptions'] = [
    {
      inputName: 'x',
      selectedSource: topTablePcols[getIndex('pl7.app/rna-seq/log2foldchange',
        topTablePcols)].spec,
    },
    {
      inputName: 'y',
      selectedSource: topTablePcols[getIndex('pl7.app/rna-seq/minlog10padj',
        topTablePcols)].spec,
    },
    {
      inputName: 'grouping',
      selectedSource: topTablePcols[getIndex('pl7.app/rna-seq/regulationDirection',
        topTablePcols)].spec,
    },
    {
      inputName: 'label',
      selectedSource: topTablePcols[getIndex('pl7.app/rna-seq/genesymbol',
        topTablePcols)].spec,
    },
    {
      inputName: 'tooltipContent',
      selectedSource: topTablePcols[getIndex('pl7.app/rna-seq/genesymbol',
        topTablePcols)].spec,
    },
  ];

  return defaults;
});

// Generate list of comparisons with all possible numerator x denominator combinations
const comparisonOptions = computed(() => {
  const options: string[] = [];
  if (app.model.args.numerators.length !== 0
    && app.model.args.denominator !== undefined) {
    for (const num of app.model.args.numerators) {
      options.push(num + ' - vs - ' + app.model.args.denominator);
    }
  }
  return listToOptions(options);
});

const key = ref('');
// Reset graph maker state to allow new selection of defaults
watch(() => defaultOptions.value, () => {
  delete app.model.ui.graphState.optionsState;
  key.value = app.model.ui.comparison ?? '';
},
// immediate - to trigger first time before first change
// deep - for objects of complicated structure
{ deep: false, immediate: false },
);

</script>

<template>
  <GraphMaker
    :key="key"
    v-model="app.model.ui.graphState" chartType="scatterplot"
    :p-frame="app.model.outputs.topTablePf" :defaultOptions="defaultOptions"
  >
    <template #titleLineSlot>
      <PlDropdown
        v-model="app.model.ui.comparison" :options="comparisonOptions"
        label="Comparison" :style="{ width: '300px' }"
      >
        <template #tooltip>
          Select the specific Numerator - vs - Denominator comparison to be shown in table and plots
        </template>
      </PlDropdown>
    </template>
  </GraphMaker>
</template>
