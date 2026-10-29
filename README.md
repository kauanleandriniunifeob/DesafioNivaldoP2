# API de Gerenciamento de Imobiliária

API REST em microsserviços (Node.js, Express, Sequelize, MySQL) para uma imobiliária.
Detalhes da ideia e do diagrama de classes em [`docs/`](docs/).

## Status do projeto (~50%)

| Parte | Situação |
|---|---|
| auth-service: cadastro, login (bcrypt + JWT), `/auth/me` | Pronto |
| imoveis-service: CRUD de imóveis com autorização por papel e por dono | Pronto |
| imoveis-service: agendamento de visitas com regra de conflito de horário | Pronto |
| Proposta: model criado | Pronto |
| Proposta: rotas, aceitar/recusar e efeito no status do imóvel | Próxima etapa |

## Arquitetura

```
auth-service (porta 3001)        imoveis-service (porta 3002)
  Usuario  -> auth_db              Imovel, Visita, Proposta -> imoveis_db
  emite o JWT                      valida o JWT (mesmo JWT_SECRET)
```

Cada serviço tem seu banco e segue MVC: `routes -> middlewares -> controllers -> models`.
O imoveis-service não consulta o auth-service: ele confia no token (que carrega `id` e `papel`).

## Como rodar

1. Crie os dois bancos no MySQL:
   ```sql
   CREATE DATABASE auth_db;
   CREATE DATABASE imoveis_db;
   ```
2. Em cada serviço:
   ```bash
   cd auth-service        # depois repita em imoveis-service
   cp .env.example .env   # edite DB_PASS e JWT_SECRET
   npm install
   npm run dev
   ```
   O `JWT_SECRET` precisa ser **igual** nos dois `.env`. As tabelas são criadas automaticamente na primeira execução.

## Rotas

### auth-service (`http://localhost:3001`)
| Método | Rota | Acesso | Respostas |
|---|---|---|---|
| POST | `/auth/register` | público | 201, 400, 409 |
| POST | `/auth/login` | público | 200, 400, 401 |
| GET | `/auth/me` | token | 200, 401, 404 |

Body do register: `{ "nome": "Ana", "email": "ana@email.com", "senha": "123456", "papel": "CORRETOR" }`
(`papel` é `CLIENTE` ou `CORRETOR`; se omitido, vira `CLIENTE`).

### imoveis-service (`http://localhost:3002`)
Todas as rotas exigem `Authorization: Bearer <token>`.

| Método | Rota | Papel | Respostas |
|---|---|---|---|
| GET | `/imoveis?tipo=&status=` | qualquer | 200, 400, 401 |
| GET | `/imoveis/:id` | qualquer | 200, 404 |
| POST | `/imoveis` | CORRETOR | 201, 400, 403 |
| PUT | `/imoveis/:id` | CORRETOR dono | 200, 403, 404 |
| DELETE | `/imoveis/:id` | CORRETOR dono | 204, 403, 404 |
| POST | `/visitas` | CLIENTE | 201, 400, 404, 409 |
| GET | `/visitas` | CLIENTE (as suas) / CORRETOR (dos seus imóveis) | 200 |
| DELETE | `/visitas/:id` | CLIENTE dono | 204, 403, 404 |

Body de imóvel: `{ "titulo": "Casa no centro", "tipo": "CASA", "preco": 350000, "endereco": "Rua A, 100" }`
(`tipo`: CASA, APARTAMENTO, TERRENO ou COMERCIAL).

Body de visita: `{ "imovelId": 1, "dataHora": "2026-11-10T14:00:00Z" }`

## Regras de negócio já implementadas

1. Duas visitas não podem ocupar o mesmo horário no mesmo imóvel (cada visita ocupa 1 hora) -> **409**.
2. Só é possível visitar imóveis `DISPONIVEL` e em data futura.
3. Corretor só edita e remove os imóveis que cadastrou -> **403**.
4. O `corretorId` e o `clienteId` vêm sempre do token, nunca do body.
5. Cliente só cancela as próprias visitas.

## Roteiro de testes no Insomnia

1. Registrar um CORRETOR e um CLIENTE (`POST /auth/register`).
2. Login dos dois e guardar os tokens (`POST /auth/login`).
3. Como corretor: criar um imóvel (201).
4. Como cliente: tentar criar imóvel (403) e chamar `GET /imoveis` sem token (401).
5. Enviar dados inválidos, como preço negativo ou e-mail sem `@` (400).
6. Como cliente: agendar visita (201) e repetir o mesmo horário (409).
7. Como outro corretor: tentar editar o imóvel (403).
