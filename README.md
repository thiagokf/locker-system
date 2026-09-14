# Locker System

Sistema de smart lockers para entrega de encomendas em condomínios. O entregador deposita a encomenda em um dos compartimentos do locker, e o morador realiza a retirada utilizando um código de retirada.

## Arquitetura

A aplicação é dividida em frontend e backend, este último estruturado em microsserviços, todos orquestrados via Docker Compose:

```
Navegador
   │  localhost:5173
   ▼
frontend (React + nginx)
   │  localhost:3000
   ▼
api-gateway
   │  rede interna Docker
   ├── servico-locker    (porta interna 3002)
   ├── servico-entregas  (porta interna 3003)
   └── servico-logs      (porta interna 3004)
```

O `api-gateway` é o único ponto de entrada do backend, responsável por rotear as requisições para o microsserviço correto. Os demais serviços não são acessíveis diretamente de fora da rede Docker.

## Stack

**Frontend**
- React
- TypeScript
- Vite

**Backend**
- Node.js
- Express
  
**Banco de dados**
- SQLite

**Infraestrutura**
- Docker
- Docker Compose

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) (versão 20+)
- Docker Compose V2 (já incluso nas versões recentes do Docker)

## Como rodar

1. Clone o repositório:
   ```bash
   git clone https://github.com/thiagokf/locker-system.git
   cd locker-system
   ```

2. Suba os containers:
   ```bash
   docker compose up --build
   ```

3. Acesse:
   - **Frontend:** http://localhost:5173
   - **API Gateway:** http://localhost:3000

##  Parar os containers

```bash
docker compose down
```

## Contribuindo

Sugestões e melhorias são bem-vindas! Sinta-se à vontade para abrir uma issue ou pull request 😊.
