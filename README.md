# OctoDB - Backend Service

This is a helper module used to implement a backend service for OctoDB

A backend service can contain handlers for user and node authorization, and other management services


## Installation

```bash
# using Yarn
yarn add @octodb/backend-service

# using npm
npm install @octodb/backend-service
```


## Usage

This is the service skeleton:

```js
const app = require('@octodb/backend-service');
const port = 4321

app.on('user_signup', (node, data) => {


})

app.on('user_login', (node, data) => {


})

app.on('new_node', (node) => {


})

app.run(port, function() {
  console.log('auth service ready!')
})
```

More details in the [OctoDB documentation](https://github.com/octodb/docs/blob/master/auth-service.md)


# License

[MIT](./LICENSE)
