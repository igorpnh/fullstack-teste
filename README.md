# Como Rodar o Projeto

Guia passo a passo para clonar, configurar e executar a aplicação fullstack (Next.js + NestJS + PostgreSQL) utilizando Docker.

---

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Git](https://git-scm.com/)
- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

---

## 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/fullstack-teste.git
cd fullstack-teste
```

---

## 2. Configurar Variáveis de Ambiente

### Backend (`backend/.env`)

Crie o arquivo `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

O conteúdo padrão já é suficiente:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=myapp

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
FRONTEND_URL=http://localhost:8080
JWT_SECRET=supersecret
PORT=5000
```

### Frontend (`frontend/.env`)

Crie o arquivo `frontend/.env` a partir do exemplo:

```bash
cp frontend/.env.example frontend/.env
```

O conteúdo padrão já é suficiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 3. Subir a Aplicação com Docker

Com os arquivos `.env` configurados, basta executar:

```bash
docker compose up -d --build
```

Esse comando irá:

1. **Construir** as imagens do backend e frontend
2. **Iniciar** o banco de dados PostgreSQL (porta `5432`)
3. **Executar** as migrations do Prisma automaticamente
4. **Iniciar** o backend NestJS (porta `5000`)
5. **Iniciar** o frontend Next.js (porta `8080`)

Aguarde até que todos os containers estejam saudáveis:

```bash
docker compose ps
```

Saída esperada:

```
NAME            STATUS
my_postgres     running (healthy)
my_backend      running
my_frontend     running
```

---

## 4. Acessar a Aplicação

| Serviço    | URL                          |
| ---------- | ---------------------------- |
| Frontend   | http://localhost:8080        |
| Backend    | http://localhost:5000        |
| API (base) | http://localhost:5000/api/v1 |

---

## Comandos Úteis

| Comando                          | Descrição                                      |
| -------------------------------- | ---------------------------------------------- |
| `docker compose up -d --build`   | Construir e iniciar todos os serviços          |
| `docker compose down`            | Parar e remover os containers                  |
| `docker compose logs -f`         | Acompanhar logs de todos os serviços           |
| `docker compose logs -f backend` | Acompanhar logs apenas do backend              |
| `docker compose restart`         | Reiniciar todos os containers                  |
| `docker compose down -v`         | Parar containers e **remover volumes** (dados) |

---

## Tecnologias Utilizadas

- **Frontend:** Next.js 16, React 19, TypeScript, Chakra UI v3
- **Backend:** NestJS, Prisma ORM, JWT (httpOnly cookies)
- **Banco de Dados:** PostgreSQL 16
- **Infraestrutura:** Docker, Docker Compose
