const mongoose = require("mongoose");
const DatabaseInterface = require("../../db/databaseInterface");

class MongoDatabase extends DatabaseInterface {
  constructor(uri) {
    super();
    this.uri = uri;
    this.connection = mongoose.connection;
    this.session = null;
  }

  async connect() {
    await mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async checkHealth() {
    return this.connection.readyState === 1;
  }

  async create(collection, data) {
    const Model = mongoose.model(collection);
    const document = new Model(data);
    return await document.save({ session: this.session });
  }

  async findById(collection, id) {
    const Model = mongoose.model(collection);
    return await Model.findById(id).session(this.session);
  }

  async updateById(collection, id, updateData) {
    const Model = mongoose.model(collection);
    return await Model.findByIdAndUpdate(id, updateData, {
      new: true,
      session: this.session,
    });
  }

  async deleteById(collection, id) {
    const Model = mongoose.model(collection);
    return await Model.findByIdAndDelete(id, { session: this.session });
  }

  async findOne(collection, query, projection = {}) {
    const Model = mongoose.model(collection);
    return await Model.findOne(query, projection).session(this.session);
  }

  async find(collection, query = {}, projection = {}) {
    const Model = mongoose.model(collection);
    return await Model.find(query, projection).session(this.session);
  }

  async findOneAndUpdate(collection, query, updateData, options = {}) {
    const Model = mongoose.model(collection);
    return await Model.findOneAndUpdate(query, updateData, {
      ...options,
      session: this.session,
    });
  }

  async findOneAndDelete(collection, query) {
    const Model = mongoose.model(collection);
    return await Model.findOneAndDelete(query, { session: this.session });
  }

  async insertMany(collection, documents) {
    const Model = mongoose.model(collection);
    return await Model.insertMany(documents, { session: this.session });
  }

  async updateMany(collection, query, updateData) {
    const Model = mongoose.model(collection);
    return await Model.updateMany(query, updateData, { session: this.session });
  }

  async deleteMany(collection, query) {
    const Model = mongoose.model(collection);
    return await Model.deleteMany(query, { session: this.session });
  }

  async aggregate(collection, pipeline) {
    const Model = mongoose.model(collection);
    return await Model.aggregate(pipeline).session(this.session);
  }

  async count(collection, query = {}) {
    const Model = mongoose.model(collection);
    return await Model.countDocuments(query).session(this.session);
  }

  async startTransaction() {
    this.session = await mongoose.startSession();
    await this.session.startTransaction();
    return this.session;
  }

  async commitTransaction() {
    if (this.session) {
      await this.session.commitTransaction();
      await this.session.endSession();
      this.session = null;
    }
  }

  async abortTransaction() {
    if (this.session) {
      await this.session.abortTransaction();
      await this.session.endSession();
      this.session = null;
    }
  }
}

module.exports = MongoDatabase;
