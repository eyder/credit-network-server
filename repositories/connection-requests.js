
const graph = require('../db/graph');

class ConnectionResquestsRepository {
  constructor() {
    this.graph = graph;
  }

  async create(fromUserId, toUserId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (from:User {id: $fromUserId})
            MATCH (to:User {id: $toUserId})
            CREATE (from)-[request:CONNECTION_REQUEST {
              date: $dateMillis
            }]->(to)
            RETURN request
          `, {
            fromUserId, toUserId, dateMillis: Date.now(),
          });
        return result.records[0].get('request').properties;
      },
    );
  }

  async findReceivedByUserId(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User {id: $userId})<-[request:CONNECTION_REQUEST]-(other:User)
            RETURN request.date as date, other AS from
          `, { userId });
        return result.records.map(record => ({
          date: new Date(record.get('date')),
          from: record.get('from').properties,
        }));
      },
    );
  }

  async findSentByUserId(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User {id: $userId})-[request:CONNECTION_REQUEST]->(other:User)
            RETURN request.date as date, other AS to
          `, { userId });
        return result.records.map(record => ({
          date: new Date(record.get('date')),
          to: record.get('to').properties,
        }));
      },
    );
  }
}

module.exports = new ConnectionResquestsRepository();
