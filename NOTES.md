# Challenge

- API
- Integration tests
- Swagger docs

## Controllers

Each endpoint in the application has its own dedicated controller, which handles requests and responses for that specific route. To maintain organization and improve readability, I divided the controllers into separate folders based on their respective routes. For example, controllers for the `findAllContracts` and `findOneContract` endpoints can be found under the `contracts/` folder.

## Middlewares

I added two extra middlewares the application: `errorHandler` and `isAdmin`. The errorHandler middleware handles errors and exceptions that may occur during the processing of a request. The `isAdmin` middleware, on the other hand, checks whether the user making the request is an admin or not, and allows or denies access to specific routes accordingly. This was my quick approach on validation for `admin` endpoints.

## Routes

To improve the organization and structure of the application, I divided the endpoints into two separate route files: `admin-routes` and `user-routes`. I use Express Router to create and manage these routes.

## Services

The services folder contains the main business logic behind each route. The logic has been divided into three separate services: `contractService`, `jobService`, and `profileService`. These services handle the data processing and manipulation required for their endpoints.

## Testing

I'm using `supertest`, `mocha` and `chai` for integration testing.

```bash
# run the seed command before it runs the tests
$ npm run test
```

You need to copy `.env.example` into a new `.env` file

```bash
$ cp .env.example .env
```

## Documentation

I'm using `swagger-autogen` to generate the `openapi` documentation.

```bash
# produces and output file in the root of the project swagger-outpout.json
$ npm run swagger-autogen
```

## The project structure

```
project/
├── src/
│   ├── app.js           # Express app entry point
│   ├── server.js        # Server entry point
│   ├── model.js         # Sequelize models
│   ├── config/          # Configuration files
│   │   ├── auth.js      # Config loader
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # Routes
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions and modules
├── tests/               # Tests
│   ├── integration/
├── node_modules/
├── package.json
├── package-lock.json
├── .nvmrc
├── .eslintrc.js
├── .prettierrc.json
├── .env.example
├── .swagger.js          # Endpoints documentation
├── README.md
└── .gitignore
```
