
const graphDriver = require('../db/credit-network-graph-driver');

class ConnectionResquestsRepository {
  constructor() {
    this.graphDriver = graphDriver;
  }

  async create(fromUserId, toUserId, limit) {
    const session = this.graphDriver.session();
    try {
      const result = await session
        .run(`
          MATCH (from:User {id: $fromUserId})
          MATCH (to:User {id: $toUserId})
          CREATE (from)-[request:CONNECTION_REQUEST {
            limit: $limit, 
            date: $dateMillis
          }]->(to)
          RETURN request
        `, {
          fromUserId, toUserId, limit, dateMillis: Date.now(),
        });
      return result.records[0].get('request').properties;
    } finally {
      session.close();
    }
  }

  async findReceivedByUserId(userId) {
    const session = this.graphDriver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})<-[request:CONNECTION_REQUEST]-(other:User)
          RETURN request.limit AS limit, request.date as date, other AS from
        `, { userId });
      return result.records.map(record => ({
        limit: record.get('limit'),
        date: new Date(record.get('date')),
        from: record.get('from').properties,
      }));
    } finally {
      session.close();
    }
  }

  async findSentByUserId(userId) {
    const session = this.graphDriver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})-[request:CONNECTION_REQUEST]->(other:User)
          RETURN request.limit AS limit, request.date as date, other AS to
        `, { userId });
      return result.records.map(record => ({
        limit: record.get('limit'),
        date: new Date(record.get('date')),
        to: record.get('to').properties,
      }));
    } finally {
      session.close();
    }
  }
}

module.exports = new ConnectionResquestsRepository();
