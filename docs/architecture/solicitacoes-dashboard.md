# Solicitações e dashboard

## Implementação

- Dashboard com indicadores obtidos da API.
- Listagem paginada.
- Filtros por título, categoria, status e período.
- Criação e edição com React Hook Form e Zod.
- Consulta de detalhes.
- Exclusão física com confirmação.
- Avanço para o próximo status com confirmação.
- Exibição do solicitante com o nome do usuário autenticado.
- Datas exibidas no fuso America/Sao_Paulo.
- Estados de carregamento, erro e resultado vazio.
- Layout adaptável e tabela com rolagem horizontal local.

## Organização

Domínio contém categorias e regras de disponibilidade das ações.
Aplicação recebe o repositório e coordena as operações.
Infraestrutura implementa chamadas com Axios.
Apresentação contém páginas, formulários e navegação.

As restrições do frontend auxiliam a interface.
O backend permanece responsável pela autorização e regras definitivas.

## Validação

- Três testes dos casos de uso adicionados; execução pendente.
- Fluxos reais no navegador: pendentes.
- Responsividade: verificação visual pendente.
- CI: pendente.

## Validação confirmada

- ESLint: aprovado.
- Vitest: cinco testes aprovados na suíte completa.
- Build de produção: aprovado.
- Criação, detalhes e edição: aprovados no navegador.
- Filtros e avanço de status: aprovados no navegador.
- Exclusão de solicitação aberta: aprovada.
- Indicadores do dashboard: conferidos.
- Resultados informados pelo desenvolvedor.
- Integração Docker e testes Playwright: pendentes.