// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv')
dotenv.config()

const databaseEnv = {
  local: {
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'],
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    },
    logging: process.env['LOGGING_MIGRATIONS']
  },
  dev: {
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'],
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  prd: {
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'],
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}[process.env['ENV']]

module.exports = databaseEnv
