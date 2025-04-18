# WTWR (What to Wear?): Back End

This is the backend server project for the [WTWR app](https://github.com/pragmaticLudusian/se_project_react).

All tests run successfully in Postman.

## Features

- Node.js app using Express.js backend framework
- RESTful API
- Database for users and clothing items
- Error handling
- Multi-user support & authorization with JWT tokens
- Some RegEx

## Running the Project

Make sure to create your own `.env` environment variables file in the project's root directory.

You can customize the `SERVER_PORT` and `DB_PORT` this way, but more importantly store your secret key inside it, like so:

```
JWT_SECRET = <secret key>
```

Then run one of these commands:

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
