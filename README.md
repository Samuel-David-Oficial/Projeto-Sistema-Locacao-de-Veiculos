# Projeto - Sistema de Locação de Veículos

Sistema web de locação de veículos desenvolvido para a disciplina **Programação com Frameworks Web**.
A API REST (Node.js + Express + Prisma + MySQL) controla veículos, usuários e locações com autenticação JWT.
A interface (React + TypeScript + Vite) consome a API de verdade, sem listas fixas simulando persistência.

## Integrantes

- Samuel David
- (inclua aqui o nome completo dos demais integrantes do grupo)

## Funcionalidades

- Cadastro e login de usuários (senha com hash bcrypt, token JWT com validade de 1 hora).
- Cadastro de veículos e listagem da frota com filtro de disponibilidade.
- Registro de locação: o valor total é calculado no backend.
- Histórico das locações do usuário autenticado, com os dados do veículo.
- Finalização de locação: registra a devolução e libera o veículo.
- Rotas protegidas no backend (middleware JWT) e no frontend (`PrivateRoute`).
- Tratamento de sessão expirada: o interceptor do Axios remove o token e volta ao login.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Node.js, Express 4, Prisma 6, MySQL, jsonwebtoken, bcrypt, cors, dotenv |
| Frontend | React 19, TypeScript, Vite, React Router, Axios, jwt-decode |

## Estrutura do repositório

```
backend/
  prisma/
    schema.prisma          modelos e relacionamentos
    migrations/            migrations versionadas (geradas pelo Prisma)
    seed.js                dados de exemplo
  src/
    index.js               configuração do Express, CORS, rotas e tratamento de erros
    routes/                mapeamento dos endpoints
    controllers/           entrada e resposta HTTP
    services/              validações e regras de negócio
    middlewares/           authMiddleware e tratamento de erros
    errors/                erros de domínio com status HTTP
    utils/                 jwt e validadores
    databases/prisma.js    instância do PrismaClient
frontend/
  src/
    api/api.ts             Axios com interceptors de request e response
    services/              chamadas à API (AuthService, VeiculoService, LocacaoService)
    components/            PrivateRoute, LoginRoute, Layout, formulários e listas
    pages/                 Login, Cadastro, Logout, Veiculos, Locacoes, NotFound
    types/ utils/          tipos e funções auxiliares
```

## Requisitos

- Node.js 22.22 ou superior (exigência do React Router 8)
- MySQL 8 em execução
- VS Code (ou outro editor) e Git

## Como executar

### 1. Banco de dados

Crie o banco vazio no MySQL:

```sql
CREATE DATABASE locadora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

- `DATABASE_URL`: usuário, senha e banco do seu MySQL.
- `JWT_SECRET`: uma chave longa e aleatória. Para gerar uma:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

Aplique as migrations, gere o client e popule os dados de exemplo:

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

A API sobe em `http://localhost:3000`.

Em outra máquina (sem criar migrations novas), use `npx prisma migrate deploy`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`.

## Dados de exemplo (seed)

| Usuário | E-mail | Senha |
| --- | --- | --- |
| Ana Souza | ana@email.com | 123456 |
| Bruno Lima | bruno@email.com | 123456 |

O seed também cadastra seis veículos e uma locação já finalizada da Ana, para exibir o histórico.
Use as duas contas para demonstrar que um usuário não acessa as locações do outro.

## Endpoints

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/usuarios` | não | Cadastra usuário (`nome`, `email`, `senha`) |
| POST | `/login` | não | Retorna `{ token, usuario }` |
| POST | `/veiculos` | sim | Cadastra veículo |
| GET | `/veiculos` | sim | Lista veículos. Filtro opcional: `?disponivel=true` ou `?disponivel=false` |
| POST | `/locacoes` | sim | Registra locação (`veiculoId`, `dataInicio`, `dataPrevistaDevolucao`) |
| GET | `/locacoes` | sim | Lista as locações do usuário autenticado |
| GET | `/locacoes/:id` | sim | Consulta uma locação do usuário autenticado |
| PATCH | `/locacoes/:id/finalizar` | sim | Finaliza a locação e libera o veículo |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.

### Códigos HTTP

| Código | Quando ocorre |
| --- | --- |
| 200 / 201 | Sucesso / recurso criado |
| 400 | Dados inválidos (campos ausentes, placa inválida, datas incoerentes, diária não positiva) |
| 401 | Token ausente, inválido ou expirado; credenciais incorretas |
| 403 | Tentativa de acessar ou finalizar locação de outro usuário |
| 404 | Veículo ou locação inexistente; rota inexistente |
| 409 | E-mail ou placa duplicados; veículo indisponível; locação já finalizada |
| 500 | Erro inesperado no servidor |

## Regras de negócio e decisões

- **Identificação do usuário**: o `usuarioId` vem do token (`request.user.id`, lido da claim `sub`), nunca do corpo da requisição.
- **Valor total**: `valorDiaria x diárias`, calculado no `LocacaoService`. Cada fração de 24 horas conta como uma diária completa (`Math.ceil(duração / 24h)`). O valor fica fixado na contratação e não muda na devolução.
- **Datas**: a data prevista de devolução deve ser posterior à data de início. O frontend envia as datas em ISO 8601 (UTC).
- **Consistência e concorrência**: o registro e a finalização rodam em `prisma.$transaction`. A reserva do veículo usa `updateMany` com a condição `disponivel: true`: se duas requisições disputarem o mesmo veículo, apenas uma atualiza a linha (`count = 1`) e a outra recebe `409`. A finalização usa a condição `status: "ATIVA"` pelo mesmo motivo.
- **Segurança**: a senha é gravada com `bcrypt` (custo 10) e o campo `senha` nunca aparece nas respostas. Login com e-mail inexistente ou senha errada devolve a mesma mensagem. O `jwt.verify` aceita apenas HS256.
- **Histórico**: não há exclusão de veículos nem de locações; a locação finalizada permanece com `status = FINALIZADA` e `dataDevolucao` preenchida.
- **Dinheiro**: valores monetários usam `Decimal(10,2)` no banco e chegam ao frontend como texto.
