const db = require('./client');
const { createUser } = require('./users');

const users = [
  {
    first_name: 'Emily',
    last_name: 'Jonhson',
    email: 'emily@example.com',
    password: 'securepass',
  },
  {
    first_name: 'Lui',
    last_name: 'Wei',
    email: 'liu@example.com',
    password: 'strongpass',
  },
  {
    first_name: 'Isabella',
    last_name: 'Garcia',
    email: 'bella@example.com',
    password: 'pass1234',
  },
 
  // Add more user objects as needed
];  

const dropTables = async () => {
    try {
        await db.query(`
        DROP TABLE IF EXISTS order_product;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        `);
    }
    catch(err) {
        throw err;
    }
}

const createTables = async () => {
  console.log('Dropping all tables...');
    try{
        await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY UNIQUE NOT NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL NOT NULL,
        image_url TEXT
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_Date TIMESTAMP,
        order_status VARCHAR(255) NOT NULL,
        total DECIMAL NOT NULL
      );

      CREATE TABLE order_product (
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL
      );
      `);
    } 
    catch(err) {
        throw err;
    }
}


const insertUsers = async () => {
  try {
    for (const user of users) {
      await createUser({name: user.name, email: user.email, password: user.password});
    }
    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
};

const seedDatabse = async () => {
    try {
        db.connect();
        await dropTables();
        await createTables();
        await insertUsers();
    }
    catch (err) {
        throw err;
    }
    finally {
        db.end()
    }
}

seedDatabse()