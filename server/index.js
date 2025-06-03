//express app and setup funcitons
const express = require("express");
const app = express();
const { client, seed } = require('./db');
app.use(express.json());



const init = async () => {
 
    console.log("connecting to database")
    await client.connect();
    console.log("connected to database")
    await seed();
    /* const SQL = ``
    await client.query(SQL)
    console.log("seeded db"); 
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`)
    }) */
    
} 

init();