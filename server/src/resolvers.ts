import { Pool } from 'pg';
import dotenv from 'dotenv';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

const TABLE = "who";

interface PeopleByNameStartArgs {
  letter: string;
  limit: number;
};

interface AddPersonArgs {
  name: string;
  age: number;
};

interface UpdatePersonArgs {
  id: number;
  name: string;
  age: number;
};

const resolvers = {
  Query: {
    oldestPeople: async (_: any, { limit }: { limit: number }) => {
      const { rows } = await pool.query(`SELECT * FROM ${TABLE} ORDER BY age DESC LIMIT $1`, [limit]);
      return rows;
    },
    youngestPeople: async (_: any, { limit }: { limit: number }) => {
      const { rows } = await pool.query(`SELECT * FROM ${TABLE} ORDER BY age ASC LIMIT $1`, [limit]);
      return rows;
    },
    peopleByNameStart: async (_: any, { letter, limit }: PeopleByNameStartArgs) => {
      const { rows } = await pool.query(`SELECT * FROM ${TABLE} WHERE name LIKE $1 ORDER BY name ASC LIMIT $2`, [`${letter}%`, limit]);
      return rows;
    },
  },
  Mutation: {
    addPerson: async (_: any, { name, age }: AddPersonArgs) => {
      const { rows } = await pool.query(`INSERT INTO ${TABLE}(name, age) VALUES($1, $2) RETURNING *`, [name, age]);
      return rows[0];
    },
    updatePerson: async (_: any, { id, name, age }: UpdatePersonArgs) => {
      const { rows } = await pool.query(`UPDATE ${TABLE} SET name = $1, age = $2 WHERE id = $3 RETURNING *`, [name, age, id]);
      return rows[0];
    },
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator(['PERSON_ADDED']),
    },
  },
};

export { resolvers };
