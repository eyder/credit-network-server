const graph = require('../db/graph');

function mapData(request) {
  request.created_at = new Date(request.created_at);
  return request;
}

class ConnectionsRepository {
  constructor() {
    this.graph = graph;
  }

  async create(userIdA, userIdB) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session.run(`
            MATCH (userA:User {id: $userIdA})
            MATCH (userB:User {id: $userIdB})
            CREATE (userA)-[connectionAtoB:CONNECTION {
              created_at: $dateMillis,
              limit: 100,
              debt: 0
            }]->(userB)
            CREATE (userB)-[connectionBtoA:CONNECTION {
              created_at: $dateMillis,
              limit: 100,
              debt: 0
            }]->(userA)
            RETURN connectionAtoB
          `, { userIdA, userIdB, dateMillis: Date.now() });
        return mapData(result.records[0].get('connectionAtoB').properties);
      },
    );
  }

  async findByUserId(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User {id: $userId})-[connection:CONNECTION]->(other:User)
            RETURN connection, other AS to
          `, { userId });

        return result.records.map((record) => {
          const connection = mapData(record.get('connection').properties);
          connection.to = record.get('to').properties;
          return connection;
        });
      },
    );
  }
}

module.exports = new ConnectionsRepository();
