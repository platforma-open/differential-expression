import { model } from '@platforma-open/milaboratories.differential-expression.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import FormulaPage from './pages/FormulaPage.vue';
import GraphPage from './pages/GraphPage.vue';

export const sdkPlugin = defineApp(model, () => {
  return {
    // defaultRoute: ,
    routes: {
      '/formula': () => FormulaPage,
      '/graph': () => GraphPage
    }
  };
});

export const useApp = sdkPlugin.useApp;
