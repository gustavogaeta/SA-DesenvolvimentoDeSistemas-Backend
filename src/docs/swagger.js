const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinTech Flow API',
      version: '1.0.0',
      description: 'API de gerenciamento financeiro pessoal — Backend SA Desenvolvimento de Sistemas',
      contact: { name: 'Gustavo Gaeta' },
    },
    servers: [
      { url: 'http://localhost:3333/api', description: 'Desenvolvimento' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error type' },
            message: { type: 'string', example: 'Detailed message' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 5 },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cuid123' },
            title: { type: 'string', example: 'Salário' },
            amount: { type: 'number', example: 5000.00 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Autenticação e cadastro' },
      { name: 'Transactions', description: 'CRUD de transações financeiras' },
      { name: 'Balance', description: 'Saldo consolidado' },
      { name: 'Dashboard', description: 'Dados agregados para o dashboard' },
      { name: 'Reports', description: 'Relatórios financeiros' },
    ],
    paths: {
      // ── Auth ────────────────────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Cadastrar novo usuário',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', minLength: 3, example: 'João Silva' },
                    email: { type: 'string', format: 'email', example: 'joao@email.com' },
                    password: { type: 'string', minLength: 6, example: 'senha123' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            409: { description: 'E-mail já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Autenticar usuário',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@fintech.com' },
                    password: { type: 'string', example: 'user123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string', description: 'JWT Bearer token' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: 'Dados inválidos' },
            401: { description: 'Credenciais incorretas' },
          },
        },
      },

      // ── Transactions ─────────────────────────────────────────────────────────
      '/transactions': {
        get: {
          tags: ['Transactions'],
          summary: 'Listar transações (com filtros e paginação)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Busca por título' },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' }, example: '2026-01-01' },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' }, example: '2026-12-31' },
          ],
          responses: {
            200: {
              description: 'Lista de transações',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
                      pagination: { $ref: '#/components/schemas/Pagination' },
                    },
                  },
                },
              },
            },
            401: { description: 'Token inválido ou ausente' },
          },
        },
        post: {
          tags: ['Transactions'],
          summary: 'Criar transação',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'amount', 'type'],
                  properties: {
                    title: { type: 'string', example: 'Aluguel' },
                    amount: { type: 'number', example: 1500.00 },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Transação criada' },
            400: { description: 'Dados inválidos' },
            401: { description: 'Não autenticado' },
          },
        },
      },
      '/transactions/{id}': {
        get: {
          tags: ['Transactions'],
          summary: 'Buscar transação por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Transação encontrada' },
            404: { description: 'Transação não encontrada' },
          },
        },
        put: {
          tags: ['Transactions'],
          summary: 'Atualizar transação',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Transação atualizada' },
            400: { description: 'Dados inválidos' },
            404: { description: 'Não encontrada' },
          },
        },
        delete: {
          tags: ['Transactions'],
          summary: 'Excluir transação (soft delete)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Transação excluída' },
            404: { description: 'Não encontrada' },
          },
        },
      },

      // ── Balance ──────────────────────────────────────────────────────────────
      '/balance': {
        get: {
          tags: ['Balance'],
          summary: 'Calcular saldo consolidado do usuário',
          responses: {
            200: {
              description: 'Saldo calculado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          income: { type: 'number' },
                          expense: { type: 'number' },
                          balance: { type: 'number' },
                          transactionCount: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ── Dashboard ────────────────────────────────────────────────────────────
      '/dashboard': {
        get: {
          tags: ['Dashboard'],
          summary: 'Visão geral do dashboard (totais, evolução mensal, transações recentes)',
          responses: {
            200: { description: 'Dados do dashboard' },
          },
        },
      },
      '/dashboard/period': {
        get: {
          tags: ['Dashboard'],
          summary: 'Resumo financeiro por período',
          parameters: [
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          ],
          responses: {
            200: { description: 'Resumo do período' },
          },
        },
      },

      // ── Reports ──────────────────────────────────────────────────────────────
      '/reports/monthly': {
        get: {
          tags: ['Reports'],
          summary: 'Relatório mensal agrupado',
          parameters: [
            { name: 'months', in: 'query', schema: { type: 'integer', default: 12, maximum: 24 }, description: 'Quantidade de meses retroativos' },
          ],
          responses: {
            200: { description: 'Relatório mensal' },
          },
        },
      },
      '/reports/history': {
        get: {
          tags: ['Reports'],
          summary: 'Histórico paginado de transações com totais do período',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
          ],
          responses: {
            200: { description: 'Histórico de transações' },
          },
        },
      },

      // ── Health ───────────────────────────────────────────────────────────────
      '/health': {
        get: {
          tags: [],
          summary: 'Health check',
          security: [],
          responses: { 200: { description: 'API online' } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
