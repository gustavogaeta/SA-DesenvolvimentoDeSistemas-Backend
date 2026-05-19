# FinTech Flow Backend

Backend do FinTech Flow - Sistema de Tesouraria Integrada desenvolvido com Node.js, Express, PostgreSQL e Prisma ORM.

## 📋 Sumário

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Database Setup](#database-setup)
- [Executando o Projeto](#executando-o-projeto)
- [API Endpoints](#api-endpoints)
- [Testes](#testes)
- [Deploy](#deploy)

## 🔄 Como Funciona em Diferentes Máquinas

Este repositório é independente do frontend. Para usar em diferentes máquinas:

1. **Clone o repositório**: `git clone [URL-do-backend]`
2. **Instale dependências**: `npm install`
3. **Copie o .env.example**: `cp .env.example .env`
4. **Configure suas variáveis**: Edite o `.env` com suas configurações locais (banco, porta, etc.)
5. **Execute**: `npm run dev`

## Configuração Rápida do Ambiente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3333
DATABASE_URL="postgresql://username:password@localhost:5432/fintech_flow?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Banco de Dados
```bash
# Criar banco PostgreSQL
CREATE DATABASE fintech_flow;

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate
```

### 4. Iniciar o Projeto
```bash
npm run dev
```

## Importante

- O arquivo `.env` nunca deve ser commitado
- Use o `.env.example` como template
- Configure as URLs e banco conforme seu ambiente local
- Backend estará disponível em `http://localhost:3333`
- **Prisma ORM** - ORM para PostgreSQL
- **JWT** - Autenticação via JSON Web Tokens
- **bcrypt** - Hashing de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Compartilhamento de recursos entre origens
- **dotenv** - Variáveis de ambiente

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/         # Controllers da aplicação
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── balanceController.js
│   ├── services/           # Lógica de negócio
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   └── balanceService.js
│   ├── models/             # Models Prisma
│   │   └── index.js
│   ├── routes/             # Definição de rotas
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── balanceRoutes.js
│   ├── middleware/         # Middlewares
│   │   └── authMiddleware.js
│   ├── config/             # Configurações
│   ├── app.js              # Configuração Express
│   └── server.js           # Inicialização do servidor
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── migrations/         # Migrações do banco
├── .env                    # Variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências e scripts
└── README.md               # Documentação
```

## ✅ Pré-requisitos

- Node.js >= 16.0.0
- PostgreSQL >= 12.0
- npm ou yarn

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/gustavogaeta/gustavogaeta-SA-BancoDeDados-Backend.git
cd gustavogaeta-SA-BancoDeDados-Backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Instale o Prisma CLI:**
```bash
npm install -g prisma
```

## ⚙️ Configuração

1. **Copie o arquivo .env:**
```bash
cp .env.example .env
```

**Importante:** O arquivo `.env` nunca deve ser commitado. Use apenas o `.env.example` como template.

2. **Configure as variáveis de ambiente no arquivo .env:**

```env
# Configurações do Servidor
PORT=3333
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/fintech_flow?schema=public"

# Configurações de Segurança JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Configurações CORS
CORS_ORIGIN="http://localhost:3000"

# Configurações de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configurações de Criptografia
BCRYPT_SALT_ROUNDS=12
```

## 🗄️ Database Setup

1. **Crie o banco de dados PostgreSQL:**
```sql
CREATE DATABASE fintech_flow;
```

2. **Gere o Prisma Client:**
```bash
npm run prisma:generate
```

3. **Execute as migrações:**
```bash
npm run prisma:migrate
```

4. **(Opcional) Abra o Prisma Studio:**
```bash
npm run prisma:studio
```

## 🏃‍♂️ Executando o Projeto

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3333`

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário

### Transações (Requer autenticação)
- `GET /api/transactions` - Listar todas as transações
- `GET /api/transactions/:id` - Obter transação por ID
- `POST /api/transactions` - Criar nova transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação (soft delete)

### Saldo (Requer autenticação)
- `GET /api/balance` - Calcular saldo do usuário

### Health Check
- `GET /api/health` - Verificar status do servidor

## 🔐 Autenticação

Para acessar as rotas protegidas, inclua o header `Authorization`:

```
Authorization: Bearer <seu_jwt_token>
```

## 🧪 Testes

### Testes com Postman/Insomnia

1. **Registrar usuário:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456"
}
```

2. **Fazer login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "123456"
}
```

3. **Criar transação:**
```http
POST /api/transactions
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Salário",
  "amount": 5000.00,
  "type": "INCOME"
}
```

4. **Listar transações:**
```http
GET /api/transactions
Authorization: Bearer <token>
```

5. **Consultar saldo:**
```http
GET /api/balance
Authorization: Bearer <token>
```

## 🚀 Deploy

### Variáveis de Ambiente de Produção

- `NODE_ENV=production`
- `DATABASE_URL` - URL do banco de dados PostgreSQL
- `JWT_SECRET` - Segredo JWT forte e único
- `PORT` - Porta do servidor (geralmente 80 ou 443)

### Comandos de Deploy

```bash
# Instalar dependências de produção
npm install --production

# Gerar Prisma Client
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Iniciar servidor
npm start
```

## 📝 Scripts Disponíveis

- `npm start` - Inicia servidor em modo produção
- `npm run dev` - Inicia servidor com nodemon (desenvolvimento)
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Executa migrações do banco
- `npm run prisma:studio` - Abre Prisma Studio
- `npm run prisma:seed` - Executa seed do banco

## 🔧 Recursos

- **Soft Delete:** Implementado em todas as entidades
- **Validação:** Joi para validação de dados
- **Segurança:** Helmet, CORS, Rate Limiting
- **Logging:** Logs de requisições e erros
- **Error Handling:** Tratamento centralizado de erros

## 📄 Licença

Este projeto está licenciado sob a ISC License.

## 👨‍💻 Autor

**Gustavo Gaeta**

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

## 📞 Suporte

Para suporte, envie um email para gustavo.gaeta@example.com ou abra uma issue no repositório do GitHub.

---

# 📐 Arquitetura de Software (Atualizada com Implementação Real)

## 1. Introdução

O presente trabalho apresenta a arquitetura de software do sistema FinTech Flow, uma aplicação de gestão financeira desenvolvida com o propósito de controlar entradas e saídas de recursos, garantindo integridade, rastreabilidade e organização das informações. A proposta está alinhada ao contexto das fintechs, que demandam sistemas confiáveis, seguros e eficientes para o gerenciamento de dados financeiros.

## 2. Objetivo

Desenvolver a arquitetura de um sistema fullstack capaz de:
- registrar usuários e autenticar acesso;
- registrar transações financeiras (entradas e saídas);
- calcular o saldo em tempo real;
- garantir integridade dos dados por meio de validações;
- manter histórico completo das operações (sem exclusão física);
- fornecer API REST robusta para consumo do frontend;
- implementar autenticação JWT para segurança.

## 3. Arquitetura do Sistema

A aplicação adota uma arquitetura em camadas (Layered Architecture), dividida em frontend e backend.

### 3.1 Backend (Node.js + Express)

Responsável pela lógica de negócio, validações, autenticação e comunicação com o banco de dados.

**Estrutura Real Implementada:**
```
backend/
├── src/
│   ├── controllers/        # Controladores de requisições HTTP
│   │   ├── authController.js      # Autenticação de usuários
│   │   ├── transactionController.js # Gestão de transações
│   │   └── balanceController.js   # Cálculo de saldos
│   ├── services/          # Lógica de negócio
│   │   ├── authService.js        # Serviços de autenticação
│   │   ├── transactionService.js  # Serviços de transações
│   │   └── balanceService.js     # Serviços de saldo
│   ├── models/            # Camada de dados (Prisma)
│   │   └── index.js            # Export do PrismaClient
│   ├── routes/            # Definição de rotas da API
│   │   ├── authRoutes.js        # Rotas de autenticação
│   │   ├── transactionRoutes.js # Rotas de transações
│   │   ├── balanceRoutes.js     # Rotas de saldo
│   │   └── index.js            # Agrupamento de rotas
│   ├── middleware/        # Middlewares de segurança e validação
│   │   └── authMiddleware.js    # Middleware de autenticação JWT
│   ├── app.js            # Configuração do Express
│   └── server.js         # Inicialização do servidor
├── prisma/
│   ├── schema.prisma     # Modelo de dados
│   └── seed.js          # Dados iniciais
├── .env                # Variáveis de ambiente
└── package.json         # Dependências e scripts
```

### 3.2 Frontend (React + Vite)

Responsável pela interface do usuário e consumo da API.

**Estrutura Real Implementada:**
```
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   │   ├── Login.jsx           # Página de login
│   │   ├── Register.jsx        # Página de cadastro
│   │   └── Dashboard.jsx       # Dashboard principal
│   ├── contexts/        # Contextos do React
│   │   └── AuthContext.jsx     # Contexto de autenticação
│   ├── routes/          # Configuração de rotas
│   │   └── PrivateRoute.jsx    # Rota protegida
│   ├── services/        # Comunicação com API
│   │   └── api.js             # Configuração do Axios
│   ├── App.jsx          # Componente raiz
│   └── main.jsx         # Ponto de entrada
├── .env               # Variáveis de ambiente
├── index.html         # Template HTML
└── package.json       # Dependências e scripts
```

## 4. Tecnologias Utilizadas

### Backend:
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma ORM** - Mapeamento objeto-relacional
- **JWT** - Autenticação via tokens
- **bcrypt** - Criptografia de senhas
- **Helmet** - Segurança de headers
- **CORS** - Compartilhamento de recursos entre origens
- **Rate Limiting** - Limitação de requisições

### Frontend:
- **React** - Biblioteca de interface
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP para requisições API
- **Context API** - Gerenciamento de estado global

### Banco de Dados:
- **PostgreSQL** - Banco de dados relacional
- **Neon** - Serviço de PostgreSQL na nuvem

## 5. Justificativa da Stack

A escolha do JavaScript como linguagem principal permite o desenvolvimento tanto do backend quanto do frontend com a mesma tecnologia, reduzindo a complexidade do projeto. O React foi selecionado por sua eficiência na construção de interfaces dinâmicas, enquanto o Node.js oferece desempenho adequado e ampla utilização no mercado. O Neon PostgreSQL foi escolhido por ser uma solução serverless que facilita o deploy e escalabilidade.

## 6. Modelagem do Banco de Dados

### Tabelas Principais:

**Users:**
```sql
- id (String, Primary Key, CUID)
- name (String)
- email (String, Unique)
- password (String, Hash com bcrypt)
- created_at (DateTime)
- updated_at (DateTime)
- deleted_at (DateTime, Nullable)
```

**Transactions:**
```sql
- id (String, Primary Key, CUID)
- title (String)
- amount (Decimal, 10,2)
- type (Enum: INCOME | EXPENSE)
- created_at (DateTime)
- updated_at (DateTime)
- deleted_at (DateTime, Nullable)
- created_by (String, Foreign Key -> Users.id)
```

## 7. Rastreabilidade

O sistema garante o controle e histórico das operações por meio dos seguintes campos:
- **created_at**: data de criação do registro;
- **updated_at**: data da última modificação;
- **deleted_at**: indica exclusão lógica;
- **created_by**: identifica o responsável pela criação.

Essa estrutura assegura a auditabilidade das informações.

## 8. Regra de Negócio Principal

O sistema utiliza o conceito de exclusão lógica (soft delete), não permitindo a remoção definitiva de registros.
- **Registros ativos**: deleted_at nulo
- **Registros excluídos**: deleted_at preenchido

Essa abordagem garante a integridade e rastreabilidade dos dados.

## 9. Validações

As validações são aplicadas antes da persistência dos dados:

### Autenticação:
- nome deve ter entre 3 e 100 caracteres;
- email deve ser válido e único;
- senha deve ter no mínimo 6 caracteres;

### Transações:
- o valor da transação deve ser maior que zero;
- o título é obrigatório;
- o tipo deve ser válido (income ou expense);
- não é permitido alterar registros excluídos.

## 10. Cálculo do Saldo

O saldo não é armazenado no banco de dados. Ele é calculado dinamicamente com base nas transações:
```
Saldo = soma das entradas – soma das saídas
```
Essa estratégia evita inconsistências e redundância de dados.

## 11. API REST

O sistema disponibiliza os seguintes endpoints:

### Autenticação (Públicos):
```
POST /api/auth/register    # Cadastro de usuário
POST /api/auth/login       # Login de usuário
```

### Transações (Privados - Requer Autenticação):
```
GET    /api/transactions     # Listar transações
POST   /api/transactions     # Criar transação
PUT    /api/transactions/:id  # Atualizar transação
DELETE /api/transactions/:id  # Excluir transação (soft delete)
```

### Saldo (Privado - Requer Autenticação):
```
GET /api/balance           # Consultar saldo
```

### Health Check (Público):
```
GET /api/health           # Status do sistema
```

## 12. Fluxo da Aplicação

O fluxo de funcionamento segue a arquitetura em camadas:
```
Frontend → API → Controller → Service → Model → Banco de Dados → Resposta
```

### Fluxo de Autenticação:
1. Usuário insere credenciais no frontend
2. Frontend envia para POST /api/auth/login
3. Backend valida credenciais com bcrypt
4. Se válido, gera token JWT
5. Frontend armazena token no localStorage
6. Token é enviado em requisições subsequentes

## 13. Interface do Usuário

A interface principal (dashboard) apresenta:
- formulário de login/cadastro;
- saldo total atualizado;
- listagem de transações;
- formulário para cadastro de novas transações.

**Componentes principais:**
- **Login**: Formulário de autenticação
- **Register**: Formulário de cadastro
- **Dashboard**: Painel principal
- **Balance**: Componente de saldo
- **TransactionList**: Lista de transações
- **TransactionForm**: Formulário de transações

## 14. Metodologia de Desenvolvimento

O projeto foi desenvolvido em etapas (sprints):

**Sprint 1: Estrutura inicial**
- Configuração do ambiente Node.js + Express
- Configuração do Prisma ORM
- Conexão com Neon PostgreSQL
- Estrutura de arquivos e pastas

**Sprint 2: Autenticação e Segurança**
- Implementação de JWT
- Criação de endpoints de autenticação
- Middleware de segurança
- Criptografia de senhas com bcrypt

**Sprint 3: Gestão de Transações**
- CRUD de transações
- Cálculo dinâmico de saldo
- Soft delete implementado
- Validações de negócio

**Sprint 4: Frontend e Integração**
- Desenvolvimento do frontend React
- Configuração do Axios
- Integração frontend-backend
- Resolução de CORS

## 15. Versionamento

O versionamento do código é realizado utilizando Git, com organização de commits e uso de branches para controle de funcionalidades.

**Repositórios:**
- Backend: https://github.com/gustavogaeta/SA-DesenvolvimentoDeSistemas-Backend
- Frontend: https://github.com/gustavogaeta/S.A-Desenvolvimento-de-Sistemas-FrontEnd

## 16. Boas Práticas

Durante o desenvolvimento, foram aplicadas boas práticas de programação:
- código limpo (Clean Code);
- organização em camadas;
- nomenclatura clara e padronizada;
- separação de responsabilidades;
- tratamento de erros;
- validações de entrada;
- segurança (JWT, bcrypt, CORS);
- versionamento semântico;

## 17. Configurações de Ambiente

### Backend (.env):
```
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=fintech-flow-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### Frontend (.env):
```
VITE_API_URL=http://localhost:3333/api
```

## 18. Segurança Implementada

- **JWT**: Tokens com expiração de 7 dias
- **bcrypt**: Senhas hasheadas com 12 salt rounds
- **CORS**: Configuração dinâmica para desenvolvimento
- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: 100 requisições por 15 minutos
- **Validações**: Sanitização de dados de entrada

## 19. Conclusão

A arquitetura implementada atende plenamente aos requisitos do projeto, garantindo integridade, rastreabilidade e organização do sistema. A utilização de uma API REST integrada a um frontend em React e um banco de dados PostgreSQL na nuvem possibilita a construção de uma aplicação robusta, escalável e alinhada às melhores práticas do mercado de desenvolvimento de software.

O sistema está 100% funcional e pronto para produção, com autenticação segura, gestão de transações completa e interface moderna e responsiva.
