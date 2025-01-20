<script setup lang="ts">
import { GraphMaker, GraphMakerProps, PredefinedGraphOption } from "@milaboratories/graph-maker";
import '@milaboratories/graph-maker/styles';
import { useApp } from "../app";

const app = useApp();

const defaultOptions: PredefinedGraphOption<"scatterplot">[] = [
  {
    inputName: "x",
    selectedSource: {
      kind: "PColumn",
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
    inputName: "y",
    selectedSource: {
      kind: "PColumn",
      name: "pl7.app/rna-seq/minlog10padj",
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
    inputName: "grouping",
    selectedSource: {
      kind: "PColumn",
      name: "pl7.app/rna-seq/regulationDirection",
      valueType: "String",
      axesSpec: [
        {
          name: "pl7.app/Geneid",
          type: "String"
        }
      ]
    }
  },
  {
    inputName: "label",
    selectedSource: {
      kind: 'PColumn',
      name: "pl7.app/rna-seq/genesymbol",
      valueType: "String",
      axesSpec: [
        {
          name: "pl7.app/Geneid",
          type: "String"
        }
      ]
    }
  },
  {
    inputName: "tooltipContent",
    selectedSource: {
      kind: 'PColumn',
      name: "pl7.app/rna-seq/genesymbol",
      valueType: "String",
      axesSpec: [
        {
          name: "pl7.app/Geneid",
          type: "String"
        }
      ]
    }
  }
];
</script>

<template>
  <GraphMaker chartType="scatterplot" :p-frame="app.model.outputs.topTablePf" v-model="app.model.ui.graphState"
    :defaultOptions="defaultOptions" />
</template>