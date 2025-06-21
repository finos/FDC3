const mongoose = require('mongoose');
const { seedUsers } = require('../seeds/userSeeds');
require('../db/mongoose'); // Your database connection file

const runSeeds = async () => {
    try {
        await seedUsers();
        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error running seeds:', error);
        process.exit(1);
    }
};

runSeeds(); 