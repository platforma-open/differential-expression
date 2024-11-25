import { GraphMakerSettings } from '@milaboratories/graph-maker';
import { 
  BlockModel, 
  InferOutputsType,
  isPColumn,
  createPlDataTable,
  PlDataTableState,
  Ref,
  ValueType,
  isPColumnSpec,
  PFrameHandle
} from '@platforma-sdk/model';

export type UiState = {
  tableState?: PlDataTableState;
  graphState?: GraphMakerSettings;
};

export type BlockArgs = {
  countsRef?: Ref;
  metadataRef?: Ref;
  covariates: string[];
  contrastFactor?: String;
  denominator?: String;
  numerator?: String;
};

export const model = BlockModel.create()

  .withArgs<BlockArgs>({
    covariates: [],
  })

  .withUiState<UiState>({})

  .output('countsOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'countMatrix')
  )

  .output('covariateOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'pl7.app/metadata')
  )

  .output('contrastFactorOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'pl7.app/metadata')
  )

  .output('datasetSpec', (ctx) => {
    if (ctx.args.countsRef) return ctx.resultPool.getSpecByRef(ctx.args.countsRef);
    else return undefined;
  })

  .output('pt', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPlDataTable(ctx, pCols, ctx.uiState?.tableState);
  })


  .output('ColumnId', (ctx) => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols?.length !== 1) {
      return undefined;
    }

    return pCols[0].id;
  })

  .output('newoutput', (ctx) => ctx.outputs?.resolve('topTablePf')?.listInputFields())

  .output('topTablePf', (ctx): PFrameHandle | undefined => {
    const pCols = ctx.outputs?.resolve('topTablePf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    // enriching with upstream data
    const valueTypes = ['Int', 'Float', 'Double', 'String'] as ValueType[];
    const upstream = ctx.resultPool
      .getData()
      .entries.map((v) => v.obj)
      .filter(isPColumn)
      .filter((column) => valueTypes.find((valueType) => valueType === column.spec.valueType));

    return ctx.createPFrame([...pCols, ...upstream]);
  })

  .sections([
    { type: 'link', href: '/', label: 'Contrast' },
    { type: 'link', href: '/graph', label: 'Volcano plot' }
  ]
)

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
