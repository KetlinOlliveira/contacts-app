# 📇 Contacts App

A full-stack contact management app built with **Node.js + TypeScript + Express + MongoDB** on the backend and **React + TypeScript + Vite** on the frontend.

---

## ✨ Features

- **CRUD completo** — criar, listar, editar e deletar contatos
- **Busca em tempo real** por nome, email ou empresa
- **Design elegante** com paleta pastel (cream, teal, lavender, violet)
- **API REST** com validações e tratamento de erros
- **TypeScript** em todo o projeto (backend + frontend)

---

## 📁 Estrutura do Projeto

```
contacts-app/
├── backend/               # API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── models/        # Schemas do Mongoose
│   │   ├── routes/        # Rotas da API
│   │   └── index.ts       # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/              # Interface React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── services/      # Chamadas à API (axios)
│   │   ├── types/         # Tipos TypeScript
│   │   └── App.tsx        # Componente principal
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── package.json
```

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js** >= 18
- **MongoDB** rodando localmente (ou uma URI do MongoDB Atlas)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/contacts-app.git
cd contacts-app
```

### 2. Configure o Backend

```bash
cd backend
cp .env.example .env
# Edite o .env com sua MONGODB_URI se necessário
npm install
npm run dev
```

A API estará disponível em `http://localhost:3001`

### 3. Configure o Frontend

```bash
cd frontend
npm install
npm run dev
```

O app estará disponível em `http://localhost:5173`

---

## 📡 Endpoints da API

| Método | Rota                  | Descrição               |
|--------|-----------------------|-------------------------|
| GET    | `/api/contacts`       | Listar todos os contatos |
| GET    | `/api/contacts/:id`   | Buscar contato por ID   |
| POST   | `/api/contacts`       | Criar novo contato      |
| PUT    | `/api/contacts/:id`   | Atualizar contato       |
| DELETE | `/api/contacts/:id`   | Deletar contato         |
| GET    | `/api/health`         | Health check da API     |

### Exemplo de payload (POST /api/contacts)

```json
{
  "name": "Ana Silva",
  "email": "ana@email.com",
  "phone": "(11) 98765-4321",
  "company": "Tech Co.",
  "notes": "Conhecida na conferência de 2024"
}
```

---

## 🛠️ Stack Tecnológica

**Backend**
- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- dotenv, cors

**Frontend**
- React 18 + TypeScript
- Vite
- Axios

---

## 🎨 Design

Interface com paleta de cores pastel:
- `#f2eae0` — Cream (fundo principal)
- `#b4d3d9` — Soft Teal (acentos)
- `#bda6ce` — Lavender (elementos secundários)
- `#9b8ec7` — Violet (destaques e CTAs)

Fontes: **DM Serif Display** (títulos) + **DM Sans** (corpo)

---

## 📝 Licença

MIT
