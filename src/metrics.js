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

// Middleware para iniciar a monitoração de requisição (onRequest)
const monitorRequest = (request, reply, done) => {
  // Incrementar conexões ativas
  activeConnections.inc();
  
  // Armazenar o tempo de início
  request.metricsStart = process.hrtime();
  
  done();
};

// Middleware para finalizar a monitoração (onResponse)
const monitorResponse = (request, reply, done) => {
  // Coletar métricas quando a resposta for enviada
  const labels = {
    method: request.method,
    route: request.routerPath || request.url,
    status_code: reply.statusCode
  };
  
  // Incrementar contador de requisições
  httpRequestsTotal.inc(labels);
  
  // Calcular duração se temos um tempo de início
  if (request.metricsStart) {
    const hrDuration = process.hrtime(request.metricsStart);
    const durationMs = hrDuration[0] * 1000 + hrDuration[1] / 1000000;
    httpRequestDurationMicroseconds.observe(labels, durationMs);
  }
  
  // Decrementar conexões ativas
  activeConnections.dec();
  
  done();
};

module.exports = {
  register,
  monitorRequest,
  monitorResponse
}; 