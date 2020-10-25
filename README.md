## Animal training journal backend 

The backend built to support the animal training journal.

### Installation

`git clone {}`
`npm install`

### Configuration
Copy `.env.example` to `.env`, replace variables with correct values.

#### running the tests:

Database preparation:

Create both your project database and your test database.

in postgres:
`CREATE DATABASE animal_training_journal;`
`CREATE DATABASE animal_training_journal_test;`

`npm test` to run the entire test suite with jest in watch mode.
