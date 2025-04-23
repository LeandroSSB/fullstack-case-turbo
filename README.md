# 🚀 Fullstack Case - Turborepo (NestJS + Next.js)

Monorepo para o case técnico utilizando **Turborepo**, com as aplicações de **frontend (Next.js)** e **backend (NestJS)** organizadas em workspaces, compartilhando cache e comandos otimizados.

---


## 🧩 Tecnologias e Ferramentas

- 🧠 **NestJS** no backend
- ⚡ **Next.js** no frontend
- 📦 **Turborepo** para gerenciamento
- 🐘 **PostgreSQL** com **Prisma**
- ⚡ **Redis** para cache no backend
- 🔐 JWT para autenticação
- 🧪 Testes com Jest
- 🧾 Documentação com Swagger
- 🔄 React Query no frontend

---

## 🧪 Comandos disponíveis

### 🚀 Desenvolvimento

```bash
  yarn dev        # Roda backend e frontend em paralelo
```

### 💻 Somente frontend (Next.js)
```bash
  yarn dev:frontend
```

### 🔧 Somente backend (NestJS)
```bash
  yarn dev:backend
```

### 🧪 Testes
```bash
  yarn test       # Roda testes do backend
  yarn test:cov   # Roda testes com cobertura
```
- Todos os comandos são otimizados com o cache do Turborepo 🔁

## 🧙‍♂️ Variáveis de ambiente

### .env na raiz (comuns)
```env
  DATABASE_URL=postgresql://user:password@localhost:5432/db
  JWT_SECRET=supersegredo
  REDIS_URL=redis://localhost:6379
  PORT=5000
  persistLog="true"
```

### .env.local no frontend
```env
  NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📖 Documentação da API
  Acesse:
  ```bash
    http://localhost:5000/docs
  ```

## ✅ Fluxo de autenticação
  - A autenticação usa POST /auth/login
  - O token JWT é armazenado no localStorage
  - A API é protegida com @UseGuards(JwtAuthGuard)
  - O frontend injeta o token automaticamente via axios