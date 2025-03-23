// Importando o Fastify
const fastify = require('fastify')({ logger: true });
const { monitorRequest, monitorResponse } = require('./src/metrics');
const cors = require('@fastify/cors');

// Registrar CORS - permitir acesso de qualquer origem
fastify.register(cors, { 
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Adicionar os middlewares de métricas
fastify.addHook('onRequest', monitorRequest);
fastify.addHook('onResponse', monitorResponse);

// Rota raiz
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

// Registrando as rotas
fastify.register(require('./routes/items'), { prefix: '/api/items' });
fastify.register(require('./routes/health'), { prefix: '/health' });

// Iniciar o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 