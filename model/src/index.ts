import type { GraphMakerState } from '@milaboratories/graph-maker';
import type {
  InferOutputsType,
  PColumn,
  PColumnIdAndSpec,
  PFrameHandle,
  PlDataTableStateV2,
  PlRef,
  TreeNodeAccessor,
} from '@platforma-sdk/model';
import {
  BlockModel,
  createPFrameForGraphs,
  createPlDataTableSheet,
  createPlDataTableStateV2,
  createPlDataTableV2,
  getUniquePartitionKeys,
  isPColumnSpec,
} from '@platforma-sdk/model';

export type UiState = {
  tableState: PlDataTableStateV2;
  graphState: GraphMakerState;
};

export type BlockArgs = {
  countsRef?: PlRef;
  // formulas: Formula[];
  covariateRefs: PlRef[];
  contrastFactor?: PlRef;
  denominator?: string;
  numerators: string[];
  log2FCThreshold: number;
  pAdjThreshold: number;
};

// get main Pcols for plot and tables
function filterPcols(pCols: PColumn<TreeNodeAccessor>[]): PColumn<TreeNodeAccessor>[] {
  // Allow only log2 FC and -log10 Padjust as options for volcano axis
  pCols = pCols.filter(
    (col) => (col.spec.name === 'pl7.app/rna-seq/log2foldchange'
      || col.spec.name === 'pl7.app/rna-seq/minlog10padj'
      || col.spec.name === 'pl7.app/rna-seq/regulationDirection'
      || col.spec.name === 'pl7.app/rna-seq/genesymbol'
      || col.spec.name === 'pl7.app/rna-seq/contrastGroup'),
  );
  return pCols;
}

export const model = BlockModel.create()

  .withArgs<BlockArgs>({
    covariateRefs: [],
    numerators: [],
    log2FCThreshold: 1,
    pAdjThreshold: 0.05,
  })

  .withUiState<UiState>({
    tableState: createPlDataTableStateV2(),
    graphState: {
      title: 'Differential gene expression',
      template: 'dots',
      currentTab: null,
    },
  })

  // Activate "Run" button only after these conditions are satisfied
  .argsValid((ctx) => (
    (ctx.args.numerators !== undefined)) && (ctx.args.numerators.length !== 0)
  && (ctx.args.denominator !== undefined)
  && (ctx.args.log2FCThreshold !== undefined)
  && (ctx.args.pAdjThreshold !== undefined),
  )

  // User can only select as input raw gene count matrices
  // includeNativeLabel ensures raw counts pl7.app/label (native label, 'Raw gene expression')
  // is visible in selection (by default we see Samples & data ID)
  // addLabelAsSuffix moves the native label to the end
  // Result: [dataID] / Raw gene expression
  .output('countsOptions', (ctx) =>
    // I've added these "||" for backward compatibility (As I see, the shape of PColum was changed)
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec)
      && (spec.name === 'pl7.app/rna-seq/countMatrix' || spec.name === 'countMatrix')
      && (spec.annotations?.['pl7.app/rna-seq/normalized'] === 'false' || spec.domain?.['pl7.app/rna-seq/normalized'] === 'false')
    , { includeNativeLabel: true, addLabelAsSuffix: true }),
  )

  .output('metadataOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'pl7.app/metadata'),
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

  // Returns a map of results
  .output('pt', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPlDataTableV2(ctx, pCols, ctx.uiState?.tableState);
  })

  .output('sheets', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    // Get unique contrast values
    const contrasts = getUniquePartitionKeys(pCols[0].data)?.[0];
    if (!contrasts) return undefined;

    return [createPlDataTableSheet(ctx, pCols[0].spec.axesSpec[0], contrasts)];
  })

  .output('test', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }
    // Iterate over all pCols and get all posible uniqque contrast values
    const contrasts = pCols.flatMap((col) => getUniquePartitionKeys(col.data)?.[0] || []);
    // Get unique values
    const uniqueContrasts = [...new Set(contrasts)];
    if (!uniqueContrasts) return undefined;

    return uniqueContrasts;
  })

  .output('clusterMarkersPt', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    const anchor = pCols[0];
    if (!anchor) return undefined;

    const r = getUniquePartitionKeys(anchor.data);
    if (!r) return undefined;

    return {
      table: createPlDataTableV2(ctx, pCols, ctx.uiState?.tableState),
      sheets: r.map((values, i) => createPlDataTableSheet(ctx, anchor.spec.axesSpec[i], values)),
    };
  })

  .output('topTablePcols', (ctx) => {
    let pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }
    pCols = filterPcols(pCols);

    return pCols.map(
      (c) =>
        ({
          columnId: c.id,
          spec: c.spec,
        } satisfies PColumnIdAndSpec),
    );
  })

  .output('emptyCheck', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }
    // topTablePf will only be empty in cases where we did not run DEG due to
    // non full rank matrix
    if (pCols.length === 0) {
      return 'notFullRank';
    }
  })

  .output('topTablePf', (ctx): PFrameHandle | undefined => {
    let pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }
    pCols = filterPcols(pCols);

    return createPFrameForGraphs(ctx, pCols);
  })

  .sections((_ctx) => ([
    { type: 'link', href: '/', label: 'Main' },
    { type: 'link', href: '/graph', label: 'Volcano plot' },
  ]))

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
