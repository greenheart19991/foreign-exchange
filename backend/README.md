## Architecture
 
Fig. 1:

<p align="center">
  <img
    alt="Architecture fig. 1"
    src="/../assets/backend/architecture_1.png"
  >
</p>
  
Fig. 2:

<p align="center">
  <img
    alt="Architecture fig. 2"
    src="/../assets/backend/architecture_2.png"
  >
</p>

## Redis structure

<p align="center">
  <img
    alt="Redis structure"
    src="/../assets/backend/redis.png"
  >
</p>

## The HTTP API

* highly inspired by some REST principles;
* uses server-side sessions as authentication method (stateful
  approach).

## Sessions & security

To prolong the session the project implements refreshing mechanism
(as it's done for token-based auth) instead of extending the
expiration date of the existing one.

If the session id gets stolen, the attacker has a little time (until
the next refresh, up to 15 minutes) to do all the damaging actions.
If attacker refreshes the session, the old session id will not be
valid anymore, so user - i.e. account owner - could not perform the
refresh and will be asked to log in. In other words, the attacker is
able to continue using the account, but the user will understand that
something is wrong here. When logging in / logging out previous user
sessions are not deleted (so user can log in from different devices),
so to prevent an attacker from accessing the account forever it is
assumed that account will soon get functionality to manage sessions
(view my sessions + revoke one).

## HTTP API docs

After building, the HTTP API docs web-page can be found under
./docs/dist dir. To view the docs open index.html file in the browser
(as local file).

## Commands

Usage: `npm run <command>`

Commands:

```
start     - start in dev mode (start with source code files watchers and prettifying output)
serve     - start in prod mode
lint      - run linting
migrate   - entrypoint for migration tool
docs      - entrypoint for the tool for documentation
```

### Migration tool

Usage: `npm run migrate -- <command>`

Commands:

```
up       - run migrations up
down     - revert migrations
create   - generate new migration file
```

#### Command `up`

Usage: `npm run migrate -- up [options]`

Run migrations up.  
If `-t` option is not specified, all migrations will be rolled up.

Options:

```
  -t, --to <migration_id>   - run migrations up from first to <migration_id> (inclusive)
```

#### Command `down`

Usage: `npm run migrate -- down [options]`

Revert migrations.  
If `-t` option is not specified, the last migration will be reverted.

Options:

```
  -t, --to <migration_id>   - revert migrations from last to <migration_id> (inclusive)
```

#### Command `create`

Usage: `npm run migrate -- create <migration_name>`

Generate new migration file.  

### The tool for documentation

Usage: `npm run docs -- <command>`

Commands:

```
build   - build docs web-page (from specs)
dev     - start dev mode: start the watcher that automatically rebuilds docs web-page on any specs change
```
