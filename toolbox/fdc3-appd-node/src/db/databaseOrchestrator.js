const environment = require("../config/environment");
const MongoDatabase = require("../database/mongo/mongoDatabase");
// const PostgresDatabase = require("./postgres/PostgresDatabase"); // Future implementation
// const OracleDatabase = require("./oracle/OracleDatabase"); // Future implementation

class DatabaseOrchestrator {
  constructor() {
    this.dbInstance = null;
  }

  initialize() {
    const dbType = environment.DB_TYPE;

    switch (dbType) {
      case "mongo":
        this.dbInstance = new MongoDatabase(environment.getDatabaseUri());
        break;
      // case "postgres":
      //     this.dbInstance = new PostgresDatabase(environment.getDatabaseUri());
      //     break;
      // case "oracle":
      //     this.dbInstance = new OracleDatabase(environment.getDatabaseUri());
      //     break;
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  getInstance() {
    if (!this.dbInstance) {
      this.initialize();
    }
    return this.dbInstance;
  }

  // Connection Management
  async connect() {
    const instance = this.getInstance();
    await instance.connect();
  }

  async disconnect() {
    const instance = this.getInstance();
    await instance.disconnect();
  }

  async checkHealth() {
    const instance = this.getInstance();
    return await instance.checkHealth();
  }

  // Basic CRUD Operations
  async create(collection, data) {
    const instance = this.getInstance();
    return await instance.create(collection, data);
  }

  async findById(collection, id) {
    const instance = this.getInstance();
    return await instance.findById(collection, id);
  }

  async updateById(collection, id, updateData) {
    const instance = this.getInstance();
    return await instance.updateById(collection, id, updateData);
  }

  async deleteById(collection, id) {
    const instance = this.getInstance();
    return await instance.deleteById(collection, id);
  }

  // Additional Query Operations
  async findOne(collection, query, projection = {}) {
    const instance = this.getInstance();
    return await instance.findOne(collection, query, projection);
  }

  async find(collection, query = {}, projection = {}) {
    const instance = this.getInstance();
    return await instance.find(collection, query, projection);
  }

  async findOneAndUpdate(collection, query, updateData, options = {}) {
    const instance = this.getInstance();
    return await instance.findOneAndUpdate(
      collection,
      query,
      updateData,
      options
    );
  }

  async findOneAndDelete(collection, query) {
    const instance = this.getInstance();
    return await instance.findOneAndDelete(collection, query);
  }

  // Bulk Operations
  async insertMany(collection, documents) {
    const instance = this.getInstance();
    return await instance.insertMany(collection, documents);
  }

  async updateMany(collection, query, updateData) {
    const instance = this.getInstance();
    return await instance.updateMany(collection, query, updateData);
  }

  async deleteMany(collection, query) {
    const instance = this.getInstance();
    return await instance.deleteMany(collection, query);
  }

  // Aggregation Operations
  async aggregate(collection, pipeline) {
    const instance = this.getInstance();
    return await instance.aggregate(collection, pipeline);
  }

  // Count Operations
  async count(collection, query = {}) {
    const instance = this.getInstance();
    return await instance.count(collection, query);
  }

  // Transaction Support
  async startTransaction() {
    const instance = this.getInstance();
    return await instance.startTransaction();
  }

  async commitTransaction() {
    const instance = this.getInstance();
    return await instance.commitTransaction();
  }

  async abortTransaction() {
    const instance = this.getInstance();
    return await instance.abortTransaction();
  }
}

module.exports = new DatabaseOrchestrator();
