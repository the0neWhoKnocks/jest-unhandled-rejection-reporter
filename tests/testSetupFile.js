// Setup code goes here

// This line should remain at bottom of file
process.on('unhandledRejection', require('../reporter').rejectionHandler);
