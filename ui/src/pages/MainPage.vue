<script setup lang="ts">
import {
  PlAgDataTable,
  PlBlockPage,
  PlBtnGhost,
  PlDataTableSettings,
  PlDropdown,
  PlDropdownMulti,
  PlDropdownRef,
  PlMaskIcon24,
  PlSlideModal
} from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from '../app';

const app = useApp();

const tableSettings = computed<PlDataTableSettings>(() => ({
  sourceType: "ptable",

  pTable: app.model.outputs.pt,

} satisfies PlDataTableSettings));

const settingsAreShown = ref(app.model.outputs.pt === undefined)
const showSettings = () => { settingsAreShown.value = true }
function showAlert() {
  alert('close item');
}

const covariateOptions = computed(() => {
  return app.model.outputs.covariateOptions?.map(v => ({
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

const numeratorOptions = computed(() => {
  return app.model.outputs.denominatorOptions?.map(v => ({
    value: v,
    label: v
  }));
})

const denominatorOptions = computed(() => {
  return numeratorOptions.value?.filter(op => op.value !== app.model.args.numerator);
})

</script>

<template>
  <PlBlockPage>
    <template #title>Differential Gene Expression</template>
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
      <PlDropdownRef v-model="app.model.args.countsRef" :options="app.model.outputs.countsOptions"
        label="Select dataset" />
      <PlDropdownMulti v-model="app.model.args.covariateRefs" :options="covariateOptions" label="Design formula" />
      <PlDropdown v-model="app.model.args.contrastFactor" :options="contrastFactorOptions" label="Contrast factor" />
      <PlDropdown v-model="app.model.args.numerator" :options="numeratorOptions" label="Numerator" />
      <PlDropdown v-model="app.model.args.denominator" :options="denominatorOptions" label="Denominator" />
    </PlSlideModal>

    <PlAgDataTable v-if="app.model.ui" :settings="tableSettings" v-model="app.model.ui.tableState" />
  </PlBlockPage>
</template>
