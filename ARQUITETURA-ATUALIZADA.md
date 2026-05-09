# SISTEMA DE TESOURARIA INTEGRADA – FINTECH FLOW
## Arquitetura de Software (Atualizada com Implementação Real)

### 1. INTRODUÇÃO
O presente trabalho apresenta a arquitetura de software do sistema FinTech Flow, uma aplicação de gestão financeira desenvolvida com o propósito de controlar entradas e saídas de recursos, garantindo integridade, rastreabilidade e organização das informações. A proposta está alinhada ao contexto das fintechs, que demandam sistemas confiáveis, seguros e eficientes para o gerenciamento de dados financeiros.

### 2. OBJETIVO
Desenvolver a arquitetura de um sistema fullstack capaz de:
- registrar usuários e autenticar acesso;
- registrar transações financeiras (entradas e saídas);
- calcular o saldo em tempo real;
- garantir integridade dos dados por meio de validações;
- manter histórico completo das operações (sem exclusão física);
- fornecer API REST robusta para consumo do frontend;
- implementar autenticação JWT para segurança.

### 3. ARQUITETURA DO SISTEMA
A aplicação adota uma arquitetura em camadas (Layered Architecture), dividida em frontend e backend.

#### 3.1 Backend (Node.js + Express)
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

#### 3.2 Frontend (React + Vite)
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

### 4. TECNOLOGIAS UTILIZADAS

#### Backend:
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma ORM** - Mapeamento objeto-relacional
- **JWT** - Autenticação via tokens
- **bcrypt** - Criptografia de senhas
- **Helmet** - Segurança de headers
- **CORS** - Compartilhamento de recursos entre origens
- **Rate Limiting** - Limitação de requisições

#### Frontend:
- **React** - Biblioteca de interface
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP para requisições API
- **Context API** - Gerenciamento de estado global

#### Banco de Dados:
- **PostgreSQL** - Banco de dados relacional
- **Neon** - Serviço de PostgreSQL na nuvem

### 5. JUSTIFICATIVA DA STACK
A escolha do JavaScript como linguagem principal permite o desenvolvimento tanto do backend quanto do frontend com a mesma tecnologia, reduzindo a complexidade do projeto. O React foi selecionado por sua eficiência na construção de interfaces dinâmicas, enquanto o Node.js oferece desempenho adequado e ampla utilização no mercado. O Neon PostgreSQL foi escolhido por ser uma solução serverless que facilita o deploy e escalabilidade.

### 6. MODELAGEM DO BANCO DE DADOS

#### Tabelas Principais:

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

### 7. RASTREABILIDADE
O sistema garante o controle e histórico das operações por meio dos seguintes campos:
- **created_at**: data de criação do registro;
- **updated_at**: data da última modificação;
- **deleted_at**: indica exclusão lógica;
- **created_by**: identifica o responsável pela criação.

Essa estrutura assegura a auditabilidade das informações.

### 8. REGRA DE NEGÓCIO PRINCIPAL
O sistema utiliza o conceito de exclusão lógica (soft delete), não permitindo a remoção definitiva de registros.
- **Registros ativos**: deleted_at nulo
- **Registros excluídos**: deleted_at preenchido

Essa abordagem garante a integridade e rastreabilidade dos dados.

### 9. VALIDAÇÕES
As validações são aplicadas antes da persistência dos dados:

#### Autenticação:
- nome deve ter entre 3 e 100 caracteres;
- email deve ser válido e único;
- senha deve ter no mínimo 6 caracteres;

#### Transações:
- o valor da transação deve ser maior que zero;
- o título é obrigatório;
- o tipo deve ser válido (income ou expense);
- não é permitido alterar registros excluídos.

### 10. CÁLCULO DO SALDO
O saldo não é armazenado no banco de dados. Ele é calculado dinamicamente com base nas transações:
```
Saldo = soma das entradas – soma das saídas
```
Essa estratégia evita inconsistências e redundância de dados.

### 11. API REST
O sistema disponibiliza os seguintes endpoints:

#### Autenticação (Públicos):
```
POST /api/auth/register    # Cadastro de usuário
POST /api/auth/login       # Login de usuário
```

#### Transações (Privados - Requer Autenticação):
```
GET    /api/transactions     # Listar transações
POST   /api/transactions     # Criar transação
PUT    /api/transactions/:id  # Atualizar transação
DELETE /api/transactions/:id  # Excluir transação (soft delete)
```

#### Saldo (Privado - Requer Autenticação):
```
GET /api/balance           # Consultar saldo
```

#### Health Check (Público):
```
GET /api/health           # Status do sistema
```

### 12. FLUXO DA APLICAÇÃO
O fluxo de funcionamento segue a arquitetura em camadas:
```
Frontend → API → Controller → Service → Model → Banco de Dados → Resposta
```

#### Fluxo de Autenticação:
1. Usuário insere credenciais no frontend
2. Frontend envia para POST /api/auth/login
3. Backend valida credenciais com bcrypt
4. Se válido, gera token JWT
5. Frontend armazena token no localStorage
6. Token é enviado em requisições subsequentes

### 13. INTERFACE DO USUÁRIO
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

### 14. METODOLOGIA DE DESENVOLVIMENTO
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

### 15. VERSIONAMENTO
O versionamento do código é realizado utilizando Git, com organização de commits e uso de branches para controle de funcionalidades.

**Repositórios:**
- Backend: https://github.com/gustavogaeta/SA-DesenvolvimentoDeSistemas-Backend
- Frontend: https://github.com/gustavogaeta/S.A-Desenvolvimento-de-Sistemas-FrontEnd

### 16. DOCUMENTAÇÃO
O projeto contém os seguintes arquivos de documentação:
- **README.md**: descrição do sistema, tecnologias e instruções
- **DEPLOYMENT.md**: guia de deploy multi-computador
- **INTEGRACAO-FRONTEND-BACKEND.md**: guia de integração
- **CORS-FIX-DEBUG.md**: debugging e soluções técnicas

### 17. BOAS PRÁTICAS
Durante o desenvolvimento, foram aplicadas boas práticas de programação:
- código limpo (Clean Code);
- organização em camadas;
- nomenclatura clara e padronizada;
- separação de responsabilidades;
- tratamento de erros;
- validações de entrada;
- segurança (JWT, bcrypt, CORS);
- versionamento semântico;

### 18. CONFIGURAÇÕES DE AMBIENTE

#### Backend (.env):
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

#### Frontend (.env):
```
VITE_API_URL=http://localhost:3333/api
```

### 19. SEGURANÇA IMPLEMENTADA
- **JWT**: Tokens com expiração de 7 dias
- **bcrypt**: Senhas hasheadas com 12 salt rounds
- **CORS**: Configuração dinâmica para desenvolvimento
- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: 100 requisições por 15 minutos
- **Validações**: Sanitização de dados de entrada

### 20. CONCLUSÃO
A arquitetura implementada atende plenamente aos requisitos do projeto, garantindo integridade, rastreabilidade e organização do sistema. A utilização de uma API REST integrada a um frontend em React e um banco de dados PostgreSQL na nuvem possibilita a construção de uma aplicação robusta, escalável e alinhada às melhores práticas do mercado de desenvolvimento de software.

O sistema está 100% funcional e pronto para produção, com autenticação segura, gestão de transações completa e interface moderna e responsiva.
