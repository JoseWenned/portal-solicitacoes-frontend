import axios from 'axios';

export const authHttp = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  withCredentials: true,
});

export const apiHttp = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  withCredentials: true,
});

export function mensagemErro(error) {
  return error.response?.data?.message
    ?? 'Não foi possível conectar ao servidor. Tente novamente.';
}
