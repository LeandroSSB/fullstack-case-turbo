# 🧠 Frontend - Case Técnico Fullstack (Next.js + React Query)

Este é o frontend do case técnico Fullstack, desenvolvido com **Next.js** e **React Query**. A aplicação consome uma API REST criada com NestJS, oferecendo telas para **login, listagem, criação e edição de usuários**, com integração de autenticação via **JWT**.

---

## 📚 Tecnologias utilizadas

- ⚡ [Next.js](https://nextjs.org/) com TypeScript
- 🔄 [React Query (Tanstack)](https://tanstack.com/query/v4) para cache de requisições
- 🔐 Armazenamento de token JWT no `localStorage`
- 🎨 Estilização com Tailwind CSS (ou classes utilitárias simples)
- 🔗 Integração com backend NestJS

---

## 🧱 Funcionalidades

- Tela de **login** (com autenticação JWT)
- Tela de **listagem de usuários**
- Tela de **cadastro de novo usuário**
- Tela de **edição de usuário existente**
- Listagem disponível mesmo sem login (somente leitura)
- Botões de editar/excluir disponíveis **apenas logado**
- Layout global com cabeçalho e botão de logout
- Integração completa com backend via `axios`

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório

```bash
  git clone https://github.com/seu-user/seu-repo.git
  cd frontend
```

### 2. Instalar dependências

```bash
 yarn
```

### 3. Configurar variáveis de ambiente
Crie um arquivo .env.local com a URL da API:

```env
  NEXT_PUBLIC_API_URL=http://localhost:5000
```
 - ⚠️ A API NestJS precisa estar rodando localmente na porta 5000.

### 4. Rodar o servidor de desenvolvimento
```bash
  yarn dev
```
- A aplicação estará disponível em: http://localhost:3001 (ou porta padrão do Next.js)

## 🗂️ Estrutura do projeto
```bash
  frontend/
  ├── components/          # Layout, UserForm
  ├── pages/               # Rotas: login, users, create, edit
  ├── services/            # Configuração do axios
  ├── hooks/               # (opcional) React Query hooks
  └── interfaces/          # Tipagem da entidade User
```

## 🔐 Autenticação
 - O login (/login) retorna um access_token que é salvo no localStorage
 - O token é enviado automaticamente via header Authorization: Bearer ...
 - Rotas como criar/editar são protegidas pelo Layout
 - Logout limpa o token e redireciona para login

## ✅ Fluxo de uso
  1. Acesse /login com um usuário existente da API
  2. Após login, será redirecionado para /users
  3. A partir daí, pode:
    - Criar novos usuários
    - Editar os existentes
    - Excluir usuários
  4. Se acessar sem login, pode apenas visualizar a lista