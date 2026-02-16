import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'POS Coffee Shop API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        CreateCategoryRequest: {
          type: 'object',
          required: ['name', 'icon'],
          properties: {
            name: { type: 'string', example: 'Coffee' },
            description: { type: 'string' },
            icon: { type: 'string', example: '☕' },
            isActive: { type: 'boolean', example: true },
          },
        },
        UpdateCategoryRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Admin' },
            email: { type: 'string', example: 'admin@mail.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@mail.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        CreateMenuRequest: {
          type: 'object',
          required: [
            'imageUrl',
            'name',
            'categoryId',
            'stock',
            'productionCapital',
            'sellingPrice',
            'profit',
            'isActive',
          ],
          properties: {
            imageUrl: {
              type: 'string',
              example: 'https://example.com/image.jpg',
            },
            name: { type: 'string', example: 'Nasi Goreng' },
            categoryId: { type: 'string', example: 'cat_123' },
            stock: { type: 'integer', example: 50 },
            productionCapital: { type: 'number', example: 15000 },
            sellingPrice: { type: 'number', example: 25000 },
            profit: { type: 'number', example: 10000 },
            isActive: { type: 'boolean', example: true },
          },
        },
        UpdateMenuRequest: {
          type: 'object',
          properties: {
            imageUrl: { type: 'string' },
            name: { type: 'string' },
            categoryId: { type: 'string' },
            stock: { type: 'integer' },
            productionCapital: { type: 'number' },
            sellingPrice: { type: 'number' },
            profit: { type: 'number' },
            isActive: { type: 'boolean' },
          },
        },
        CreateRewardRequest: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              example: 'Free Coffee',
            },
            type: {
              type: 'string',
              enum: ['REWARD', 'VOUCHER'],
              example: 'REWARD',
            },
            description: {
              type: 'string',
              maxLength: 255,
              example: 'Get a free coffee with 100 points',
            },
            isActive: { type: 'boolean', example: true },
            points: { type: 'integer', minimum: 1, example: 100 },
            code: {
              type: 'string',
              minLength: 1,
              maxLength: 50,
              example: 'FREECOFFEE123',
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-31T23:59:59Z',
            },
            conditions: {
              type: 'string',
              maxLength: 255,
              example: 'Valid for all coffee types',
            },
          },
        },
        UpdateRewardRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            type: { type: 'string', enum: ['REWARD', 'VOUCHER'] },
            description: { type: 'string', maxLength: 255 },
            isActive: { type: 'boolean' },
            points: { type: 'integer', minimum: 1 },
            code: { type: 'string', minLength: 1, maxLength: 50 },
            expiryDate: { type: 'string', format: 'date-time' },
            conditions: { type: 'string', maxLength: 255 },
          },
        },
        RewardListResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'reward_123' },
            name: { type: 'string', example: 'Free Coffee' },
            type: {
              type: 'string',
              enum: ['REWARD', 'VOUCHER'],
              example: 'REWARD',
            },
            isActive: { type: 'boolean', example: true },
            points: { type: 'integer', example: 100 },
            code: { type: 'string', example: 'FREECOFFEE123' },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-31T23:59:59Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00Z',
            },
          },
        },
        RewardMutateResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'reward_123' },
            name: { type: 'string', example: 'Free Coffee' },
            type: {
              type: 'string',
              enum: ['REWARD', 'VOUCHER'],
              example: 'REWARD',
            },
            description: {
              type: 'string',
              example: 'Get a free coffee with 100 points',
            },
            isActive: { type: 'boolean', example: true },
            points: { type: 'integer', example: 100 },
            code: { type: 'string', example: 'FREECOFFEE123' },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-31T23:59:59Z',
            },
            conditions: {
              type: 'string',
              example: 'Valid for all coffee types',
            },
          },
        },
        RewardDetailResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'reward_123' },
            name: { type: 'string', example: 'Free Coffee' },
            type: {
              type: 'string',
              enum: ['REWARD', 'VOUCHER'],
              example: 'REWARD',
            },
            description: {
              type: 'string',
              example: 'Get a free coffee with 100 points',
            },
            isActive: { type: 'boolean', example: true },
            points: { type: 'integer', example: 100 },
            code: { type: 'string', example: 'FREECOFFEE123' },
            expiryDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-31T23:59:59Z',
            },
            conditions: {
              type: 'string',
              example: 'Valid for all coffee types',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
