const express = require('express')
const app = express.Router();
const {
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  destroyReservation,
  fetchReservations
} = require('./db');
app.use(express.json());

app.get('/customers', async (req,res,next) => {
  try{
    res.send(await fetchCustomers());
  } catch (error) {
    next(error)
  }
});

app.get('/restaurants', async (req,res,next) => {
  try{
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error)
  }
})

app.get('/reservations', async (req,res,next) => {
  try{
    res.send(await fetchReservations());
  } catch (error) {
    next(error)
  }
})

app.post('/customers/:customer_id/reservations', async (req,res,next) => {
  try {
    res.status(201).send(await createReservation({customer_id: req.params.customer_id, restaurant_id: req.body.restaurant_id, party_count: req.body.party_count}));
  }catch (error) {
    next(error)
  }
})
//TO DO: test this again

app.delete('/customers/:customer_id/reservations/:id', async (req,res,next) => {
  try {
    await destroyReservation(req.params.customer_id,  req.params.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = app;