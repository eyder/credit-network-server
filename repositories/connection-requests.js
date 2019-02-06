
const graph = require('../db/graph');

function mapData(request) {
  request.sent_at = new Date(request.sent_at);
  request.canceled_at = request.canceled_at ? new Date(request.canceled_at) : null;
  request.declined_at = request.declined_at ? new Date(request.declined_at) : null;
  request.accepted_at = request.accepted_at ? new Date(request.accepted_at) : null;
  return request;
}

class ConnectionRequestsRepository {
  constructor() {
    this.graph = graph;
  }

  async create(fromUserId, toUserId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session.run(`
            MATCH (from:User {id: $fromUserId})
            MATCH (to:User {id: $toUserId})
            CREATE (from)-[request:CONNECTION_REQUEST {
              sent_at: $dateMillis
            }]->(to)
            RETURN request
          `, { fromUserId, toUserId, dateMillis: Date.now() });
        return mapData(result.records[0].get('request').properties);
      },
    );
  }

  async findReceivedByUserId(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session.run(`
            MATCH (user:User {id: $userId})<-[request:CONNECTION_REQUEST]-(other:User)
            WHERE request.accepted IS NULL AND request.declined IS NULL
            RETURN request, other AS from
            ORDER BY request.sent_at DESC
          `, { userId });
        return result.records.map((record) => {
          const request = mapData(record.get('request').properties);
          request.from = record.get('from').properties;
          return request;
        });
      },
    );
  }

  async findSentByUserId(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session.run(`
            MATCH (user:User {id: $userId})-[request:CONNECTION_REQUEST]->(other:User)
            RETURN request, other AS to
            ORDER BY request.sent_at DESC
          `, { userId });
        return result.records.map((record) => {
          const request = mapData(record.get('request').properties);
          request.to = record.get('to').properties;
          return request;
        });
      },
    );
  }

  async delete(fromUserId, toUserId) {
    return this.graph.runInSession(
      async (session) => {
        await session.run(`
            MATCH (user:User {id: $fromUserId})-[request:CONNECTION_REQUEST]->(other:User {id: $toUserId})
            DELETE request
          `, { fromUserId, toUserId });
      },
    );
  }

  async decline(fromUserId, toUserId) {
    return this.graph.runInSession(
      async (session) => {
        await session.run(`
            MATCH (user:User {id: $fromUserId})-[request:CONNECTION_REQUEST]->(other:User {id: $toUserId})
            SET request.declined = TRUE, request.declined_at = $dateMillis 
          `, { fromUserId, toUserId, dateMillis: Date.now() });
      },
    );
  }

  async accept(fromUserId, toUserId) {
    return this.graph.runInSession(
      async (session) => {
        await session.run(`
            MATCH (user:User {id: $fromUserId})-[request:CONNECTION_REQUEST]->(other:User {id: $toUserId})
            SET request.accepted = TRUE, request.accepted_at = $dateMillis 
          `, { fromUserId, toUserId, dateMillis: Date.now() });
      },
    );
  }
}

module.exports = new ConnectionRequestsRepository();
