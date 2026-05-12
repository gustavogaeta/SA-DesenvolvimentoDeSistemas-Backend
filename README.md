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
