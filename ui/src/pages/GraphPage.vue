<script setup lang="ts">
import { GraphMaker, GraphMakerSettings } from "@milaboratories/graph-maker";
import '@milaboratories/graph-maker/styles';
import { useApp } from "../app";

const app = useApp();

const settings = {
  chartType: 'discrete',
  template: 'box',
  title: 'Gene expression',
   } as GraphMakerSettings;
</script>

<template>
    <graph-maker :pFrame="app.model.outputs.topTablePf" v-model="settings" />
</template>