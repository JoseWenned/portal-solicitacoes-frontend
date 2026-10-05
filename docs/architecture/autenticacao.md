# Autenticação do frontend

## Implementação

- Axios separado para autenticação e chamadas protegidas.
- JWT mantido em memória, sem localStorage ou sessionStorage.
- Refresh token recebido por cookie HttpOnly.
- Token CSRF obtido antes de login, renovação e logout.
- Context disponibiliza usuário e operações de autenticação.
- Rotas protegidas aguardam a tentativa de restauração.
- Formulários com React Hook Form e Zod.
- Renovação compartilhada entre chamadas desta instância.
- Login, renovação e logout serializados.
- Repetição de requisição protegida limitada a uma tentativa após HTTP 401.
- Logout aguarda operações anteriores e bloqueia novas renovações.
- JWT expirado no logout permite nova tentativa somente por cookie.

## Limitações

- Coordenação limitada a esta instância; não sincroniza múltiplas abas.
- Falha de rede no logout remove o estado local, mas não comprova
  revogação no servidor.
- Falha na restauração direciona para login.
- Integração Nginx ainda pendente.

## Validação

- Testes de formulários adicionados; execução pendente.
- Cadastro, login, atualização da página e logout no navegador: pendentes.
- Testes específicos de coordenação da sessão: pendentes.
- CI: pendente.