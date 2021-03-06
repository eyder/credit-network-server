
const graph = require('../db/graph');

class UsersRepository {
  constructor() {
    this.graph = graph;
  }


  async create(user) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            CREATE (user:User {id: {id}, name: {name}, email: {email}, picture: {picture}})
            RETURN user
          `, user);
        return result.records[0].get('user').properties;
      },
    );
  }

  async findById(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User {id: $userId})
            RETURN user
          `, { userId });
        return result.records[0].get('user').properties;
      },
    );
  }

  async findAll() {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User)
            RETURN user
          `);
        return result.records.map(record => record.get('user').properties);
      },
    );
  }

  async findUsersNotRelatedTo(userId) {
    return this.graph.runInSession(
      async (session) => {
        const result = await session
          .run(`
            MATCH (user:User {id: $userId})
            MATCH (other:User)
            WHERE NOT other.id = $userId AND NOT (user)--(other)
            RETURN other
          `, { userId });
        return result.records.map(record => record.get('other').properties);
      },
    );
  }
}

module.exports = new UsersRepository();
