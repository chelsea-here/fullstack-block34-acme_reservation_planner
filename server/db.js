//data layer
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/the_acme_reservation_planner");
const {v4} = require('uuid');
const uuidv4 = v4;

/* const createCustomer = async (customer) => {
  const SQL = `
  DROP IF EXISTS ;
  CREATE TABLE table (
  )
  `

} */

const seed = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;

    CREATE TABLE customers(
      id UUID PRIMARY KEY,
      name VARCHAR(100)
      );

    CREATE TABLE restaurants(
      id UUID PRIMARY KEY,
      name VARCHAR(100)
      );

    CREATE TABLE reservations(
      id UUID PRIMARY KEY,
      date TIMESTAMP DEFAULT now(),
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
      customer_id UUID REFERENCES customers(id) NOT NULL
    );
    `
  await client.query(SQL);
  console.log('created tables');


}

module.exports = {
  client, 
  seed
};