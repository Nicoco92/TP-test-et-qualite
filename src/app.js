const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const studentsRoutes = require('./routes/students');
const coursesRoutes = require('./routes/courses');

const swaggerDefinition = require('../swaggerDef'); // garde swaggerDef.js à la racine
const options = {
  definition: swaggerDefinition,
  apis: ['./src/controllers/*.js'], // Chemin vers les fichiers avec les commentaires JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();
app.use(express.json());

// Serve swagger UI with the generated spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Optional: expose the raw swagger JSON for download/CI
app.get('/swagger.json', (req, res) => res.json(swaggerSpec));

const x = require('./routes/students');
const y = require('./routes/courses');

const storage = require('./services/storage');

storage.seed();

app.use('/students', x);
app.use('/courses', y);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  const p = process.env.PORT || 3000;
  app.listen(p, () => {
    console.log(`Server listening on port ${p}`);
  });
}

module.exports = app;
