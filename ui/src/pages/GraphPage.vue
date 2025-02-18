<script setup lang="ts">
import type { GraphMakerProps } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import { useApp } from '../app';
import { computed } from 'vue';

const app = useApp();

const defaultOptions = computed((): GraphMakerProps['defaultOptions'] => {
  const topTablePcols = app.model.outputs.topTablePcols;

  if (!topTablePcols) {
    return undefined;
  }

  const defaults: GraphMakerProps['defaultOptions'] = [
    // log2foldchange
    {
      inputName: 'x',
      selectedSource: topTablePcols[2].spec,
    },
    // minlog10padj
    {
      inputName: 'y',
      selectedSource: topTablePcols[1].spec,
    },
    // regulationDirection
    {
      inputName: 'grouping',
      selectedSource: topTablePcols[3].spec,
    },
    // genesymbol
    {
      inputName: 'label',
      selectedSource: topTablePcols[0].spec,
    },
    // genesymbol
    {
      inputName: 'tooltipContent',
      selectedSource: topTablePcols[0].spec,
    },
  ];

  return defaults;
});

</script>

<template>
  <GraphMaker
    v-model="app.model.ui.graphState" chartType="scatterplot" :p-frame="app.model.outputs.topTablePf"
    :defaultOptions="defaultOptions"
  />
</template>
