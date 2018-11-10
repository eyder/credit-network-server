
const neo4j = require('neo4j-driver').v1;

const url = process.env.GRAPHENEDB_BOLT_URL;
const username = process.env.GRAPHENEDB_BOLT_USER;
const password = process.env.GRAPHENEDB_BOLT_PASSWORD;

class CreditNetworkGraph {
  constructor() {
    this.driver = neo4j.driver(url, neo4j.auth.basic(username, password));
  }

  async createUser(user) {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          CREATE (user:User {id: {id}, name: {name}, email: {email}, picture: {picture}})
          RETURN user
        `, user);
      return result.records[0].get('user').properties;
    } finally {
      session.close();
    }
  }

  async getUser(userId) {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})
          RETURN user
        `, { userId });
      return result.records[0].get('user').properties;
    } finally {
      session.close();
    }
  }

  async listUsers() {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User)
          RETURN user
        `);
      return result.records.map(record => record.get('user').properties);
    } finally {
      session.close();
    }
  }

  async listUsersNotRelatedTo(userId) {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})
          MATCH (other:User)
          WHERE NOT other.id = $userId AND NOT (user)--(other)
          RETURN other
        `, { userId });
      return result.records.map(record => record.get('other').properties);
    } finally {
      session.close();
    }
  }

  async createConnectionRequest(fromUserId, toUserId, limit) {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          MATCH (from:User {id: $fromUserId})
          MATCH (to:User {id: $toUserId})
          CREATE (from)-[request:CONNECTION_REQUEST {limit: $limit}]->(to)
          RETURN request
        `, { fromUserId, toUserId, limit });
      return result.records[0].get('request').properties;
    } finally {
      session.close();
    }
  }

  async getReceivedConnectionRequests(userId) {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})<-[request:CONNECTION_REQUEST]-(other:User)
          RETURN request.limit AS limit, other AS from
        `, { userId });
      return result.records.map(record => ({
        limit: record.get('limit'),
        from: record.get('from').properties,
      }));
    } finally {
      session.close();
    }
  }

  async getSentConnectionRequests(userId) {
    const session = this.driver.session();
    try {
      const result = await session
        .run(`
          MATCH (user:User {id: $userId})-[request:CONNECTION_REQUEST]->(other:User)
          RETURN request.limit AS limit, other AS to
        `, { userId });
      return result.records.map(record => ({
        limit: record.get('limit'),
        to: record.get('to').properties,
      }));
    } finally {
      session.close();
    }
  }

  async getUserConnections(userId) {
    const session = this.driver.session();
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

module.exports = new CreditNetworkGraph();
