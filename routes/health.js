const os = require('os');
const { register } = require('../src/metrics');

const healthRoutes = async (fastify, options) => {
  // Rota para checar se o servidor está funcionando
  fastify.get('/liveness', async (request, reply) => {
    return { status: 'ok' };
  });

  // Rota para verificar se o servidor está pronto para receber tráfego
  fastify.get('/readiness', async (request, reply) => {
    return { status: 'ok' };
  });

  // Rota para fornecer métricas do Prometheus
  fastify.get('/metrics', async (request, reply) => {
    reply.header('Content-Type', register.contentType);
    return register.metrics();
  });

  // Rota com informações detalhadas do sistema
  fastify.get('/info', async (request, reply) => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      memory: {
        free: os.freemem(),
        total: os.totalmem()
      },
      load: os.loadavg(),
      nodeVersion: process.version,
      platform: process.platform
    };
  });
};

module.exports = healthRoutes; 