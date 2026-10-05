# Integração Docker e testes de navegador

## Execução integrada

O frontend é servido pelo Nginx em http://localhost:3000.

O Compose do frontend utiliza a rede externa criada pelo Compose
do backend, permitindo acessar backend:8080.

O proxy preserva /api/v1 e encaminha os cookies.
Senhas do banco e chave JWT permanecem no backend.

A rede do backend deve existir antes de iniciar o frontend.

## Teste Playwright

O teste utiliza Chromium e a aplicação real executada no Docker.

Cada execução cadastra um usuário exclusivo.

Cobertura:

- Cadastro e login.
- Restauração após atualizar a página.
- Criação e consulta de solicitação.
- Edição enquanto ABERTO.
- Filtros combinados por título, categoria e status.
- Avanço até CONCLUIDO.
- Ausência de edição e exclusão após atendimento.
- Exclusão de outra solicitação aberta.
- Indicadores do dashboard.
- Logout e atualização posterior sem restauração da sessão.

O teste mantém o usuário e uma solicitação concluída no banco.

## Ajuste de sincronização

Uma execução falhou com o e-mail vazio após navegar para login.

O teste foi ajustado para aguardar a URL e o título da tela de login
antes de preencher os campos.

Também foram adicionadas verificações da resposta de login
e da consulta com filtros.

Não foram adicionados sleeps ou retries.

## Validação

- CSRF pelo Nginx: HTTP 200.
- Fluxo integrado: três execuções consecutivas aprovadas.
- Comando: npm run test:e2e -- --repeat-each=3.
- CI desta etapa: pendente.

## Limites

- Execução validada em Chromium desktop.
- Responsividade ainda exige verificação específica.
- Filtros por período e isolamento possuem cobertura HTTP no backend;
  não são verificados por este teste de navegador.
- Não há teste de concorrência entre múltiplas abas.