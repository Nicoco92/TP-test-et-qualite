module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Student Course API',
    version: '1.0.0',
    description: 'API pédagogique pour gérer étudiants et cours (no DB)',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur local',
    },
  ],
  components: {
    schemas: {
      Student: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Alice' },
          email: { type: 'string', example: 'alice@example.com' },
        },
        required: ['name', 'email'],
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Math' },
          teacher: { type: 'string', example: 'Mr. Smith' },
        },
        required: ['title', 'teacher'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Not Found' },
        },
      },
    },
  },
};
