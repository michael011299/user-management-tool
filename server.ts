const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes/userRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { initDatabase } = require('./models/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', userRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;