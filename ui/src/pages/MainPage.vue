<script
  setup
  lang="ts"
>
import {
  PlDataTableSettings,
  PlBlockPage,
  PlBtnGhost,
  PlMaskIcon24,
  PlSlideModal,
  PlDropdownRef,
  PlDropdown,
  PlAgDataTable,
  PlCheckbox,
  PlDropdownMulti,
  PlNumberField
} from '@platforma-sdk/ui-vue';
import { GraphMakerSettings } from '@milaboratories/graph-maker';
import { computed, ref } from 'vue';
import { useApp } from '../app';

const app = useApp();

if (app.ui === undefined) {
  app.model.ui = {
    tableState: {
      gridState: {},
      pTableParams: {
        sorting: [],
        filters: []
      }
    },
    graphState: {
      title: "Gene expression",
      chartType: "discrete",
      template: "box"
    } satisfies GraphMakerSettings
  }
};

const tableSettings = computed<PlDataTableSettings>(() => ({
  sourceType: "ptable",

  pTable: app.model.outputs.pt,

} satisfies PlDataTableSettings));

const settingsAreShown = ref(app.model.outputs.pt === undefined)
const showSettings = () => { settingsAreShown.value = true }
function showAlert() {
  alert('close item');
}

const covariatesOptions = [
  { text: "Covariate 1", value: "covariateTest1" },
  { text: "Covariate 2", value: "covariateTest2" },
  { text: "Covariate 3", value: "covariateTest3" },
];

</script>

<template>
  <PlBlockPage>
    <template #title>Gene Browser</template>
    <template #append>
      <PlBtnGhost @click.stop="showSettings">
        Settings
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>

    <PlSlideModal v-model="settingsAreShown">
      <template #title>Settings</template>
      <PlDropdownRef v-model="app.model.args.countsRef" :options="app.model.outputs.countsOptions ?? []"
        label="Select dataset" />
      <PlDropdownMulti v-model="app.model.args.covariates" :options="covariatesOptions" label="Design formula"
        placeholder="Select covariates" />
      <PlDropdown v-model="app.model.args.contrastFactor" :options="covariatesOptions"
        placeholder="Select contrast factor" label="Contrast factor" />
      <PlDropdown v-model="app.model.args.denominator" :options="covariatesOptions" placeholder="Select contrast factor"
        label="Contrast factor" />
      <PlDropdown v-model="app.model.args.numerator" :options="covariatesOptions" placeholder="Select contrast factor"
        label="Contrast factor" />
    </PlSlideModal>

    <PlAgDataTable v-if="app.model.ui" :settings="tableSettings" v-model="app.model.ui.tableState" />
  </PlBlockPage>
</template>
