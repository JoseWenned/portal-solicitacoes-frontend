import { apiHttp } from '../http/clients';

export const solicitacaoRepository = {
  async listar(filtros, signal) {
    const params = Object.fromEntries(
      Object.entries(filtros).filter(
        ([, value]) => value !== '' && value != null,
      ),
    );

    const { data } = await apiHttp.get('/solicitacoes', {
      params,
      signal,
    });

    return data;
  },

  async consultar(id, signal) {
    const { data } = await apiHttp.get(
      `/solicitacoes/${encodeURIComponent(id)}`,
      { signal },
    );

    return data;
  },

  async criar(dados) {
    const { data } = await apiHttp.post('/solicitacoes', dados);
    return data;
  },

  async editar(id, dados) {
    await apiHttp.put(`/solicitacoes/${encodeURIComponent(id)}`, dados);
  },

  async excluir(id) {
    await apiHttp.delete(`/solicitacoes/${encodeURIComponent(id)}`);
  },

  async alterarStatus(id, status) {
    await apiHttp.patch(
      `/solicitacoes/${encodeURIComponent(id)}/status`,
      { status },
    );
  },

  async dashboard(signal) {
    const { data } = await apiHttp.get('/dashboard', { signal });
    return data;
  },
};