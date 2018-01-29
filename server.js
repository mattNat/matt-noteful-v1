'use strict';

const express = require('express');

const data = require('./db/notes');

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const app = express();
app.use(express.static('public'));

app.get('/v1/notes/:id', (req, res) => {
  console.log((Number(req.params.id)));
  const input = Number(req.params.id);
  const findID = data.find(item => item.id === input);
  console.log(findID);
  res.json(data);
});

app.get('/v1/notes', (req, res) => {
  // console.log(req.query);
  const {searchTerm} = req.query;
  // console.log(searchTerm);
  // console.log(data[0].title);
  
  data.forEach(item => console.log(item.title.length));
  const result = searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data;
  
  console.log(result);
  

  res.json(result);
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});