// Importando o Fastify
const fastify = require('fastify')({ logger: true });
const { monitorRequest } = require('./src/metrics');

// Adicionar o middleware de métricas para todas as requisições
fastify.addHook('onRequest', monitorRequest);

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