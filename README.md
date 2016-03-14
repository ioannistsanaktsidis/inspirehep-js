Inspire-Search-Js
=================

[![Build Status](https://img.shields.io/travis/inspirehep/inspirehep-search-js.svg)](https://travis-ci.org/inspirehep/inspirehep-search-js)
[![Coverage](https://img.shields.io/coveralls/inspirehep/inspirehep-search-js.svg)](https://coveralls.io/r/inspirehep/inspirehep-search-js)
[![LICENSE](https://img.shields.io/github/license/inspirehep/inspirehep-search-js.svg)](https://github.com/inspirehep/inspirehep-search-js/blob/master/LICENSE)

Inspire-search Angular JS module used in http://labs.inspirehep.net search results.

Installation
------------

    $ npm i

Demo
----

    $ cd example; npm install; cd ..
    $ npm run-script demo

Navigate to `http://localhost:8000` to see the `demo`.

Tests
-----

    $ npm test

Docs
----

    $ # build
    $ npm run-script docs
    $ # read
    $ open docs/index.html

How to use?
-----------

Check out the `example/` to see how to configure your app.

How to develop?
--------------
For easy development of `inspirehep-search-js` on top of [inspire-next](https://github.com/inspirehep/inspire-next) follow these steps:

1) Fork this repo and clone your personal fork.

	$ cd $VIRTUAL_ENV/src
	$ git clone git@github.com:<username>/inspirehep-search-js.git

2) Set `ASSETS_DEBUG=True` in your configuration.

	$ vim $VIRTUAL_ENV/var/inspirehep-instance/inspirehep.cfg

3) If you want to make sure all your assets are correctly installed in `$VIRTUAL_ENV/var/inspirehep-instance/static`, do:

	$ cd $VIRTUAL_ENV/src/inspire
	$ ./scripts/clean_assets

4) Now create a symbolic link from the `dist/` folder in your development folder to the instance folder.

	$ rm -rf $VIRTUAL_ENV/var/inspirehep-instance/static/node_modules/inspirehep-search-js/dist
	$ ln -s $VIRTUAL_ENV/src/inspirehep-search-js/dist/ $VIRTUAL_ENV/var/inspirehep-instance/static/node_modules/inspirehep-search-js/

5) Start watching changes in the `inspirehep-search-js` folder. Every time a JS or HTML file is modified, tests will run and the `dist/` folder will be recreated.

	$ cd $VIRTUAL_ENV/src/inspirehep-search-js
	$ npm install
	$ gulp watch

6) Every time you modify a JavaScript or HTML template, hard refresh your browser to avoid caching and see your changes.