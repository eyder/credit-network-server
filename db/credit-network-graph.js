
const neo4j = require('neo4j-driver').v1;

const url = process.env.GRAPHENEDB_BOLT_URL;
const username = process.env.GRAPHENEDB_BOLT_USER;
const password = process.env.GRAPHENEDB_BOLT_PASSWORD;

class CreditNetworkGraph {
  constructor() {
    this.driver = neo4j.driver(url, neo4j.auth.basic(username, password));
  }

  createUser(user) {
    const session = this.driver.session();
    return session
      .run(`
        CREATE (user:User {id: {id}, name: {name}, email: {email}, picture: {picture}})
        RETURN user
      `, user)
      .then((result) => {
        session.close();
        return result.records[0].get('user').properties;
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  getUser(userId) {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (user:User {id: $userId})
        RETURN user
      `, { userId })
      .then((result) => {
        session.close();
        return result.records[0].get('user').properties;
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  listUsers() {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (user:User)
        RETURN user
      `)
      .then((result) => {
        session.close();
        return result.records.map(record => record.get('user').properties);
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  listUsersNotRelatedTo(userId) {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (user:User {id: $userId})
        MATCH (other:User)
        WHERE NOT other.id = $userId AND NOT (user)--(other)
        RETURN other
        `, { userId })
      .then((result) => {
        session.close();
        return result.records.map(record => record.get('other').properties);
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  createConnectionRequest(fromUserId, toUserId, limit) {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (from:User {id: $fromUserId})
        MATCH (to:User {id: $toUserId})
        CREATE (from)-[request:CONNECTION_REQUEST {limit: $limit}]->(to)
        RETURN request
      `, { fromUserId, toUserId, limit })
      .then((result) => {
        session.close();
        return result.records[0].get('request').properties;
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  getReceivedConnectionRequests(userId) {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (user:User {id: $userId})<-[request:CONNECTION_REQUEST]-(other:User)
        RETURN request.limit AS limit, other AS from
        `, { userId })
      .then((result) => {
        session.close();
        return result.records.map(record => ({
          limit: record.get('limit'),
          from: record.get('from').properties,
        }));
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  getSentConnectionRequests(userId) {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (user:User {id: $userId})-[request:CONNECTION_REQUEST]->(other:User)
        RETURN request.limit AS limit, other AS to
        `, { userId })
      .then((result) => {
        session.close();
        return result.records.map(record => ({
          limit: record.get('limit'),
          to: record.get('to').properties,
        }));
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }

  getUserConnections(userId) {
    const session = this.driver.session();
    return session
      .run(`
        MATCH (user:User {id: $userId})-[connection:CONNECTION]->(other:User)
        RETURN
          {limit: connection.limit, debt:connection.debt, to:other} AS connections
        `, { userId })
      .then((result) => {
        session.close();
        return result.records.map(record => record.get('connections').properties);
      })
      .catch((error) => {
        session.close();
        throw error;
      });
  }
}

module.exports = new CreditNetworkGraph();
