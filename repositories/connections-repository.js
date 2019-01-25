const graph = require('../db/graph');

class ConnectionsRepository {
  constructor() {
    this.graph = graph;
  }

  async findByUserId(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User {id: $userId})-[connection:CONNECTION]->(other:User)
            RETURN
              {limit: connection.limit, debt:connection.debt, to:other} AS connections
          `, { userId });
        return result.records.map(record => record.get('connections').properties);
      },
    );
  }
}

module.exports = new ConnectionsRepository();
