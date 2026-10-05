export const categorias = [
  'TI',
  'RH',
  'COMPRAS',
  'FINANCEIRO',
  'INFRAESTRUTURA',
];

export const statusLabels = {
  ABERTO: 'Aberto',
  EM_ATENDIMENTO: 'Em atendimento',
  CONCLUIDO: 'Concluído',
};

export const categoriaLabels = {
  TI: 'TI',
  RH: 'RH',
  COMPRAS: 'Compras',
  FINANCEIRO: 'Financeiro',
  INFRAESTRUTURA: 'Infraestrutura',
};

export function proximoStatus(status) {
  return {
    ABERTO: 'EM_ATENDIMENTO',
    EM_ATENDIMENTO: 'CONCLUIDO',
  }[status] ?? null;
}

export function podeEditarOuExcluir(solicitacao) {
  return solicitacao.status === 'ABERTO';
}