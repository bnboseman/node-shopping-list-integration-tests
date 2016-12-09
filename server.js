
const express = require('express');
const morgan = require('morgan');
const enableDestroy = require('server-destroy');

const app = express();

const shoppingListRouter = require('./shoppingListRouter');
const recipesRouter = require('./recipesRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// when requests come into `/shopping-list` or
// `/recipes`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/shopping-list', shoppingListRouter);
app.use('/recipes', recipesRouter);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 3000}`);
});

const gracefulExit = () => {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    enableDestroy(server);
	server.destroy();
    process.exit();
};

process.on('SIGINT',  gracefulExit);
module.exports = server;
