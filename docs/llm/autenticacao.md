# Apoio de LLM — autenticação frontend

## Apoio recebido

Proposta de clientes Axios, coordenação da sessão em memória,
Context, rotas protegidas, formulários Zod e testes dos formulários.

## Decisões

- Preservar a estratégia de autenticação aprovada no backend.
- Não armazenar JWT em armazenamento persistente do navegador.
- Utilizar cookie HttpOnly e obtenção explícita de CSRF.
- Coordenar renovação e logout nesta instância.
- Manter documentação das limitações.

## Validação manual

- Proxy do Vite: endpoint CSRF retornou HTTP 200.
- Cadastro pelo formulário: aprovado.
- Login: aprovado.
- Restauração da sessão após atualizar a página: aprovada.
- Logout com retorno ao login: aprovado.

Resultados informados pelo desenvolvedor.