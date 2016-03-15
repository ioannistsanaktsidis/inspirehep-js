Inspirehep-Js
=================

[![Build Status](https://img.shields.io/travis/inspirehep/inspirehep-js.svg)](https://travis-ci.org/inspirehep/inspirehep-js)
[![Coverage](https://img.shields.io/coveralls/inspirehep/inspirehep-js.svg)](https://coveralls.io/r/inspirehep/inspirehep-js)
[![LICENSE](https://img.shields.io/github/license/inspirehep/inspirehep-js.svg)](https://github.com/inspirehep/inspirehep-js/blob/master/LICENSE)


Inspirehep Angular JS module used in http://labs.inspirehep.net.

Installation
------------

    $ npm i

Tests
-----

    $ npm test

How to use?
-----------

Check out the `example/` to see how to configure your app.

How to develop?
--------------
For easy development of `inspirehep-js` on top of [inspire-next](https://github.com/inspirehep/inspire-next) follow these steps:

1) Fork this repo and clone your personal fork.

	$ cd $VIRTUAL_ENV/src
	$ git clone git@github.com:<username>/inspirehep-js.git

2) Set `ASSETS_DEBUG=True` in your configuration.

	$ vim $VIRTUAL_ENV/var/inspirehep-instance/inspirehep.cfg

3) If you want to make sure all your assets are correctly installed in `$VIRTUAL_ENV/var/inspirehep-instance/static`, do:

	$ cd $VIRTUAL_ENV/src/inspire
	$ ./scripts/clean_assets

4) Now create a symbolic link from the `dist/` folder in your development folder to the instance folder.

	$ rm -rf $VIRTUAL_ENV/var/inspirehep-instance/static/node_modules/inspirehep-js/dist
	$ ln -s $VIRTUAL_ENV/src/inspirehep-js/dist/ $VIRTUAL_ENV/var/inspirehep-instance/static/node_modules/inspirehep-js/

5) Start watching changes in the `inspirehep-search-js` folder. Every time a JS or HTML file is modified, tests will run and the `dist/` folder will be recreated.

	$ cd $VIRTUAL_ENV/src/inspirehep-js
	$ npm install
	$ gulp watch

6) Every time you modify a JavaScript or HTML template, hard refresh your browser to avoid caching and see your changes.