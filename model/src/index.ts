import { GraphMakerState } from '@milaboratories/graph-maker';
import {
  BlockModel,
  createPlDataTable,
  InferOutputsType,
  isPColumn,
  isPColumnSpec,
  PFrameHandle,
  PlDataTableState,
  PlRef,
  ValueType
} from '@platforma-sdk/model';

export type UiState = {
  tableState: PlDataTableState;
  graphState: GraphMakerState;
};

// export type Formula = {
//   // we put formula label in the arg as it will be used
//   // in the annotations to re-use in the downstream blocks
//   label: string;
//   covariateRefs: PlRef[];
//   contrastFactor?: PlRef;
//   denominator?: String;
//   numerator?: String;
// };

export type BlockArgs = {
  countsRef?: PlRef;
  // formulas: Formula[];
  covariateRefs: PlRef[];
  contrastFactor?: PlRef;
  denominator?: String;
  numerator?: String;
};

export const model = BlockModel.create()

  .withArgs<BlockArgs>({
    // formulas: [
    //   {
    //     label: 'Formula',
    //     covariateRefs: []
    //   }
    // ]
    covariateRefs: []
  })

  .withUiState<UiState>({
    tableState: {
      gridState: {},
      pTableParams: {
        sorting: [],
        filters: []
      }
    },
    graphState: {
      title: 'Differential gene expression',
      template: 'dots'
    }
  })

  // User can only select as input raw gene count matrices
  // includeNativeLabel ensures raw counts pl7.app/label (native label, 'Raw gene expression')
  // is visible in selection (by default we see Samples & data ID)
  // addLabelAsSuffix moves the native label to the end
  // Result: [dataID] / Raw gene expression
  .output('countsOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && 
                                        spec.name === 'countMatrix' &&
                                        spec.annotations?.['pl7.app/rna-seq/normalized'] === 'false'
                                ,{includeNativeLabel: true, addLabelAsSuffix:true})
  )

  .output('metadataOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'pl7.app/metadata')
  )

  .output('datasetSpec', (ctx) => {
    if (ctx.args.countsRef) return ctx.resultPool.getSpecByRef(ctx.args.countsRef);
    else return undefined;
  })

  .output('denominatorOptions', (ctx) => {
    if (!ctx.args.contrastFactor) return undefined;

    const data = ctx.resultPool.getDataByRef(ctx.args.contrastFactor)?.data;

    // @TODO need a convenient method in API
    const values = data?.getDataAsJson<Record<string, string>>()?.['data'];
    if (!values) return undefined;

    return [...new Set(Object.values(values))];
  })

  /**
   * Returns array of options, i-th element of the array contains list of options for i-th formula
   */
  // .output('denominatorOptions', (ctx) => {
  //   return ctx.args.formulas.map((f) => {
  //     if (!f.contrastFactor) return undefined;
  //     const data = ctx.resultPool.getDataByRef(f.contrastFactor)?.data;

  //     // @TODO need a convenient method in API
  //     // @TODO also should be filtered ONLY to the data existing in the dataset
  //     const values = data?.getDataAsJson<Record<string, string>>()?.['data'];

  //     if (!values) return undefined;

  //     return [...new Set(Object.values(values))];
  //   });
  // })

  /**
   * Returns a map of results
   */
  .output('pt', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPlDataTable(ctx, pCols, ctx.uiState?.tableState);
  })

  .output('topTablePf', (ctx): PFrameHandle | undefined => {
    var pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }
     // Allow only log2 FC and -log10 Padjust as options for volcano axis
     // Include gene symbol for future filters
     pCols = pCols.filter(
                col => col.spec.name === "pl7.app/rna-seq/log2foldchange" || 
                        col.spec.name === "pl7.app/rna-seq/minlog10padj" ||
                        col.spec.name === "pl7.app/rna-seq/genesymbol"
    );


    // enriching with upstream data
    const valueTypes = ['Int', 'Float', 'Double', 'String'] as ValueType[];
    const upstream = ctx.resultPool
      .getData()
      .entries.map((v) => v.obj)
      .filter(isPColumn)
      .filter((column) => valueTypes.find((valueType) => (valueType === column.spec.valueType) &&
                                                          (column.id.includes("metadata"))
                                          )
    );

    return ctx.createPFrame([...pCols, ...upstream]);
  })

  // .sections((ctx) => {
  //   return [
  //     ...ctx.args.formulas.map((f, i) => ({
  //       type: 'link' as const,
  //       href: `/formula?id=${i}` as const,
  //       label: f.label
  //     })),
  //     { type: 'delimiter' },
  //     { type: 'link', href: '/graph', label: 'Volcano plot' }
  //   ];
  // })

  .sections([
    { type: 'link', href: '/', label: 'Contrast' },
    { type: 'link', href: '/graph', label: 'Volcano plot' }
  ])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
