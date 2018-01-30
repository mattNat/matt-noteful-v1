'use strict';

const express = require('express');
const morgan = require('morgan');

const data = require('./db/notes');

const {
  PORT
} = require('./config');

const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


// INSERT EXPRESS APP CODE HERE...
const app = express();
app.use(morgan('common'));

// app.get('*', (req, res) => res.send('ok'))

app.use(express.static('public'));
app.use(express.json());

// // find by ID
// app.get('/v1/notes/:id', (req, res) => {
//   console.log((Number(req.params.id)));
//   const input = Number(req.params.id);
//   const findID = data.find(item => item.id === input);
//   console.log(findID);
//   res.json(data);
// });

// // find by searchTerm
// app.get('/v1/notes', (req, res) => {
//   // console.log(req.query);
//   const {
//     searchTerm
//   } = req.query;
//   // console.log(searchTerm);
//   // console.log(data[0].title);

//   data.forEach(item => console.log(item.title.length));
//   const result = searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data;

//   console.log(result);

//   res.json(result);
// });

// // Test error handler
// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom to the broom!!');
// });

// search term filter
app.get('/v1/notes', (req, res, next) => {
  const {
    searchTerm
  } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    app.use(express.json());
    res.json(list);
  });
});

// find by id
app.get('/v1/notes/:id', (req, res, next) => {
  // change 1000
  // console.log(req.params.id);
  
  notes.find(req.params.id, (err, item) => {
    if (err) {
      console.error(err);
    }
    if (item) {
      // console.log(item);
      res.json(item);
    } else {
      console.log('not found');
    }
  });
});

// PUT endpoint
app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

// Express error-handling middleware
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({
    message: 'Not Found'
  });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});