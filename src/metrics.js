const client = require('prom-client');

// Criar um registro para métricas
const register = new client.Registry();

// Adicionar métricas padrão do processo (uso de CPU, memória, etc.)
client.collectDefaultMetrics({ register });

// Contador personalizado para requisições HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Histograma para medir a duração das requisições
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duração das requisições HTTP em milissegundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [1, 5, 15, 50, 100, 200, 500, 1000, 2000],
  registers: [register]
});

// Gauge para conexões ativas
const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Número de conexões ativas',
  registers: [register]
});

// Middleware para monitorar as requisições
const monitorRequest = (request, reply, done) => {
  // Incrementar o contador de requisições
  const end = httpRequestDurationMicroseconds.startTimer();
  activeConnections.inc();
  
  reply.on('sent', () => {
    // Finalizar a medição de duração quando a resposta for enviada
    const labels = {
      method: request.method,
      route: request.routerPath || request.url,
      status_code: reply.statusCode
    };
    
    httpRequestsTotal.inc(labels);
    end(labels);
    activeConnections.dec();
  });
  
  done();
};

module.exports = {
  register,
  monitorRequest
}; 