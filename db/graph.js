
const neo4j = require('neo4j-driver').v1;

const url = process.env.GRAPHENEDB_BOLT_URL;
const username = process.env.GRAPHENEDB_BOLT_USER;
const password = process.env.GRAPHENEDB_BOLT_PASSWORD;

class Graph {
  constructor() {
    this.driver = neo4j.driver(url, neo4j.auth.basic(username, password));
  }

  runInSession(fn) {
    const session = this.driver.session();
    try {
      return fn(session);
    } finally {
      session.close();
    }
  }
}

module.exports = new Graph();
