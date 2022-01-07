## About

This repo is web app for *foreign-exchange* project that
aims to add monetization functionality to the project web-service.

#### Note before you go further 

Initially it was my pet-project. The goal was to implement essential
features. There was no task to actually implement payments, so the
app does not have shopping card, nor does it integrate payment
processors. There are orders though as it should be, but they are
just created directly.

## What is *foreign-exchange* project?

(not public)

*foreign-exchange* is group of apps to provide data about
exchange rates in different banks. It represents an **aggregator**
and allows you to get rates for both current time and the past
(actual and archive data).

Basically, it consists of:
1) database;
2) grabber app - server app that requests data from banks and saves
   it to the database;
3) web-service - brings database data to clients. Implements all the
   business logic: retrieves and aggregates the data, and provides
   results through HTTP API.

The grabber collects current exchange rates. The grabber doesn't
delete the data; it accumulates all rates that it gets, constantly
increasing the database.

You (as a client) can make use of web-service if you wanna:
1) find the most profitable offer on market for now;
2) get unified interface for bank APIs for getting rates
   (furthermore, some of them doesn't provide any);
3) get data for analysis or rates prediction of specific
   institution.

That said, clients communicate with the web-service,
and the web-service represents an aggregator for them.

## The problem

The problem is, there is no implementation of how to make money
if the web-service will be deployed as public service. All data
will be provided free of charge to anyone who can reach the
web-service.

Of course the project should be profitable. That is, the project
needs to be monetized and implement an appropriate software
to do so.

## The goal of this repo

The following model has been chosen to implement to make the
project generating an income. The web-service API should be
restricted and provided only for those who has bought the
access.

The goal of this repo is to develop an independent system that
would implement all monetization functionality and provide the
way for the web-service to understand if the incoming request
is allowed.

Examples of such functionality are buying access (performs by
clients), monitoring balance, admin part: setting up services
and prices etc.

To integrate the system (i.e. monetize the project) there has
to be added one feature to the web-service: get info from
the system about if the incoming request is allowed and proceed
or deny the request. Alternatively, this functionality could
be implemented as independent middleware app and put in front
of it.

In other words, the goal is to develop separate pluggable
monetization system for the web-service. Integration though
should be done separately later.

## Monetization model

Subscription model. There are some key points settled about the
model and how it should be applied to the *foreign-exchange*
project.

The subscription defines:
- number of requests to the web-service;
- time frame length during which client is allowed to execute this
  number of requests.

Client that didn't buy specific subscription cannot get the data.

By purchasing a subscription the client is given permission to
execute number of request during the time frame. As soon as client
executes all the requests or time gets frame end the access for
him becomes denied until he's bought the subscription again.

There can exist many subscriptions; they differ in price and
amount of such services. Client can have only one subscription
at a time.

## What does the app implement?

