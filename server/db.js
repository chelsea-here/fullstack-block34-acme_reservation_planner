//data layer
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/the_acme_reservation_planner");
const {v4} = require('uuid');
const uuidv4 = v4;

const createCustomer = async (customer) => {
  const SQL = `
    INSERT INTO customers(id, name)
    VALUES ($1, $2)
    RETURNING *
  ;`
  const response = await client.query(SQL, [uuidv4(), customer.name]);
  return response.rows[0];
}

const createRestaurant = async (restaurant) => {
  const SQL = `
    INSERT INTO restaurants(id, name)
    VALUES ($1, $2)
    RETURNING *
  ;`
  const response = await client.query(SQL, [uuidv4(), restaurant.name]);
  return response.rows[0];
}

const createReservation = async ({customer_id, restaurant_id, party_count}) => {
  const SQL = `
    INSERT INTO reservations (id, customer_id, restaurant_id, party_count)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `
  const response = await client.query(SQL, [uuidv4(), customer_id, restaurant_id, party_count]);
  return response.rows[0];
}

const fetchCustomers = async () => {
    const SQL = `
        SELECT *
        FROM customers
    `
    const response = await client.query(SQL)
    return response.rows
}

const fetchRestaurants = async () => {
    const SQL = `
        SELECT *
        FROM restaurants
    `
    const response = await client.query(SQL)
    return response.rows
}

const fetchReservations = async () => {
    const SQL = `
        SELECT *
        FROM reservations
    `
    const response = await client.query(SQL)
    return response.rows
}

const destroyReservation = async (id) => {
  const SQL = `
    DELETE FROM reservations
    WHERE id = $1
    `
    await client.query(SQL, [id])
}

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
  
  const [moe, lucy, larry, ethyl, parisEats, londonEats, nycEats] = await Promise.all([
        createCustomer({ name: 'moe'}),
        createCustomer({ name: 'lucy'}),
        createCustomer({ name: 'larry'}),
        createCustomer({ name: 'ethyl'}),
        createRestaurant({ name: 'parisEats'}),
        createRestaurant({ name: 'londonEats'}),
        createRestaurant({ name: 'nycEats'}),
    ]);
  
    await Promise.all([
      createReservation({customer_id: lucy.id, restaurant_id: parisEats.id, party_count: 5})
    ])
    console.log('seeded data')
};  

module.exports = {
  client, 
  seed,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
};