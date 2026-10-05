import { apiHttp, authHttp } from '../http/clients';

let accessToken = null;
let snapshot = { status: 'loading', usuario: null };
const listeners = new Set();

let queue = Promise.resolve();
let refreshPromise = null;
let restorePromise = null;
let closing = false;

function publicar(status, usuario = null) {
  snapshot = { status, usuario };
  listeners.forEach((listener) => listener());
}

function serializar(operation) {
  const result = queue.then(operation, operation);
  queue = result.catch(() => {});
  return result;
}

async function csrfHeaders() {
  const { data } = await authHttp.get('/auth/csrf');
  return { [data.headerName]: data.token };
}

async function aceitarTokens(data) {
  accessToken = data.accessToken;

  try {
    const response = await authHttp.get('/usuarios/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    publicar('authenticated', response.data);
  } catch (error) {
    accessToken = null;
    publicar('anonymous');
    throw error;
  }
}

async function renovarInternamente() {
  try {
    const headers = await csrfHeaders();
    const { data } = await authHttp.post('/auth/refresh', null, { headers });

    await aceitarTokens(data);
    return accessToken;
  } catch (error) {
    accessToken = null;
    publicar('anonymous');
    throw error;
  }
}

export const session = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return snapshot;
  },

  restaurar() {
    if (!restorePromise) {
      restorePromise = this.renovar().catch(() => {
        publicar('anonymous');
      });
    }

    return restorePromise;
  },

  renovar() {
    if (closing) {
      return Promise.reject(new Error('Encerramento de sessão em andamento.'));
    }

    if (!refreshPromise) {
      refreshPromise = serializar(renovarInternamente)
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  },

  login(credentials) {
    return serializar(async () => {
      const headers = await csrfHeaders();
      const { data } = await authHttp.post('/auth/login', credentials, {
        headers,
      });

      await aceitarTokens(data);
    });
  },

  async cadastrar(dados) {
    await authHttp.post('/usuarios', dados);
  },

  logout() {
    closing = true;

    return serializar(async () => {
      try {
        const headers = await csrfHeaders();

        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        try {
          await authHttp.post('/auth/logout', null, { headers });
        } catch (error) {
          if (error.response?.status !== 401 || !accessToken) {
            throw error;
          }

          // JWT expirado: tenta encerrar usando o cookie atual.
          const cookieHeaders = await csrfHeaders();
          await authHttp.post('/auth/logout', null, {
            headers: cookieHeaders,
          });
        }
      } finally {
        accessToken = null;
        publicar('anonymous');
        closing = false;
      }
    });
  },
};

apiHttp.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiHttp.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401
      || !original
      || original._retried
      || closing
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      const token = await session.renovar();
      original.headers.Authorization = `Bearer ${token}`;
      return apiHttp.request(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);