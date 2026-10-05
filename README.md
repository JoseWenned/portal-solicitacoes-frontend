# Portal de Solicitações Internas — Frontend

Interface do mini-projeto Full Stack desenvolvido para o processo seletivo
de Desenvolvedor de Sistemas Júnior da bit Soluções.

## Objetivo

Permitir que usuários registrem, consultem e acompanhem suas próprias
solicitações internas, com autenticação, filtros e indicadores.

## Repositórios

- [Frontend](https://github.com/JoseWenned/portal-solicitacoes-frontend)
- [Backend](https://github.com/JoseWenned/portal-solicitacoes-backend)

Os repositórios devem ficar em diretórios irmãos para utilizar
os comandos de integração apresentados neste documento.

## Funcionalidades

- Cadastro de usuário.
- Login por e-mail e senha.
- Restauração da sessão após atualizar a página.
- Logout.
- Dashboard com total e contagens por status.
- Listagem paginada das solicitações do usuário.
- Filtros por título, categoria, status e período de criação.
- Criação e consulta de detalhes.
- Edição de solicitações abertas.
- Exclusão física de solicitações abertas.
- Avanço de status: ABERTO → EM_ATENDIMENTO → CONCLUIDO.
- Validação dos formulários.
- Estados de carregamento, erro e resultado vazio.
- Layout adaptável a telas menores.
- Execução integrada com backend pelo Nginx.

A autorização e as regras definitivas são verificadas pelo backend.
Ocultar uma ação na interface não substitui essa verificação.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| JavaScript | Linguagem da aplicação |
| React e React DOM 19.3 | Interface e renderização |
| Vite 8.3 | Desenvolvimento e build |
| React Router 7.18 | Navegação |
| Axios 1.20 | Comunicação HTTP |
| React Hook Form 7.89 | Formulários |
| Zod 4.6 e resolvers | Validação |
| Context | Disponibilização do estado de autenticação |
| SCSS/Sass | Estilos |
| ESLint | Verificação estática |
| Vitest 5.0 | Testes unitários e de componentes |
| React Testing Library e user-event | Testes de interação |
| jsdom | Ambiente DOM dos testes |
| Playwright 1.63 | Testes de navegador |
| Docker e Nginx | Build e execução |
| Docker Compose | Integração dos serviços |
| GitHub Actions | Integração contínua |

As versões exatas instaladas são registradas no package-lock.json.

## Organização

| Diretório | Responsabilidade |
|---|---|
| src/domain | Vocabulário e regras de disponibilidade das operações |
| src/application | Casos de uso e validações |
| src/infrastructure | Axios, sessão e adaptadores HTTP |
| src/presentation | Context, páginas, componentes, rotas e estilos |
| src/test | Configuração dos testes Vitest |
| e2e | Testes Playwright |
| docker | Configuração Nginx |
| docs | Arquitetura e registros de apoio de LLM |

Os casos de uso de solicitações recebem o repositório como dependência.
A implementação HTTP fica na infraestrutura.

O estado compartilhado de autenticação é disponibilizado por Context.
Os formulários possuem validação com React Hook Form e Zod.

A validação Zod é uma dependência da camada de aplicação deste frontend.
Não é apresentada como parte de um domínio totalmente independente
de bibliotecas.

## Pré-requisitos

### Execução integrada pelo Docker

- Git.
- Docker com daemon acessível.
- Docker Compose.
- Acesso à internet para baixar imagens e dependências.
- Python 3 para o exemplo de geração da chave JWT do backend.

Node e Java locais não são necessários para executar a aplicação
pelos containers.

### Desenvolvimento e testes locais

- Node.js 22.22.3 utilizado no desenvolvimento.
- npm 10.9.8 utilizado no desenvolvimento.
- Backend disponível na porta 8080.
- Docker para o PostgreSQL e os testes do backend.

Os testes Playwright exigem instalação do navegador e suas dependências.

## Instalação dos repositórios

Escolha um diretório para os projetos:

```bash
mkdir -p ~/projetos
cd ~/projetos

git clone https://github.com/JoseWenned/portal-solicitacoes-backend.git
git clone https://github.com/JoseWenned/portal-solicitacoes-frontend.git
```

Estrutura esperada:

- ~/projetos/portal-solicitacoes-backend
- ~/projetos/portal-solicitacoes-frontend

## Configuração do backend

Na raiz do backend:

```bash
cd ~/projetos/portal-solicitacoes-backend
cp .env.example .env
```

Se o arquivo .env já existir, preserve-o.

Configure os valores:

| Variável | Finalidade |
|---|---|
| BACKEND_PORT | Porta local do backend; padrão 8080 |
| POSTGRES_PORT | Porta local do banco; padrão 5434 |
| POSTGRES_DB | Nome do banco |
| POSTGRES_USER | Usuário do banco |
| POSTGRES_PASSWORD | Senha local do banco |
| JWT_SECRET_BASE64 | Chave JWT em Base64 |
| AUTH_COOKIE_SECURE | false para HTTP local; true para HTTPS |

Exemplo de valores locais, exceto a chave:

```dotenv
BACKEND_PORT=8080
POSTGRES_PORT=5434
POSTGRES_DB=portal_solicitacoes
POSTGRES_USER=portal_app
POSTGRES_PASSWORD=defina-uma-senha-local
JWT_SECRET_BASE64=
AUTH_COOKIE_SECURE=false
```

Não versione o arquivo .env.

### Gerar a chave JWT

Execute na pasta do backend:

```bash
python3 - <<'PY'
from pathlib import Path
import base64
import secrets

path = Path(".env")

if not path.is_file():
    raise SystemExit("Arquivo .env não encontrado.")

lines = path.read_text(encoding="utf-8").splitlines()
indexes = [
    index
    for index, line in enumerate(lines)
    if line.strip().startswith("JWT_SECRET_BASE64=")
]

if len(indexes) > 1:
    raise SystemExit("Corrija as entradas duplicadas de JWT_SECRET_BASE64.")

if indexes and lines[indexes[0]].split("=", 1)[1].strip():
    print("Chave existente preservada.")
else:
    entry = "JWT_SECRET_BASE64=" + base64.b64encode(
        secrets.token_bytes(32)
    ).decode("ascii")

    if indexes:
        lines[indexes[0]] = entry
    else:
        lines.append(entry)

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Chave configurada sem exibir seu valor.")
PY
```

## Execução integrada com Docker

### 1. Iniciar backend e banco

```bash
cd ~/projetos/portal-solicitacoes-backend
docker compose config --quiet
docker compose up --build -d
```

O Flyway cria a estrutura por migrations.
O Hibernate valida o mapeamento.

O volume postgres_data preserva os dados entre reinicializações.

Aguarde a saúde da aplicação:

```bash
curl --fail --retry 10 --retry-all-errors --retry-delay 2 \
  http://localhost:8080/actuator/health
```

Resultado esperado: status UP.

### 2. Configurar e iniciar frontend

```bash
cd ~/projetos/portal-solicitacoes-frontend
cp .env.example .env
```

Se o arquivo já existir, preserve-o.

O frontend utiliza:

```dotenv
BACKEND_NETWORK=portal-solicitacoes-backend_default
```

Essa é a rede criada pelo Compose do backend quando executado
com o nome padrão do projeto.

Se o nome do projeto Compose foi personalizado, confira a rede:

```bash
docker network ls --filter name=portal-solicitacoes
```

Ajuste BACKEND_NETWORK para o nome correspondente.

Inicie:

```bash
docker compose config --quiet
docker compose up --build -d
```

O Nginx encaminha /api para backend:8080 na rede do Docker.
O caminho /api/v1 e os cookies são preservados.

A configuração do frontend não recebe senha do banco ou chave JWT.

### 3. Conferir o proxy

```bash
curl --fail --silent --show-error \
  --retry 10 --retry-all-errors --retry-delay 2 \
  -o /dev/null \
  -w 'CSRF pelo Nginx: HTTP %{http_code}\n' \
  http://localhost:3000/api/v1/auth/csrf
```

Resultado esperado: HTTP 200.

## Acessos

| Serviço | Endereço padrão |
|---|---|
| Frontend Docker | http://localhost:3000 |
| Backend | http://localhost:8080 |
| Saúde | http://localhost:8080/actuator/health |
| Swagger | http://localhost:8080/swagger-ui/index.html |
| OpenAPI | http://localhost:8080/v3/api-docs |
| PostgreSQL local | 127.0.0.1:5434 |

O frontend pode acessar a API mesmo com outra porta publicada
para o backend, pois utiliza backend:8080 na rede interna.

## Demonstração

Não há usuário criado automaticamente.
Utilize a tela de cadastro.

Em um banco novo, cadastre:

| Campo | Valor de demonstração |
|---|---|
| Nome | Ana Demonstração |
| E-mail | ana.demo@example.com |
| Senha | Teste12345! |

Essas credenciais são exclusivamente de demonstração local.
Elas passam a existir somente após o cadastro.

Se o e-mail já estiver cadastrado, utilize sua senha existente
ou cadastre outro e-mail.

### Roteiro

1. Acesse http://localhost:3000/cadastro.
2. Cadastre o usuário.
3. Entre com e-mail e senha.
4. Confira o dashboard inicialmente zerado.
5. Crie uma solicitação.
6. Consulte os detalhes e edite enquanto estiver aberta.
7. Pesquise pela listagem e pelos filtros.
8. Avance para Em atendimento e depois Concluído.
9. Observe que edição e exclusão deixam de estar disponíveis.
10. Crie outra solicitação e exclua enquanto estiver aberta.
11. Confira o dashboard.
12. Atualize a página para verificar a restauração da sessão.
13. Saia e confirme o retorno ao login.

Para conferir isolamento, cadastre outro usuário e verifique
que ele não visualiza as solicitações do primeiro.

Mantenha o mesmo host durante os fluxos.
localhost e 127.0.0.1 possuem cookies separados.

## Desenvolvimento local

Com o backend em execução na porta 8080:

```bash
cd ~/projetos/portal-solicitacoes-frontend
npm ci
npm run dev
```

Acesso:

http://localhost:5173

O proxy do Vite encaminha /api para http://127.0.0.1:8080.

Não é necessário configurar CORS para esse fluxo,
pois o navegador acessa o proxy na mesma origem.

O servidor Vite utiliza strictPort.
Se 5173 estiver ocupada, libere a porta antes de iniciar.

## Build local

```bash
npm run build
```

O resultado fica em dist.

Para visualizar o build:

```bash
npm run preview
```

O preview do Vite não possui o proxy de desenvolvimento configurado.
Para validar o fluxo completo do build com a API, utilize Docker/Nginx.

dist e node_modules não são versionados.
package.json e package-lock.json são versionados.

## Autenticação

- JWT mantido em memória.
- Refresh token recebido em cookie HttpOnly.
- CSRF obtido antes de login, renovação e logout.
- Restauração da sessão após recarregar por refresh token.
- Rotas protegidas aguardam a tentativa de restauração.
- Renovação compartilhada nesta instância do navegador.
- Login, renovação e logout serializados.
- Requisição protegida com HTTP 401 pode ser repetida uma vez
  após renovação.
- Logout bloqueia novas renovações enquanto está em andamento.
- JWT expirado no logout permite tentativa somente por cookie.

O backend define validade máxima de 15 minutos para o JWT
e validade absoluta de oito horas para a sessão.

A rotação não estende a expiração absoluta.

### Limitações

A coordenação não sincroniza múltiplas abas.

Se o logout falhar por rede, o estado local é removido,
mas a revogação no servidor não pode ser confirmada.

Falha na restauração direciona para o login.

## Solicitações e filtros

Campos de criação e edição:

- Título.
- Descrição.
- Categoria.

Categorias:

- TI.
- RH.
- Compras.
- Financeiro.
- Infraestrutura.

O proprietário, o código, as datas e o status inicial
são definidos pelo backend.

Filtros:

- Texto parcial no título.
- Categoria.
- Status.
- Data inicial.
- Data final.

As datas consideram o dia no fuso America/Sao_Paulo.
Os filtros são combinados por AND.

A listagem utiliza páginas de dez registros
e ordenação por criação e código em ordem decrescente.

O dashboard considera todas as solicitações do usuário,
independentemente dos filtros da listagem.

## Testes

### Lint e Vitest

```bash
npm run lint
npm test
```

Modo de acompanhamento:

```bash
npm run test:watch
```

A suíte atual possui cinco testes:

- Dois testes dos formulários de autenticação.
- Três testes dos casos de uso de solicitações.

### Playwright

Instale Chromium e suas dependências:

```bash
npx playwright install --with-deps chromium
```

Mantenha frontend e backend em execução no Docker.

Execute:

```bash
npm run test:e2e
```

Esse comando executa o mesmo fluxo nos projetos desktop e móvel.

Somente desktop:

```bash
npm run test:e2e -- --project=chromium
```

Somente emulação móvel:

```bash
npm run test:e2e -- --project=chromium-mobile
```

Para utilizar outro endereço:

```bash
E2E_BASE_URL=http://localhost:3000 npm run test:e2e
```

Relatório:

```bash
npx playwright show-report
```

O teste cadastra usuário exclusivo em cada execução.
Mantém esse usuário e uma solicitação concluída no banco.

Não apaga o banco nem os dados previamente existentes.

## Validação confirmada

Resultados informados pelo desenvolvedor:

- ESLint aprovado na etapa funcional.
- Cinco testes Vitest aprovados.
- Build de produção aprovado.
- Imagens Docker construídas e serviços iniciados.
- CSRF pelo proxy Nginx retornando HTTP 200.
- Fluxo desktop: três execuções consecutivas aprovadas, sem retries.
- Fluxo com emulação móvel: uma execução aprovada.
- Cadastro, login e restauração validados.
- Criação, detalhes e edição validados.
- Filtros por título, categoria e status validados no E2E.
- Avanço de status e exclusão validados.
- Dashboard e logout validados.

O backend possui evidência separada de 153 testes aprovados,
incluindo filtros por período e isolamento entre usuários.

O fluxo E2E não verifica todos os filtros de período
nem todos os cenários de segurança.

## Responsividade

Os estilos incluem:

- Reorganização dos indicadores.
- Reorganização de filtros e detalhes.
- Cabeçalho e ações com quebra de linha.
- Tabela com rolagem horizontal local.
- Quebra de textos longos.

O fluxo funcional passou com emulação Pixel 7 no Chromium.

A emulação não equivale a teste em dispositivo físico
nem comprova toda a qualidade visual.

A conferência visual específica permanece pendente nesta versão.

## Integração contínua

O workflow Frontend CI executa:

1. Instalação com npm ci.
2. ESLint.
3. Testes Vitest.
4. Build de produção.
5. Build Docker.

Os testes Playwright são executados localmente contra a aplicação integrada.
Ainda não fazem parte do workflow.

Não há deploy nem publicação automática de imagens.

Uma execução anterior não obteve runner hospedado.
Esse erro de infraestrutura não comprova falha do código.

Os resultados finais da CI devem ser conferidos nas execuções
dos respectivos PRs.

## Logs e encerramento

Logs do frontend:

```bash
cd ~/projetos/portal-solicitacoes-frontend
docker compose logs --tail=100 frontend
```

Logs do backend e banco:

```bash
cd ~/projetos/portal-solicitacoes-backend
docker compose logs --tail=100 backend database
```

Encerre primeiro o frontend:

```bash
cd ~/projetos/portal-solicitacoes-frontend
docker compose down
```

Depois encerre o backend:

```bash
cd ~/projetos/portal-solicitacoes-backend
docker compose down
```

Esses comandos preservam o volume do PostgreSQL.

## Problemas comuns

### Rede externa não encontrada

Inicie o Compose do backend antes do frontend.
Confira BACKEND_NETWORK.

### API retorna 502 ou 504

Confira se o backend terminou de iniciar e se está na rede configurada.
Consulte os logs dos dois serviços.

### API retorna 503

A estrutura inicial retornava 503 em /api.
Confira se docker/default.conf possui o proxy atual
e reconstrua o frontend:

```bash
docker compose up --build --force-recreate -d
```

### Porta ocupada

As portas padrão são 3000, 5173, 8080 e 5434.
Confira qual serviço já está utilizando a porta.

### Playwright não encontra testes

Confira os arquivos:

- playwright.config.js
- e2e/portal.spec.js

O Playwright busca arquivos *.spec.js dentro de e2e.

### Dependências ou executável ausentes

Reinstale conforme o lockfile:

```bash
npm ci --include=dev
```

## Documentação

- [Estrutura inicial](docs/architecture/estrutura-inicial.md)
- [Autenticação](docs/architecture/autenticacao.md)
- [Solicitações e dashboard](docs/architecture/solicitacoes-dashboard.md)
- [Integração Docker e E2E](docs/architecture/integracao-docker-e2e.md)
- [Responsividade e validação](docs/architecture/responsividade-validacao-final.md)
- [Apoio de LLM: estrutura](docs/llm/estrutura-inicial.md)
- [Apoio de LLM: autenticação](docs/llm/autenticacao.md)
- [Apoio de LLM: solicitações](docs/llm/solicitacoes-dashboard.md)
- [Apoio de LLM: integração](docs/llm/integracao-docker-e2e.md)
- [Apoio de LLM: responsividade](docs/llm/responsividade-validacao-final.md)
- [Dicionário de dados](https://github.com/JoseWenned/portal-solicitacoes-backend/blob/main/docs/database/dicionario-dados.md)
- [Memorial Técnico](https://github.com/JoseWenned/portal-solicitacoes-backend/blob/main/docs/memorial-tecnico.md)

O Memorial Técnico está centralizado no backend
e será atualizado com as decisões e evidências do frontend.

## Pendências de preparação da entrega

- Conferência visual específica da responsividade.
- Consolidação final do Memorial Técnico.
- Atualização do README do backend com a integração realizada.
- Confirmação dos resultados finais da CI.