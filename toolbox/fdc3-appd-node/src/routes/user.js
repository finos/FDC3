const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const dbOrchestrator = require("../db/DatabaseOrchestrator");
const User = require("../models/user");
/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user (Sign up)
 *     tags: [Users]
 *     description: Public endpoint to register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "strongP@ssw0rd123"
 *               role:
 *                 type: string
 *                 enum: [user, admin, editor, desktopAgent]
 *                 default: user
 *                 description: User's role in the system (defaults to 'user')
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 status:
 *                   type: string
 *                   example: "inactive"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create user"
 *                 details:
 *                   type: string
 *                   example: "Please Enter all the fields"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User with this email already exists"
 */
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the fields");
    }

    // Start transaction
    await dbOrchestrator.startTransaction();

    try {
      // Check if user already exists
      const existingUser = await dbOrchestrator.findOne("User", { email });
      if (existingUser) {
        await dbOrchestrator.abortTransaction();
        return res
          .status(409)
          .send({ error: "User with this email already exists" });
      }

      // Create new User instance for validation
      const user = new User({
        name,
        email,
        password,
        role,
      });

      // Save using orchestrator
      const savedUser = await dbOrchestrator.create("User", user.toObject());

      // Commit transaction
      await dbOrchestrator.commitTransaction();

      if (savedUser) {
        res.status(201).send({
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          token: generateToken(savedUser._id),
          role: savedUser.role,
          status: savedUser.status,
        });
      }
    } catch (error) {
      await dbOrchestrator.abortTransaction();
      throw error;
    }
  } catch (error) {
    res.status(400).send({
      error: "Failed to create user",
      details: error.message,
    });
  }
});

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Requires admin role to access. Returns all users with their details (excluding passwords)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       status:
 *                         type: string
 *                         example: "active"
 *                       age:
 *                         type: number
 *                         example: 30
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-15T10:30:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-15T10:30:00Z"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, admin role required"
 *       500:
 *         description: Server error while fetching users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch users"
 *                 details:
 *                   type: string
 *                   example: "Database connection error"
 */
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await dbOrchestrator.find("User", {}, { password: 0 });
    res.status(200).send({
      count: users.length,
      users: users.map((user) => new User(user).toJSON()),
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to fetch users",
      details: error.message,
    });
  }
});

/**
 * @swagger
 * /v1/users/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     description: Retrieve a user's details by their email address (password excluded)
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user to retrieve
 *         example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 status:
 *                   type: string
 *                   example: "active"
 *                 age:
 *                   type: number
 *                   example: 30
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T10:30:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T10:30:00Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error while fetching user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch user"
 *                 details:
 *                   type: string
 *                   example: "Database connection error"
 */
router.get("/users/:email", async (req, res) => {
  try {
    const user = await dbOrchestrator.findOne(
      "User",
      { email: req.params.email },
      { password: 0 }
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      error: "Failed to fetch user",
      details: error.message,
    });
  }
});

