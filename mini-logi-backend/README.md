# Mini-Logi Backend

API REST modular para gerenciamento de motoristas e entregas, construída com Node.js, TypeScript, Express, Prisma e PostgreSQL. O projeto aplica Clean Architecture, Ports and Adapters, eventos de domínio e injeção de dependências por Factory Method.

## Funcionalidades

- Cadastro e listagem de motoristas.
- Criação de entregas com código de rastreio alfanumérico de 8 caracteres.
- Listagem paginada de entregas.
- Consulta de entrega e histórico pelo código de rastreio.
- Atualização do status e das coordenadas de uma entrega.
- Registro automático do histórico após alterações de status.
- Notificação simulada orientada a eventos.
- Validação de entrada com Zod.
- Rate limiting em endpoints de criação.
- Logs estruturados em JSON com Winston.
- Documentação interativa com Swagger UI.
- Testes unitários e de integração.
- Ambiente de desenvolvimento com Docker Compose.
- Pipeline de qualidade com GitHub Actions.

## Stack

| Área | Tecnologia |
| --- | --- |
| Runtime | Node.js 22+ |
| Linguagem | TypeScript 5, com tipagem estrita |
| Framework HTTP | Express 5 |
| Validação | Zod 4 |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL 16 |
| Eventos internos | `EventEmitter` nativo do Node.js |
| Cache/filas futuras | Redis 7 |
| Logs | Winston |
| Segurança HTTP | Helmet, CORS e express-rate-limit |
| Documentação | Swagger / OpenAPI |
| Testes | Jest, ts-jest e Supertest |
| Qualidade | ESLint e TypeScript Compiler |
| Gerenciador de pacotes | pnpm |
| Containers | Docker e Docker Compose |
| CI | GitHub Actions |

## Arquitetura

O código está organizado de acordo com a Clean Architecture. As regras de negócio permanecem independentes do Express, Prisma e PostgreSQL.

```mermaid
flowchart TD
    HTTP["Presentation / HTTP"] --> UC["Application / Use Cases"]
    UC --> DOMAIN["Domain / Entities"]
    UC --> PORTS["Application / Ports"]
    INFRA["Infrastructure / Adapters"] --> PORTS
    INFRA --> DB["PostgreSQL / Prisma"]
    INFRA --> EVENTS["EventEmitter / Handlers"]
    FACTORIES["Factories"] --> HTTP
    FACTORIES --> UC
    FACTORIES --> INFRA
```

### Camadas

`core/domain`

- Entidades e invariantes do negócio.
- Enums de status.
- Eventos de domínio.
- Erros que herdam de `AppError`.
- Não depende de frameworks ou banco de dados.

`core/application`

- Casos de uso da aplicação.
- Ports, definidos como interfaces para repositórios, eventos e serviços.
- Orquestra o domínio sem conhecer os adaptadores concretos.

`infra`

- Repositórios implementados com Prisma.
- Mapeamento entre modelos de persistência e entidades.
- Dispatcher baseado em `EventEmitter`.
- Handlers de histórico e notificação.
- Logger Singleton com Winston.
- Factory Methods responsáveis pela composição das dependências.

`presentation`

- Controllers e rotas do Express.
- Schemas e middleware de validação com Zod.
- Rate limiting e tratamento global de erros.
- Presenters das respostas HTTP.
- Configuração do Swagger.

## Estrutura de diretórios

