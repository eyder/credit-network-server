const graphDriver = require('../db/credit-network-graph-driver');

class ConnectionsRepository {
  constructor() {
    this.graphDriver = graphDriver;
  }

  async findByUserId(userId) {
    const session = this.graphDriver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})-[connection:CONNECTION]->(other:User)
          RETURN
            {limit: connection.limit, debt:connection.debt, to:other} AS connections
        `, { userId });
      return result.records.map(record => record.get('connections').properties);
    } finally {
      session.close();
    }
  }
}

module.exports = new ConnectionsRepository();
