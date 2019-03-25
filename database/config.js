const dotenv = require('dotenv');

dotenv['config']();

const { NODE_ENV } = process.env;
const {
    [`${NODE_ENV}_DB_NAME`]: database,
    [`${NODE_ENV}_DB_USERNAME`]: username,
    [`${NODE_ENV}_DB_PASSWORD`]: password,
    [`${NODE_ENV}_DB_RDBMS`]: dialect,
    [`${NODE_ENV}_DB_HOSTNAME`]: host,
    [`${NODE_ENV}_DB_MIGRATIONS_TABLE`]: migrationStorageTableName,
} = process.env;

module.exports = { database, username, password, host, migrationStorageTableName, dialect };