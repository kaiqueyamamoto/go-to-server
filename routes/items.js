// Rotas para itens
const itemRoutes = async (fastify, options) => {
  // Obter todos os itens
  fastify.get('/', async (request, reply) => {
    return [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];
  });

  // Obter um item específico
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    return { id: parseInt(id), name: `Item ${id}` };
  });
};

module.exports = itemRoutes; 