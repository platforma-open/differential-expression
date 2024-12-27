<!-- <script setup lang="ts">
import {
    PlAgDataTable,
    PlBlockPage,
    PlBtnGhost,
    PlBtnPrimary,
    PlBtnSecondary,
    PlDataTableSettings,
    PlDialogModal,
    PlDropdown,
    PlDropdownMulti,
    PlDropdownRef,
    PlEditableTitle,
    PlMaskIcon24,
    PlSlideModal
} from '@platforma-sdk/ui-vue';
import { computed, ref } from 'vue';
import { useApp } from '../app';

const app = useApp<`/formula?id=${number}`>();

const formulaIdx = Number(app.queryParams.id)
const formula = computed({
    get: () => app.model.args.formulas[formulaIdx],
    set: (value) => app.model.args.formulas[formulaIdx] = value
});

const addFormula = async () => {
    await app.updateArgs(args => {
        args.formulas = [...args.formulas, { label: 'New formula', covariateRefs: [] }];
        return args;
    });
    app.navigateTo(`/formula?id=${app.model.args.formulas.length - 1}`);
};

const deleteFormula = async () => {
    await app.updateArgs(args => {
        args.formulas = args.formulas.slice(formulaIdx, 1)
        return args;
    });

    app.navigateTo(`/formula?id=${app.args.formulas.length - 1}`);
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

const covariateOptions = computed(() => {
    return app.model.outputs.metadataOptions?.map(v => ({
        value: v.ref,
        label: v.label
    })) ?? []
})


const contrastFactorOptions = computed(() => {
    return formula.value.covariateRefs.map((ref) => ({
        value: ref,
        label: covariateOptions.value.find((m) => m.value.name === ref.name)?.label ?? ""
    }))
})

const numeratorOptions = computed(() => {
    return app.model.outputs.denominatorOptions?.[formulaIdx]?.map(v => ({
        value: v,
        label: v
    }));
})

const denominatorOptions = computed(() => {
    return numeratorOptions.value?.filter(op => op.value !== formula.value.numerator);
})

const deleteModalOpen = ref(false);
</script>

<template>
    <PlBlockPage>
        <template #title>
            <PlEditableTitle v-model="formula.label" />
        </template>
        <template #append>
            <PlBtnGhost @click.stop="showSettings">
                Settings
                <template #append>
                    <PlMaskIcon24 name="settings" />
                </template>
            </PlBtnGhost>
            <PlBtnSecondary @click="addFormula" icon="add">New formula
                <template #append>
                    <PlMaskIcon24 name="add" />
                </template>
            </PlBtnSecondary>
        </template>

        <PlSlideModal v-model="settingsAreShown">
            <template #title>Settings</template>
            <PlDropdownRef v-model="app.model.args.countsRef" :options="app.model.outputs.countsOptions"
                label="Select dataset" />
            <PlDropdownMulti v-model="formula.covariateRefs" :options="covariateOptions" label="Design formula" />
            <PlDropdown v-model="formula.contrastFactor" :options="contrastFactorOptions" label="Contrast factor" />
            <PlDropdown v-model="formula.numerator" :options="numeratorOptions" label="Numerator" />
            <PlDropdown v-model="formula.denominator" :options="denominatorOptions" label="Denominator" />

            <PlBtnSecondary @click="() => (deleteModalOpen = true)" icon="delete-bin"
                :disabled="app.model.args.formulas.length == 1">Delete Formula
            </PlBtnSecondary>
        </PlSlideModal>

        <PlAgDataTable v-if="app.model.ui" :settings="tableSettings" v-model="app.model.ui.tableState" />
    </PlBlockPage> -->

    <!-- Delete dataset confirmation dialog -->
    <!-- <PlDialogModal v-model="deleteModalOpen">
        <div :style="{ marginBottom: '10px' }">Are you sure?</div>
        <div class="d-flex gap-4">
            <PlBtnPrimary @click="deleteFormula">Delete</PlBtnPrimary>
            <PlBtnSecondary @click="() => (deleteModalOpen = false)">Cancel</PlBtnSecondary>
        </div>
    </PlDialogModal>
</template> -->
