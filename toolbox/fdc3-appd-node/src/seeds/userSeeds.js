const User = require('../models/user');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});

        // Create admin user
        const adminUser = new User({
            name: "Admin User",
            email: "admin@example.com",
            password: await bcrypt.hash("Admin@1234", 8),
            age: 30,
            role: "admin"
        });
        await adminUser.save();

        // Create test users
        const testUsers = [
            {
                name: "Test User 1",
                email: "test1@example.com",
                password: await bcrypt.hash("Test@1234", 8),
                age: 25
            },
            {
                name: "Test User 2",
                email: "test2@example.com",
                password: await bcrypt.hash("Test@1234", 8),
                age: 28
            }
        ];

        await User.insertMany(testUsers);
        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};

// Function to create a single user
const createUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 8);
        const user = new User({
            ...userData,
            password: hashedPassword
        });
        return await user.save();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to validate user data
const validateUserData = (userData) => {
    const errors = [];
    
    if (!userData.name) errors.push('Name is required');
    if (!userData.email) errors.push('Email is required');
    if (!userData.password) errors.push('Password is required');
    
    if (userData.password && userData.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    if (userData.age && (userData.age < 0 || userData.age > 120)) {
        errors.push('Age must be between 0 and 120');
    }

    return errors;
};

module.exports = {
    seedUsers,
    createUser,
    validateUserData
}; 