The app implements:
- user accounts;
- subscriptions, its management and buying;
- system to track requests usage;
- access keys management (see [Access keys](#access-keys)).

As for end users, the main idea of the app is to provide a
toolset to manage personal access to use the web-service.
Because of that, there are no public functions; all of them
are related to client identity (user account). The
functionality are built around user account and provided
only after logging in.

It is supposed that there are 2 categories of app users:
- clients;
- administrators.

The app implements 2 account roles respectively:
- user;
- admin.

User account allows:
- view available subscriptions;
- buy subscription;
- view current subscription and requests balance;
- view orders history.

Admin account allows:
- manage users (view, create, update, delete);
- manage subscriptions (view, create, archive);
- change users current subscriptions.

Accounts of both roles allow:
- manage access key of the account (view, create, delete);
- edit profile.

There is how the app is supposed to be used by clients. Client
creates an account, selects and buys a subscription, creates
an access key and then can use the API. Using the account he
can track how much services he spent. If the subscription expires
or client consumes all provided services, he buys a new
subscription and then can use the API again.

Admins, for their part, get admin panel to manage services and
its usage.

The result that app provides for other project apps is
its database. Using the database it is possible to find user
account by access key, get its current subscription (if there
is one) and requests balance. Thus, it becomes possible to
implement access restriction for the web-service (see
[Access keys](#access-keys)).

## Access keys
 
To restrict web-service API it was chosen to implement the
following model. Each API resource that has to be protected should
require a key.

Just like this:

![Google Maps resource requires API key to be specified in query string](/../assets/root/api_key.png)

The key is just a token representing an account; it is used to
avoid specifying and transferring credentials in order to prevent
its revealing.

That said, the key should belong to user account and be provided
to its owner. When making a request client will have to specify his
account key to get the data.

Web-service, in turn, should be given access to accounts database.
When new request is here it will be able to identify user account
by access key, get its requests balance and based on this proceed
or deny the request.

## Integration

It is supposed that app will be integrated through the database:
app database should be combined with project database into one.
Just like this:

<p align="center">
  <img
    alt="Integration fig. 1"
    src="/../assets/root/integration_1.png"
  >
</p>

There is how the project will look like after integration:

<p align="center">
  <img
    alt="Integration fig. 2"
    src="/../assets/root/integration_2.png"
  >
</p>

## Tech stack

#### Backend:

* PostgreSQL
* Redis
* Node.js
* Express
* joi
* Sequelize

#### Frontend:

* React
* React Context
* Material UI 
* SCSS
* CSS modules
* Formik
* Yup

## Prerequisites

To run the app you have to have installed:

1. PostgreSQL 11.4
1. Redis 6.2
1. Node.js v12.16

The app does not use Redis conception of logical databases, so it
is always the database 0. If you already use Redis and have any data
stored in it, please see [Redis structure](./backend/README.md#redis-structure)
to understand what prefixes for keys the app uses and what keys will
be added.

## Installing

1. Install dependencies:

```
npm i

cd ./backend
npm i

cd ../frontend
npm i

cd ../
```

2. Create a database and user to access it:

```
sudo -u postgres psql

CREATE USER fe_admin PASSWORD 'fe_admin';
GRANT fe_admin TO postgres;
CREATE DATABASE fe_db WITH OWNER fe_admin;

\q
```

3. Load citext extension for the database:

```
sudo -u postgres psql fe_db

CREATE EXTENSION IF NOT EXISTS citext;

\q
```

4. Navigate to the root of backend project:

```
cd ./backend
```

5. Configure the backend: create .env file and change values of
   variables if needed.

```
cp .env.example .env
```

6. Configure migration tool: create .env file and change values
   of variables if needed.

```
cp ./bin/migrator/.env.example ./bin/migrator/.env
```

7. Run migrations:

```
npm run migrate -- up
```

8. Build HTTP API docs of backend:

```
npm run docs -- build
```

## Starting

To make it organized, easier to monitor logs and manage, use
terminal tabs for steps 2-4; run each step in separate tab.

1. Make sure PostgreSQL server is running.
1. Start Redis server with default config **and** `requirepass`
   **option**.
 
   The app requires Redis to be run having authentication so that
   clients have to authenticate the connection before using the
   store.

3. Start backend:

```
# from project root

cd ./backend
npm run start
```

4. Start frontend dev server:

```
# from project root

cd ./frontend
npm run start
```

5. View the app in the browser at http://localhost:3001/.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Business logic details

(TODO)

## TODOs

- [ ] ***backend***: HTTP API docs:

What has been done so far is the complete solution (toolset) to
describe and build the docs.  
Keynotes:
- write docs in Open API 2.0;
- build static web-page from specs.

The build tool internally uses templates and supports its changing.
You can set up custom template for web-page instead of the default
one and so easily change the look of API docs in the future.

In other words, I have decided on how to make the docs and set
up all the tools to do so. Now it's time to actually write the
docs :)

P.S.: a base dir structure for spec files has already been defined
too.

- [ ] (!) ***backend***: add transactions (haven't been used for
  simplicity reasons);
- [ ] ***backend***: currently, if data of the incoming request are
  invalidated at the api level (api contract; performed by
  express-joi-validation), backend responses with plain text, whereas
  if the data are invalidated at the domain level, it sends a json
  object ({ message: '...' }) as it does for all 'message' responses
  in the project. Fix it (unify the interface).  
  \+ the messages look different (see the source code of
  express-joi-validation; it adds this text in front of the main message
  that says which part of the request didn't pass the validation - body,
  query etc. For example: 'Error validating request body. ...'. Messages
  from domain level, in contrast, do not have such a supplement
  (basically it's OK, but maybe it should be changed).
- [ ] ***backend***: api level validator of 'where' param of list
  operations is quite simple so far; if user configures this param
  incorrectly while passing the validation, Sequelize will throw an
  error. This error is not caught in operations and therefore will be
  propagated upwards to the global error handler. It, in turn, will
  return a 'Server Error' message. It's necessary to make it clear
  for the user that the problem is about param configuration.  
  (improve the validator IF possible).
- [ ] (!) ***backend***: currently, admin is allowed to create grant
  for himself. He must be forbidden (see frontend).
- [ ] ***frontend***: stylelint: correct styles to make it passed;
- [ ] ***frontend***: run stylelint on pre-push;
- [ ] (?) ***frontend***: add support of configuring env (DEV_SERVER_PORT
  and PROXY_TO_PORT);
- [ ] ***frontend***: add modal windows (confirmation) for:
  - delete user & my account;
  - archive subscription;
  - buy subscription.
- [ ] split backend in 2 apps: redis cleaner app and regular management
  backend. This becomes the necessary step in order to make the app
  scalable. Redis cleaner app, as long as it provides storage cleaning
  service, should always be presented with only 1 instance. Management
  backend, in contrast, serve user requests, so there should be an
  ability to run multiple instances to handle different workloads.
- [ ] containerize (docker);
- [ ] add security features:
  - add email confirmation on signup (to make sure the email is real
    and belongs to the user);
  - when user updates password delete all his sessions and recreate the
    current one;
  - allow updating password only along with providing the old (current)
    one;
  - secure 'delete my account' operation. Currently, if there is
    a cookie forgery an attacker can delete the account in 1 click. This
    can be solved by requiring the password to perform the operation
    (all suggestions are welcome).
  - when admin creates new user: autogenerate password for him and send
    email with confirmation and generated password.
- [ ] audit dependencies (root, frontend, backend);
- [ ] complete this readme;
- [ ] write the doc on setting up the app for prod (nginx, redis,
  collecting app logs) (or at least notes);

## So what has been done?

* analyzed requirements;
* decided on monetization model;
* defined functionality;
* defined domain model;
* defined how to integrate the app;
* decided on the tech stack;
* designed the UI;
* designed the db;
* designed HTTP API;
* designed architecture (backend);
* created backend setup (env & tools), from scratch;
* created backend skeleton;
* created frontend config (webpack, eslint etc), from scratch;
* created frontend skeleton;
* implemented the backend;
* implemented the frontend.

The toolset as well as design solutions (if you ask why the things
have been designed in such a manner) have been selected intentionally
and consciously. The idea behind was to use tools that are best
for the particular case; no more, no less, and with performance in
priority.

The tool shouldn't be used just because it is popular, i.e. so often
used in projects - it could turn out to be useless or bring
unnecessary complexity. Neither it should be used if it affects
performance or breaks the established design rules while being of
little benefit.

That's why, for example, frontend has Sass instead of css-in-js
solutions (but it's probably the topic for the whole article) or
doesn't have Redux, or there is no wide use of lodash (native methods
are more efficient; if it's possible to use them, it's better use
them).

Since we are talking about the frontend, there are still things
that can be improved. First features wanted are preventing
multiple rerender while using hooks (merging atomic useState()) and
adding schemas for backend responses to services/api to validate
them and cast the values.

## Screenshots

!['login' page](/../assets/root/screenshots/login.png)

!['signup' page](/../assets/root/screenshots/signup.png)

#### User account:

System date & time on screenshots: May 28, 2021 11:35 PM.

!['Available subscriptions' page](/../assets/root/screenshots/user/offers.png)

!['My account' page; all data blocks are presented](/../assets/root/screenshots/user/bret.cummings.png)

If user does not have subscription:

!['My account' page; 'current subscription services usage' data block is missing](/../assets/root/screenshots/user/hyman.beatty.png)

#### Admin account:

System date & time on screenshots: May 28, 2021 11:49 PM.

!['Subscriptions' page](/../assets/root/screenshots/admin/subscriptions.png)

![Subscription page](/../assets/root/screenshots/admin/subscription_sub_month_max.png)

!['Create subscription' page](/../assets/root/screenshots/admin/new_subscription.png)

![Date & time picker](/../assets/root/screenshots/admin/date_time_picker.png)

!['Users' page](/../assets/root/screenshots/admin/users.png)

![User page; all controls & data blocks are presented](/../assets/root/screenshots/admin/bret.cummings.png)

![User page; 'current subscription services usage' data block is missing](/../assets/root/screenshots/admin/hyman.beatty.png)

!['Create user' page](/../assets/root/screenshots/admin/new_user.png)
