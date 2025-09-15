<script setup lang="ts">
import type { PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import type { PColumnIdAndSpec } from '@platforma-sdk/model';
import { computed } from 'vue';
import { useApp } from '../app';

const app = useApp();

function getDefaultOptions(topTablePcols?: PColumnIdAndSpec[]) {
  if (!topTablePcols) {
    return undefined;
  }

  function getIndex(name: string, pcols: PColumnIdAndSpec[]): number {
    return pcols.findIndex((p) => p.spec.name === name);
  }

  const defaults: PredefinedGraphOption<'scatterplot-umap'>[] = [
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
    {
      inputName: 'tabBy',
      selectedSource: topTablePcols[getIndex('pl7.app/rna-seq/log2foldchange',
        topTablePcols)].spec.axesSpec[0],
    },
  ];

  return defaults;
}

// Steps needed to reset graph maker after changing input table
const defaultOptions = computed(() => getDefaultOptions(app.model.outputs.topTablePcols));
const key = computed(() => defaultOptions.value ? JSON.stringify(defaultOptions.value) : '');

// Reset graph maker state to allow new selection of defaults
// watch(() => app.model.outputs.topTablePcols, (topTablePcols) => {
//   delete app.model.ui.graphState.optionsState;
//   defaultOptions.value = getDefaultOptions(topTablePcols);
//   key.value = defaultOptions.value ? JSON.stringify(defaultOptions.value) : '';
// },
// // immediate - to trigger first time before first change
// // deep - for objects of complicated structure
// { deep: false, immediate: false },
// );

</script>

<template>
  <GraphMaker
    :key="key"
    v-model="app.model.ui.graphState" chartType="scatterplot-umap"
    :p-frame="app.model.outputs.topTablePf" :defaultOptions="defaultOptions"
  />
</template>