/**
 * @swagger
 * /v1/users/{email}:
 *   patch:
 *     summary: Update user by email
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Update user details. Requires admin or editor role. Only specific fields can be updated.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user to update
 *         example: "john.doe@example.com"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Smith"
 *               role:
 *                 type: string
 *                 enum: [user, admin, editor, desktopAgent]
 *                 example: "editor"
 *               age:
 *                 type: number
 *                 example: 35
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                     name:
 *                       type: string
 *                       example: "John Smith"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "editor"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     age:
 *                       type: number
 *                       example: 35
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00Z"
 *       400:
 *         description: Invalid updates or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid updates"
 *                 allowedUpdates:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["name", "role", "age", "status"]
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not an admin or editor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, admin/editor role required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 */
router.patch(
  "/users/:email",
  protect,
  authorize("admin", "editor"),
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "role", "age", "status"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid updates",
        allowedUpdates,
      });
    }

    try {
      // Create update data object with only the fields being updated
      const updateData = {};
      updates.forEach((field) => {
        updateData[field] = req.body[field];
      });

      const user = await dbOrchestrator.findOneAndUpdate(
        "User",
        { email: req.params.email },
        updateData,
        { new: true }
      );

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      // Create User instance for response formatting
      const userResponse = new User(user).toJSON();
      delete userResponse.password;

      res.status(200).send({
        message: "User updated successfully",
        user: userResponse,
      });
    } catch (error) {
      res.status(400).send({
        error: "Failed to update user",
        details: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /v1/users/{email}:
 *   delete:
 *     summary: Delete user by email
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Delete a user by their email address. Requires admin role.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user to delete
 *         example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     age:
 *                       type: number
 *                       example: 30
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, admin role required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error while deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete user"
 *                 details:
 *                   type: string
 *                   example: "Database connection error"
 */
router.delete(
  "/users/:email",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await dbOrchestrator.findOneAndDelete("User", {
        email: req.params.email,
      });

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      res.status(200).send({
        message: "User deleted successfully",
        user: {
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });
    } catch (error) {
      res.status(500).send({
        error: "Failed to delete user",
        details: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /v1/users-approve:
 *   patch:
 *     summary: Approve or reject a user's account
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Approve or reject a user account. Requires admin role. Accepting activates the user, rejecting deletes the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - approval
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to approve/reject
 *                 example: "john.doe@example.com"
 *               approval:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 description: Approval decision
 *                 example: "accepted"
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User approved and activated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     age:
 *                       type: number
 *                       example: 30
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email and approval status are required"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, admin role required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error while processing request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to process request"
 *                 details:
 *                   type: string
 *                   example: "Database transaction failed"
 */
router.patch(
  "/users-approve",
  protect,
  authorize("admin"),
  async (req, res) => {
    const { email, approval } = req.body;

    if (!email || !approval) {
      return res
        .status(400)
        .send({ error: "Email and approval status are required" });
    }

    try {
      // Start transaction
      await dbOrchestrator.startTransaction();

      try {
        const user = await dbOrchestrator.findOne("User", { email });

        if (!user) {
          await dbOrchestrator.abortTransaction();
          return res.status(404).send({ error: "User not found" });
        }

        if (approval === "accepted") {
          const updatedUser = await dbOrchestrator.findOneAndUpdate(
            "User",
            { email },
            { status: "active" },
            { new: true }
          );

          await dbOrchestrator.commitTransaction();
          return res.status(200).send({
            message: "User approved and activated successfully",
            user: new User(updatedUser).toJSON(),
          });
        } else if (approval === "rejected") {
          const deletedUser = await dbOrchestrator.findOneAndDelete("User", {
            email,
          });

          await dbOrchestrator.commitTransaction();
          return res.status(200).send({
            message: "User rejected and deleted successfully",
            user: new User(deletedUser).toJSON(),
          });
        } else {
          await dbOrchestrator.abortTransaction();
          return res.status(400).send({ error: "Invalid approval value" });
        }
      } catch (error) {
        await dbOrchestrator.abortTransaction();
        throw error;
      }
    } catch (error) {
      return res.status(500).send({
        error: "Failed to process request",
        details: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /v1/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     description: Authenticate a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "strongP@ssw0rd123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     age:
 *                       type: number
 *                       example: 30
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00Z"
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email doesn't exist"
 *               oneOf:
 *                 - properties:
 *                     error:
 *                       example: "Email doesn't exist"
 *                 - properties:
 *                     error:
 *                       example: "Invalid password"
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   example: "Database connection error"
 */
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await dbOrchestrator.findOne("User", { email });
    if (!user) {
      return res.status(400).json({ error: "Email doesn't exist" });
    }

    const userInstance = new User(user);
    const isMatch = await bcrypt.compare(password, userInstance.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(userInstance._id);

    res.status(200).json({
      user: userInstance.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Update the bulk delete endpoint (if needed)
router.delete("/users/bulk", protect, authorize("admin"), async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).send({ error: "Invalid email list provided" });
    }

    await dbOrchestrator.startTransaction();

    try {
      const result = await dbOrchestrator.deleteMany("User", {
        email: { $in: emails },
      });

      await dbOrchestrator.commitTransaction();

      res.status(200).send({
        message: "Users deleted successfully",
        count: result.deletedCount,
      });
    } catch (error) {
      await dbOrchestrator.abortTransaction();
      throw error;
    }
  } catch (error) {
    res.status(500).send({
      error: "Failed to delete users",
      details: error.message,
    });
  }
});

/**
 * @swagger
 * /v1/users/id/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: Retrieve a user by their MongoDB document ID. Requires authentication.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the user
 *         example: "60d3b41ef3g2c4d5e6f7a8b9"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d3b41ef3g2c4d5e6f7a8b9"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john.doe@example.com"
 *                 role:
 *                   type: string
 *                   enum: [user, admin, editor, desktopAgent]
 *                   example: "user"
 *                 status:
 *                   type: string
 *                   enum: [active, inactive]
 *                   example: "active"
 *                 age:
 *                   type: number
 *                   example: 30
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T10:30:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T10:30:00Z"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not authorized, no token"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error while fetching user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch user"
 *                 details:
 *                   type: string
 *                   example: "Invalid ObjectId format"
 */
router.get("/users/id/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch user",
      details: error.message,
    });
  }
});

module.exports = router;
