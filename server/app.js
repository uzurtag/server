const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('../schema/schema');
const cors = require('cors');

const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://uzurtag:89268238@cluster0.brdqp.mongodb.net/node?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "node" });

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.listen(PORT, err => {
    err ? console.log(error) : console.log('Server started!');
})