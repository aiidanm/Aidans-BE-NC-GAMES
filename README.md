# Northcoders House of Games API

## Project Summary
- This project provides an api endpoint for a board game review forum. This contains categorys of the board games being reviews, users on the forum and comments on each review. 

- A list of endpoints can be accessed through /api


## Files needed for this repo

- In order to connect to this database correctly, after cloning, two files will need to be created, and the database name will need to be set in each of these

> .env.development
>
> > PGDATABASE=nc_games

> .env.test
>
> > PGDATABASE=nc_games_test

## Hosted API
 - A online hosted version of this database can be found at the below link
  >> https://aidan-nc-games.onrender.com/api

## How to run this repo

1. Git clone the repo onto your local machine
2. Once the repo is open in your environment of choice, run npm install in the terminal to install all dependencies
3. To seed the data into the database, now run `npm run-seed`
4. If you wish to run tests, the seeding is done automatically.
5. To run the tests use the command `npm test`

### Consideration
- please make sure that Node.js is at least version `6.9.0`
- Please make sure that Postgres is at least version `8.8.0`