```text
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── core/
│   │   ├── application/
│   │   │   ├── ports/
│   │   │   └── use-cases/
│   │   └── domain/
│   │       ├── entities/
│   │       ├── enums/
│   │       ├── errors/
│   │       └── events/
│   ├── infra/
│   │   ├── database/prisma/
│   │   ├── events/
│   │   ├── factories/
│   │   ├── logging/
│   │   └── services/
│   ├── presentation/http/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── presenters/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── swagger/
│   ├── app.ts
│   └── main.ts
├── tests/
│   ├── doubles/
│   ├── integration/
│   └── unit/
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Modelo de dados

O banco possui três entidades principais:

- `Driver`: motorista, CNH e status atual.
- `Delivery`: entrega, rastreio, origem, destino, localização e motorista opcional.
- `StatusHistory`: registro imutável das mudanças de status de uma entrega.

Status possíveis de motorista:

- `AVAILABLE`
- `IN_TRANSIT`
- `OFFLINE`

Status possíveis de entrega:

- `PENDING`
- `COLLECTED`
- `DELIVERING`
- `DELIVERED`
- `RETURNED`

Quando um motorista é removido, sua referência nas entregas é definida como `null`. Quando uma entrega é removida, seu histórico é removido em cascata.

## Fluxo orientado a eventos

Ao atualizar uma entrega, o caso de uso `UpdateDeliveryStatusUseCase` publica um `DeliveryStatusChangedEvent`.

O dispatcher executa os observers registrados:

1. `HistoryLoggerHandler` persiste um registro em `StatusHistory`.
2. `NotificationHandler` simula o envio de uma notificação.
3. O Winston registra o evento e seus metadados em JSON.

Exemplo de log:

```json
{
  "timestamp": "2026-07-16T15:25:00.000Z",
  "level": "info",
  "message": "Event DeliveryStatusChanged emitted",
  "deliveryId": "123",
  "status": "DELIVERING"
}
```

Atualmente os eventos são processados dentro do processo da API. Para cenários que exigem retentativas, persistência e processamento distribuído, o dispatcher pode ser substituído por BullMQ/Redis e combinado com o padrão Transactional Outbox sem alterar os casos de uso.

## Pré-requisitos

Para execução local:

- Node.js 22 ou superior.
- pnpm 10 ou superior.
- PostgreSQL 16.

Para execução por containers:

- Docker.
- Docker Compose.

## Configuração

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Variáveis disponíveis:

```env
DATABASE_URL="postgresql://mini_logi:mini_logi@localhost:5432/mini_logi?schema=public"
NODE_ENV="development"
PORT=3333
CORS_ORIGIN="http://localhost:3000"
LOG_LEVEL="info"
```

Ao executar a API dentro do Docker Compose, o host do PostgreSQL é o nome do serviço `postgres`, e não `localhost`. O Compose já fornece essa configuração ao container da aplicação.

## Executando com Docker

Suba a aplicação, o PostgreSQL e o Redis:

```bash
docker compose up --build
```

Para executar em segundo plano:

```bash
docker compose up --build -d
```

Verifique o estado dos serviços:

```bash
docker compose ps
```

Exiba os logs da API:

```bash
docker compose logs -f app
```

Ao iniciar, o container da API executa as migrations pendentes e inicia o servidor com live reload.

Serviços disponíveis:

- API: `http://localhost:3333`
- Health check: `http://localhost:3333/health`
- Swagger UI: `http://localhost:3333/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

Encerre os containers com:

```bash
docker compose down
```

Para também excluir os volumes e reinicializar os dados:

```bash
docker compose down -v
```

> O comando com `-v` apaga o banco local e deve ser usado somente quando a perda desses dados for aceitável.

## Executando localmente

Instale as dependências:

```bash
pnpm install
```

Gere o Prisma Client:

```bash
pnpm prisma:generate
```

Com o PostgreSQL disponível e o `.env` configurado, crie/aplique a migration de desenvolvimento:

```bash
pnpm prisma:migrate:dev
```

Inicie o servidor:

```bash
pnpm dev
```

## Endpoints

Base URL: `http://localhost:3333/api/v1`

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica a saúde da API |
| `POST` | `/api/v1/drivers` | Cadastra um motorista |
| `GET` | `/api/v1/drivers` | Lista os motoristas |
| `POST` | `/api/v1/deliveries` | Cria uma entrega |
| `GET` | `/api/v1/deliveries?page=1&limit=20` | Lista entregas com paginação |
| `GET` | `/api/v1/deliveries/:trackingCode` | Consulta entrega e histórico |
| `PATCH` | `/api/v1/deliveries/:id/status` | Atualiza o status da entrega |

### Criar motorista

```bash
curl -X POST http://localhost:3333/api/v1/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Souza",
    "licenseId": "CNH-123456"
  }'
```

### Criar entrega

```bash
curl -X POST http://localhost:3333/api/v1/deliveries \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Caixa de equipamentos",
    "origin": "Fortaleza, CE",
    "destination": "Recife, PE"
  }'
```

O campo `driverId` é opcional e, quando informado, deve ser um UUID válido.

### Atualizar status

```bash
curl -X PATCH http://localhost:3333/api/v1/deliveries/UUID_DA_ENTREGA/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "DELIVERING",
    "latitude": -3.7319,
    "longitude": -38.5267
  }'
```

As coordenadas são opcionais. A latitude deve estar entre `-90` e `90`, e a longitude entre `-180` e `180`.

## Validação, segurança e erros

