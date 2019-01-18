
const graphDriver = require('../db/credit-network-graph-driver');

class UsersRepository {
  constructor() {
    this.graphDriver = graphDriver;
  }

  async create(user) {
    const session = this.graphDriver.session();
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

  async findById(userId) {
    const session = this.graphDriver.session();
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

  async findAll() {
    const session = this.graphDriver.session();
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

  async findUsersNotRelatedTo(userId) {
    const session = this.graphDriver.session();
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
}

module.exports = new UsersRepository();
