// This is a simple chat API:
//
// - All users can see all messages.
// - Registered users can post messages.
// - Administrators can delete messages.
//
// The challenge is to delete any message without admin password.
//
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();

///////////////////////////////////////////////////////////////////////////////
// In order of simplicity we are not using any database. But you can write the
// same logic using MongoDB.
const users = [
  // You know password for the user.
  {name: 'user', password: 'pwd'},
  // You don't know password for the admin.
  {name: 'admin', password: Math.random().toString(32), canDelete: true},
];

let messages = [];
let lastId = 1;

function findUser(auth) {
  return users.find((u) =>
    u.name === auth.name &&
    u.password === auth.password);
}
///////////////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());

// Get all messages (publicly available).
app.get('/', (req, res) => {
  res.send(messages);
});

// Post message (restricted for users only).
app.put('/', (req, res) => {
  const user = findUser(req.body.auth || {});

  if (!user) {
    res.status(403).send({ok: false, error: 'Access denied'});
    return;
  }

  const message = {
    // Default message icon. Cen be overwritten by user.
    icon: '👋',
  };

  _.merge(message, req.body.message, {
    id: lastId++,
    timestamp: Date.now(),
    userName: user.name,
  });

  messages.push(message);
  res.send({ok: true});
});

// Delete message by ID (restricted for users with flag "canDelete" only).
app.delete('/', (req, res) => {
  const user = findUser(req.body.auth || {});

  if (!user || !user.canDelete) {
    res.status(403).send({ok: false, error: 'Access denied'});
    return;
  }

  messages = messages.filter((m) => m.id !== req.body.messageId);
  res.send({ok: true});
});

app.listen(3000);
console.log('Listening on port 3000...');
