# TwitterIntents [![npm version](https://badge.fury.io/js/%40brandwatch%2Ftwitter-intents.svg)](https://badge.fury.io/js/%40brandwatch%2Ftwitter-intents)

A replacement for the Twitter Intents [library](https://dev.twitter.com/docs/intents) for those that don't need
widget creation or event support. This will open all Twitter intent urls
in a popup window, that's it.

* Works in all modern browsers and IE8.
* Works with AMD loaders.
* Not dependant on external dependancies (Twitter.com).

## Usage

Include the script in your webpage:

```html
<script src="js/twitter-intents.js"></script>
```

Then create a new instance and call the register method to start listening for clicks:

```js
var intents = new TwitterIntents().register();
````

Add twitter intent links to your page, these will be opened in a popup window:

```html
<a href="https://twitter.com/intent/tweet">Tweet about us!</a>
```

If you need to remove the events the `unregister` method will do this:

```js
intents.unregister();
```

## Dependencies

This script has no external dependancies.

## Development

It's very simple, hack on the code, ensure the lint and tests pass and submit
a pull request. Rinse and repeat.

To install the developer packages you'll need node and npm installed on your
machine. Then run:

```sh
$ npm install
```

To run the linter:

```sh
$ npm run-script lint
```

## Production

To produce a concatenated build run:

```sh
$ npm run-script build
```

This will produce a minified version of the script for production use.

## Testing

The entire test suite is run on Travis CI on each push you can check the current
state at any time by visiting: https://travis-ci.org/BrandwatchLtd/twitter-intents

To run the suite locally using phantomjs[1] run:

```sh
$ npm test
```

Alternatively tests can be run in the browser:

```sh
$ npm start
```

And open the browser at http://localhost:8080/test/index.html.

Finally there are integration tests that can be run manually by running the
server and visiting the integration page: http://localhost:8080/test/integration.html.

### Writing specs

These should be placed in the test directory and the filename should
be the module name ending with `-test.js`.

### Libraries

- [Mocha](http://mochajs.org/): Test runner, we use the `bdd` style.
- [Sinon](http://sinonjs.org/docs): Mocking and stubbing library.

## Releases

Releases can be created by using the `./version` script, which will

* Update `package.json` with the new version string
* Update `bower.json` with the new version string
* Commit the changes
* Create a new tag with that version

Example:

```bash
./version 1.2.3
```

## License

Available under the MIT license. See LICENSE file for details.
