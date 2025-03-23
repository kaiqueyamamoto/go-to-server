# Servidor Fastify Simples

Um servidor API simples construído com Fastify.

## Instalação

```bash
npm install
```

## Iniciar o servidor

Para iniciar o servidor em modo de produção:

```bash
npm start
```

Para iniciar o servidor em modo de desenvolvimento com auto-reload:

```bash
npm run dev
```

## Endpoints disponíveis

- `GET /` - Retorna uma mensagem de boas-vindas
- `GET /api/items` - Retorna uma lista de itens
- `GET /api/items/:id` - Retorna um item específico pelo ID

## Endpoints de Health e Métricas

- `GET /health/liveness` - Verifica se o servidor está rodando
- `GET /health/readiness` - Verifica se o servidor está pronto para receber tráfego
- `GET /health/metrics` - Retorna métricas no formato Prometheus
- `GET /health/info` - Retorna informações detalhadas sobre o sistema

## Integração com Prometheus

As métricas são expostas no endpoint `/health/metrics` e podem ser facilmente integradas com o Prometheus. As métricas disponíveis incluem:

- Métricas padrão do Node.js (CPU, memória, etc.)
- `http_requests_total` - Contador total de requisições HTTP
- `http_request_duration_ms` - Histograma de duração das requisições
- `active_connections` - Gauge de conexões ativas 