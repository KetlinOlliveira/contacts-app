<div align = "center">

# 📇 Contacts App

![Node [badge]](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript [badge]](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express [badge]](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB [badge]](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

![React [badge]](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript [badge]](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite [badge]](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Um app fullStack de gerenciamento de contatos desenvolvido com **Node.js + TypeScript + Express + MongoDB** no backend e **React + TypeScript + Vite** no frontend.

</div>

---

## ✨ Features

- **CRUD completo** — criar, listar, editar e deletar contatos
- **Busca em tempo real** por nome, email ou empresa
- **Design elegante** com paleta pastel (cream, teal, lavender, violet)
- **API REST** com validações e tratamento de erros
- **TypeScript** em todo o projeto (backend + frontend)

---

## Demonstração Visual

> Tela inicial
<img width="1784" height="885" alt="Captura de tela 2026-03-28 152049" src="https://github.com/user-attachments/assets/fa5cb0ab-c16d-4719-aa3b-eb6929397f8c" />

>Cadastrando novo Contato/Editando
<img width="1198" height="912" alt="Captura de tela 2026-03-28 151929" src="https://github.com/user-attachments/assets/4833b402-9afe-4d17-857f-5c728af5a577" />

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
