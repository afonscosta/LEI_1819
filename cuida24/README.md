# Django Rest Framework and Vue.js
## Prerequisites

Before getting started you should have the following installed and running:

- [X] npm - [instructions](https://www.npmjs.com/get-npm)
- [X] Vue CLI 3 - [instructions](https://cli.vuejs.org/guide/installation.html)
- [X] Python 3 - [instructions](https://wiki.python.org/moin/BeginnersGuide)
- [X] Pipenv - [instructions](https://pipenv.readthedocs.io/en/latest/install/#installing-pipenv)

## Setup Template

Create database in PostgreSQL
```
$ create database cuida24db;
```

Change `postgres`'s password to 'postgres'.

Setup
```
$ cd cuida24
$ npm install
$ pipenv install --dev && pipenv shell
$ ./init.sh
```

## Running Development Servers

```
$ python manage.py runserver
```

From another tab in the same directory:

```
$ npm run dev
```