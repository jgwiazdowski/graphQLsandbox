const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema')

const app = express();


app.use('/graphql', expressGraphQL({
    graphiql: true,
    schema
}));
 
const port = 4000 || process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on ${port} port `)
})