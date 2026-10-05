# Estrutura inicial do frontend

## Decisões

React com JavaScript e Vite compõem a interface.
SCSS organiza os estilos.

A estrutura possui domain, application, infrastructure e presentation.
As responsabilidades serão adicionadas conforme os fluxos forem implementados.

Axios será utilizado na comunicação HTTP.
React Router organizará a navegação.
React Hook Form e Zod apoiarão os formulários.
Context disponibilizará o estado de autenticação.

O Vite encaminha /api para o backend local na porta 8080.

Docker utiliza build com Node e execução com Nginx sem privilégios.
O container suporta rotas de SPA.
A integração do proxy Nginx com o backend ainda está pendente.
Nesta etapa, chamadas /api pelo container retornam 503.

A CI executa instalação, lint, testes, build e build Docker.

## Validação

- Docker: build e inicialização aprovados.
- Frontend pelo Nginx: HTTP 200 em http://localhost:3000.
- CI: aguardando execução.

## Próximas etapas

- Autenticação e restauração da sessão.
- Formulários e navegação.
- Solicitações, filtros e dashboard.
- Integração Docker com o backend.
- Testes de navegador.