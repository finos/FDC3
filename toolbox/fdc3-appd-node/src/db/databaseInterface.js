class DatabaseInterface {
  // Connection Management
  connect() {
    throw new Error("Method 'connect()' must be implemented.");
  }

  disconnect() {
    throw new Error("Method 'disconnect()' must be implemented.");
  }

  checkHealth() {
    throw new Error("Method 'checkHealth()' must be implemented.");
  }

  // Basic CRUD Operations
  create(collection, data) {
    throw new Error("Method 'create()' must be implemented.");
  }

  findById(collection, id) {
    throw new Error("Method 'findById()' must be implemented.");
  }

  updateById(collection, id, updateData) {
    throw new Error("Method 'updateById()' must be implemented.");
  }

  deleteById(collection, id) {
    throw new Error("Method 'deleteById()' must be implemented.");
  }

  // Additional Query Operations
  findOne(collection, query, projection = {}) {
    throw new Error("Method 'findOne()' must be implemented.");
  }

  find(collection, query = {}, projection = {}) {
    throw new Error("Method 'find()' must be implemented.");
  }

  findOneAndUpdate(collection, query, updateData, options = {}) {
    throw new Error("Method 'findOneAndUpdate()' must be implemented.");
  }

  findOneAndDelete(collection, query) {
    throw new Error("Method 'findOneAndDelete()' must be implemented.");
  }

  // Bulk Operations
  insertMany(collection, documents) {
    throw new Error("Method 'insertMany()' must be implemented.");
  }

  updateMany(collection, query, updateData) {
    throw new Error("Method 'updateMany()' must be implemented.");
  }

  deleteMany(collection, query) {
    throw new Error("Method 'deleteMany()' must be implemented.");
  }

  // Aggregation Operations
  aggregate(collection, pipeline) {
    throw new Error("Method 'aggregate()' must be implemented.");
  }

  // Count Operations
  count(collection, query = {}) {
    throw new Error("Method 'count()' must be implemented.");
  }

  // Transaction Support
  startTransaction() {
    throw new Error("Method 'startTransaction()' must be implemented.");
  }

  commitTransaction() {
    throw new Error("Method 'commitTransaction()' must be implemented.");
  }

  abortTransaction() {
    throw new Error("Method 'abortTransaction()' must be implemented.");
  }
}

module.exports = DatabaseInterface;
