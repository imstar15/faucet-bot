const DatabaseStorage = require('./DatabaseStorge');
const LocalStorage = require('./LocalStorage');

const StorageType = {
	LOCAL: 'LOCAL',
	DATABASE: 'DATABASE',
};

const storage = process.env.STORAGE_TYPE === StorageType.DATABASE ? new DatabaseStorage() : new LocalStorage();

module.exports = storage;
