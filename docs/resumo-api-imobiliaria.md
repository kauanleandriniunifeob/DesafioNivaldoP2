# API de Gerenciamento de Imobiliária — Resumo

**Problema:** imobiliárias pequenas controlam imóveis, visitas e propostas em planilhas e mensagens, o que gera visitas duplicadas e propostas perdidas. A API centraliza tudo e aplica as regras do negócio.

**Papéis:**
- **CORRETOR:** cadastra e gerencia seus imóveis, aceita ou recusa propostas.
- **CLIENTE:** busca imóveis, agenda visitas e envia propostas.

**Meu papel:** desenvolvedor do back-end (API REST com autenticação e autorização).

**Microsserviços:**
- **auth-service:** cadastro, login, bcrypt e JWT (Usuario).
- **imoveis-service:** Imovel, Visita e Proposta, validando o token recebido.

**Principais rotas:**
- `POST /auth/register`, `POST /auth/login`
- `GET /imoveis` (todos), `POST/PUT/DELETE /imoveis` (corretor)
- `POST /visitas`, `GET /visitas`, `DELETE /visitas/:id` (cancelar)
- `POST /propostas` (cliente), `PATCH /propostas/:id/aceitar` e `/recusar` (corretor)

**Regras de negócio:**
1. Não pode haver duas visitas no mesmo horário para o mesmo imóvel (409).
2. Corretor só edita os imóveis que cadastrou (403).
3. Cliente só vê e cancela as próprias visitas e propostas.
4. Ao aceitar uma proposta, as outras do imóvel são recusadas e o imóvel muda para RESERVADO ou VENDIDO.

**Segurança:** JWT (`verifyToken`) + middleware de papel; senhas com bcrypt.

**Status codes:** 200, 201, 204, 400, 401, 403, 404, 409.

**Stack e testes:** Node.js, Express, Sequelize, MySQL, express-validator. Testes no Insomnia.
