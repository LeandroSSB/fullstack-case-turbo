# 🧠 Fullstack Case - NestJS + Next.js

Este projeto é a entrega do case técnico para desenvolvimento fullstack, com foco na construção de uma API robusta utilizando **NestJS**, **Prisma**, **Redis**, **JWT**, **React Query** e **Next.js**.

---

## 📚 Tecnologias utilizadas

- 🧠 **NestJS** (backend)
- 🔐 **JWT Auth**
- 💾 **Prisma ORM** com **PostgreSQL**
- 🚀 **Redis** para cache
- 🧪 **Jest** para testes (unitários e integração)
- 🧾 **Swagger** com `@nestjs/swagger`
- 📦 **Dotenv** para variáveis de ambiente
- 📋 **Winston** para logs estruturados

---

## ⚙️ Como rodar o projeto

### 📁 Backend (NestJS)

#### Pré-requisitos:

- Node 18+
- Docker + Docker Compose (ou PostgreSQL + Redis locais)

#### 1. Clonar o repositório

```bash
  git clone git@github.com:LeandroSSB/fullstack-case-turbo.git
  cd apps
  cd backend
```

#### 2. Instalar dependências

```bash
  yarn
```

#### 3. Instalar dependências

```env
  DATABASE_URL=postgresql://user:password@localhost:5432/db
  JWT_SECRET=supersegredo
  REDIS_URL=redis://localhost:6379
  PORT=5000
  persistLog="true"
```

#### 4. Rodar migrations do banco de dados

```bash
  yarn npx prisma migrate dev --name init
```

#### 5. Rodar o servidor

```bash
  yarn start:dev
```

## 📖 Documentação da API

```bash
  http://localhost:5000/docs
```

## 🧪 Testes

```bash
  yarn test
  yarn test:cov
```

## 🔐 Autenticação

- Rota de login: POST /auth/login
- Proteção com @UseGuards(JwtAuthGuard)
- Swagger com suporte a Bearer Token

## 🗂️ Estrutura de pastas (resumo)

```bash
  src/
    ├── auth/         # Módulo de autenticação
    ├── user/         # CRUD de usuários
    ├── prisma/       # Serviço Prisma
    ├── common/       # Interceptors, filtros, decoradores
    └── logger/       # Winston logger
```

## 🏆 Bônus implementados

| Requisito Extra                  | Implementado |
| -------------------------------- | ------------ |
| ✅ JWT com proteção de rotas     | ✅ Sim       |
| ✅ Swagger com @nestjs/swagger   | ✅ Sim       |
| ✅ Cache com Redis               | ✅ Sim       |
| ✅ Logs estruturados com Winston | ✅ Sim       |
| ✅ .env + @nestjs/config         | ✅ Sim       |
| ✅ Cobertura com Jest            | ✅ Sim       |