- Todos os bodies, params e queries relevantes são validados sincronamente com Zod.
- Erros de validação retornam `400 Bad Request` com os campos inválidos.
- Exceções de domínio herdam de `AppError` e carregam um `statusCode`.
- Erros desconhecidos retornam `500 Internal Server Error`.
- Stack traces não são expostos em produção.
- Helmet adiciona headers HTTP de segurança.
- CORS é controlado pela variável `CORS_ORIGIN`.
- Endpoints de criação possuem limite de 100 requisições por IP a cada 15 minutos.
- O corpo JSON é limitado a 1 MB.

## Testes e qualidade

Execute todos os testes:

```bash
pnpm test
```

Somente testes unitários:

```bash
pnpm test:unit
```

Somente testes de integração HTTP:

```bash
pnpm test:integration
```

Demais verificações:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm exec prisma validate
```

Os testes unitários usam repositórios e dispatcher em memória. Isso permite validar os casos de uso e o disparo de eventos sem depender de PostgreSQL ou Redis.

## Scripts

| Script | Ação |
| --- | --- |
| `pnpm dev` | Inicia a API com live reload |
| `pnpm build` | Compila o TypeScript para `dist` |
| `pnpm start` | Executa a versão compilada |
| `pnpm lint` | Executa o ESLint |
| `pnpm typecheck` | Verifica os tipos sem gerar arquivos |
| `pnpm test` | Executa toda a suíte Jest |
| `pnpm test:unit` | Executa os testes unitários |
| `pnpm test:integration` | Executa os testes HTTP |
| `pnpm test:watch` | Executa o Jest em modo watch |
| `pnpm prisma:generate` | Gera o Prisma Client |
| `pnpm prisma:migrate:dev` | Cria/aplica migrations em desenvolvimento |
| `pnpm prisma:migrate:deploy` | Aplica migrations existentes |
| `pnpm prisma:studio` | Abre o Prisma Studio |

## CI/CD

O workflow em `.github/workflows/ci.yml` é executado em:

- pushes para a branch `main`;
- pull requests.

A pipeline:

1. instala as dependências com o lockfile;
2. gera e valida o Prisma Client;
3. executa o linter;
4. verifica a tipagem;
5. executa testes unitários;
6. executa testes de integração;
7. compila a aplicação.

## Solução de problemas

### Porta 6379 já está em uso

Mensagem:

```text
Bind for 0.0.0.0:6379 failed: port is already allocated
```

Verifique se já existe outro Redis publicando a porta:

```bash
docker ps --filter publish=6379
```

Pare o container conflitante ou remova a seção `ports` do serviço `redis` no `docker-compose.yml`. A API se comunica com o Redis pela rede interna do Compose e não precisa publicar essa porta no host.

Depois, recrie os serviços:

```bash
docker compose down
docker compose up --build
```

### Prisma `P1000`

O erro `P1000` indica falha de autenticação no PostgreSQL. Confira se usuário, senha, host, porta e banco da `DATABASE_URL` correspondem à configuração do PostgreSQL.

Dentro do Compose, a URL esperada é:

```text
postgresql://mini_logi:mini_logi@postgres:5432/mini_logi?schema=public
```

Na execução local, fora dos containers:

```text
postgresql://mini_logi:mini_logi@localhost:5432/mini_logi?schema=public
```

As credenciais do PostgreSQL só são usadas na primeira criação do volume. Se o volume foi criado anteriormente com credenciais diferentes e os dados puderem ser descartados:

```bash
docker compose down -v
docker compose up --build
```

### Política `minimumReleaseAge` do pnpm

Se o `pnpm install` rejeitar entradas recentes do lockfile, inspecione as alterações antes de confiar nelas. Para reconstruir o lockfile conforme a política ativa:

```bash
pnpm clean --lockfile
pnpm install
```

Não desative uma política de supply chain sem compreender o impacto.

## Decisões e próximos passos

O Redis já faz parte do ambiente para permitir a evolução do projeto, mas o dispatcher atual usa o `EventEmitter` do Node.js. Evoluções recomendadas:

- BullMQ/Redis para eventos assíncronos persistentes.
- Transactional Outbox para consistência entre banco e eventos.
- autenticação e autorização;
- rate limiting distribuído com Redis;
- Socket.IO para atualizações em tempo real;
- tracing e métricas com OpenTelemetry;
- testes de integração com PostgreSQL efêmero;
- deploy automatizado após a etapa de CI.

## Licença

Projeto privado, marcado como `UNLICENSED`.
