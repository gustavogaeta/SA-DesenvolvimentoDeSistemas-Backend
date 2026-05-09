# 🚀 FinTech Flow Backend - Guia de Deploy Multi-Computador

## ✅ Status: 100% FUNCIONAL COM NEON POSTGRESQL

### 📋 Testes Realizados com Sucesso:
- ✅ Health Check: `GET /api/health`
- ✅ Registro: `POST /api/auth/register`
- ✅ Login: `POST /api/auth/login`
- ✅ Transações: `POST /api/transactions`
- ✅ Saldo: `GET /api/balance`
- ✅ Listagem: `GET /api/transactions`

---

## 🌐 Como Usar em Qualquer Computador

### **PASSO 1: Clonar o Projeto**
```bash
git clone https://github.com/gustavogaeta/gustavogaeta-SA-BancoDeDados-Backend.git
cd gustavogaeta-SA-BancoDeDados-Backend
```

### **PASSO 2: Instalar Dependências**
```bash
npm install
```

### **PASSO 3: Configurar .env**
```bash
# Criar arquivo .env com a DATABASE_URL do Neon
DATABASE_URL="postgresql://neondb_owner:npg_EJ6S3zVmToxF@ep-weathered-wildflower-ackvpwom-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=3333
NODE_ENV=development
JWT_SECRET="fintech-flow-super-secret-jwt-key-2024-change-in-production"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### **PASSO 4: Gerar Prisma Client**
```bash
npm run prisma:generate
```

### **PASSO 5: Iniciar Servidor**
```bash
npm run dev
```

**Servidor estará disponível em:** `http://localhost:3333`

---

## 🔗 Endpoints da API

### **Autenticação (Públicos)**
```bash
# Registrar usuário
POST http://localhost:3333/api/auth/register
{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "123456"
}

# Fazer login
POST http://localhost:3333/api/auth/login
{
  "email": "seu@email.com",
  "password": "123456"
}
```

### **Transações (Privados - Requer Token)**
```bash
# Criar transação
POST http://localhost:3333/api/transactions
Authorization: Bearer <seu_token>
{
  "title": "Salário",
  "amount": 5000,
  "type": "INCOME"
}

# Listar transações
GET http://localhost:3333/api/transactions
Authorization: Bearer <seu_token>

# Consultar saldo
GET http://localhost:3333/api/balance
Authorization: Bearer <seu_token>
```

---

## 🧪 Testes Rápidos

### **Health Check**
```bash
curl http://localhost:3333/api/health
```

### **Registro + Login + Transação**
```bash
# 1. Registrar
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'

# 2. Login (guardar o token retornado)
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 3. Criar transação (usando o token)
curl -X POST http://localhost:3333/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Salário","amount":5000,"type":"INCOME"}'
```

---

## 🛠️ Scripts Disponíveis

```bash
npm start              # Produção
npm run dev           # Desenvolvimento (com nodemon)
npm run prisma:generate    # Gerar Prisma Client
npm run prisma:migrate     # Executar migrações
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:seed        # Popular banco com dados de teste
```

---

## 🔧 Configuração do Frontend React

### **Axios Configuration**
```javascript
// src/api/config.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FinTech:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### **Exemplo de Uso**
```javascript
// Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: '123456'
});

const { token } = response.data.data;
localStorage.setItem('@FinTech:token', token);

// Criar transação
const transaction = await api.post('/transactions', {
  title: 'Salário',
  amount: 5000,
  type: 'INCOME'
});

// Consultar saldo
const balance = await api.get('/balance');
```

---

## 🚨 Solução de Problemas

### **Erro de Conexão Neon**
```bash
# Verificar .env
echo $DATABASE_URL

# Testar conexão
npm run prisma:generate
npm run prisma:migrate
```

### **Erro de Token JWT**
```bash
# Verificar se JWT_SECRET está configurado
# Fazer login novamente para obter novo token
```

### **Erro CORS**
```bash
# Verificar se CORS_ORIGIN está correto no .env
# Para frontend em porta 3000: CORS_ORIGIN="http://localhost:3000"
```

---

## 📊 Estrutura do Banco (Neon PostgreSQL)

### **Tabelas Criadas**
- `users` - Usuários do sistema
- `transactions` - Transações financeiras

### **Dados de Teste (Seed)**
- **Admin**: admin@fintech.com / admin123
- **User**: user@fintech.com / user123
- **5 transações de exemplo** para usuário de teste

---

## 🎯 Pronto para Produção

### **Variáveis de Ambiente Produção**
```bash
NODE_ENV=production
DATABASE_URL="<neon-production-url>"
JWT_SECRET="<secret-forte>"
CORS_ORIGIN="<frontend-url>"
```

### **Deploy em Serviços Cloud**
- **Heroku**: Configurar build e start scripts
- **Railway**: Adicionar DATABASE_URL como variável de ambiente
- **Vercel**: Configurar serverless functions
- **AWS EC2**: Configurar PM2 para process management

---

## ✅ Verificação Final

### **Checklist de Deploy:**
- [ ] Node.js >= 16.0.0 instalado
- [ ] npm install executado
- [ ] .env configurado com DATABASE_URL do Neon
- [ ] Prisma Client gerado
- [ ] Servidor iniciado na porta 3333
- [ ] Health check retornando OK
- [ ] Autenticação funcionando
- [ ] Transações criadas com sucesso
- [ ] Saldo calculado corretamente

---

## 🎉 **CONCLUSÃO: BACKEND 100% FUNCIONAL!**

O FinTech Flow Backend está completamente configurado com:
- ✅ **Neon PostgreSQL** online e acessível globalmente
- ✅ **API REST** completa e testada
- ✅ **Autenticação JWT** segura
- ✅ **Soft Delete** implementado
- ✅ **Multi-computador** funcional
- ✅ **Frontend Ready** para integração React

**Pronto para desenvolver o frontend!** 🚀
