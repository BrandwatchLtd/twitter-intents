# How to Contribute

* Make sure you have a GitHub account
* Submit a ticket for your issue, assuming one does not already exist.
* Clearly describe the issue including steps to reproduce when it is a bug.
* Make sure you fill in the earliest version that you know has the issue.
* Fork the repository on GitHub

## Development

To install the developer packages you'll need node and npm installed on your
machine. Then run:

```bash
$ npm install
```

Create a new branch with a relevant name (lowercase and use dashes to seperate words).
Make your changes to the code, writing tests as you go. To run the test suite you
can use the command:

```bash
$ npm test
```

Tests can be found in the tests directory, one per file, see the README for more
information.

All the code must pass linting. To run the linter:

```bash
$ npm run-script lint
```

The rules are included in the jshint.json file in the root of the project.
