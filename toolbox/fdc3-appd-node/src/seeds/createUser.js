const dbOrchestrator = require("../db/DatabaseOrchestrator");
const User = require("../models/user");

const DEFAULT_USERS = [
  {
    name: "Vishal Gautam",
    email: "vishal.gautam@gmail.com",
    password: "Test@1234",
    age: 26,
    isAdmin: true,
    status: "active",
    role: "admin",
  },
  {
    name: "Kushagra Asthana",
    email: "kushagra.asthana@gmail.com",
    password: "Test@123",
    age: 25,
    status: "active",
    role: "admin",
  },
  {
    name: "Yousuf Ejaz Ahmad",
    email: "yousuf.ejaz.ahmad@gmail.com",
    password: "Test@456",
    age: 30,
    status: "active",
    role: "admin",
  },
];

const createInitialUser = async () => {
  try {
    const results = await Promise.all(
      DEFAULT_USERS.map(async (userData) => {
        // Check if user already exists
        const existingUser = await dbOrchestrator.findOne("User", {
          email: userData.email,
        });

        if (!existingUser) {
          // Create a new User instance to leverage model validations and middleware
          const user = new User(userData);

          // Use the user object's data to create the record via orchestrator
          const savedUser = await dbOrchestrator.create(
            "User",
            user.toObject()
          );
          return `User created: ${savedUser.email}`;
        }
        return `User already exists: ${userData.email}`;
      })
    );

    console.log("Initialization results:", results);
    return results;
  } catch (error) {
    console.error("Initialization error:", error.message);
    throw error;
  }
};

// This function is used when running the seed script directly
const runSeed = async () => {
  console.log("Starting initialization process...");
  try {
    // Connect to database using orchestrator
    await dbOrchestrator.connect();
    console.log("Connected to database");

    await createInitialUser();
    console.log("Initialization completed successfully");

    // Disconnect from database
    await dbOrchestrator.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize:", error.message);
    process.exit(1);
  }
};

// Only run if file is executed directly
if (require.main === module) {
  runSeed();
}

module.exports = { createInitialUser, DEFAULT_USERS };
