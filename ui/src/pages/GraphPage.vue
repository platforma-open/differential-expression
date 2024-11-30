<script setup lang="ts">
import { GraphMaker, GraphMakerSettings } from "@milaboratories/graph-maker";
import '@milaboratories/graph-maker/styles';
import { useApp } from "../app";

const app = useApp();

const settings = {
  chartType: 'scatterplot',
  template: 'dots',
  title: 'Differentially expressed genes',
  defaultOptions:[
    {
      inputName: 'x',
      selectedSource: {
        kind: 'PColumn',
        name: "pl7.app/rna-seq/log2foldchange",
        valueType: "Double",
        axesSpec: [
          {
            name: "pl7.app/Geneid",
            type: "String"
          }
        ]
      }
    },
    {
      inputName: 'y',
      selectedSource: {
        kind: 'PColumn',
        name: "pl7.app/rna-seq/minlog10padj",
        valueType: "Double",
        axesSpec: [
          {
            name: "pl7.app/Geneid",
            type: "String"
          }
        ]
      }
    }
  ]
   } as GraphMakerSettings;
</script>

<template>
    <graph-maker :pFrame="app.model.outputs.topTablePf" v-model="settings" />
</template>