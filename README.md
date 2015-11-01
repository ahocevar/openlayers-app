# OpenLayers Application Template

Basic app template for OpenLayers applications in an [npm](https://www.npmjs.com) and [CommonJS](http://www.commonjs.org) environment.

## Getting started

Download the latest version of the template from https://github.com/ahocevar/openlayers-app/archive/master.zip. Unpack, change into the unpacked directory, and run

```
$ npm install
```

to install dependencies and create a custom build of OpenLayers.

To serve the application with the built-in debug server, run

```
$ npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) to play with the demo application.

To run the debug server on a different port, use the `$PORT` environment variable.

## Developing

### App structure

The entry points for your application are `src/index.js`, `src/index.css` and `index.html`. Your html files go in the root directory, JavaScript and css files go in the `src/` directory, and additional static resources (e.g. images) go into `static/`. CSS is included in the built JavaScript file with [cssify](https://www.npmjs.com/package/cssify), so no CSS should be included in your html files.

### Custom OpenLayers builds

This application template encourages you to use a custom build of OpenLayers. The build configuration is in `config/ol.json`. The sections you will want to edit are `exports` and `compile`-`define`. The former specifies the symbols to include in the build, the latter are compiler defines. See http://openlayers.org/en/v3.10.1/doc/tutorials/custom-builds.html for more information about the build configuration file.

When you change the configuration, run `npm intall` to rebuild OpenLayers before running `npm start` or `npm run dist`.

**Note:** Custom builds require Java. If Java is not installed, everything will still work despite the error message, but the full build of OpenLayers will be used.

## Building the app for distribution

The application you see in the browser at [http://localhost:3000/](http://localhost:3000/) uses unminified JavaScript with source maps for easy debugging, and loads all OpenLayers source files separately. To build the application for distribution, you will want minified JavaScript and no files that do not belong to the app, like this `README.md` file you're reading. When you are satisfied with your application, run

```
$ npm install
$ npm run dist
```

This will populate the `dist/` directory with only the files that belong to your application. To test the result, run

```
$ npm start
```

and navigate to [http://localhost:3000/dist/](http://localhost:3000/dist/). If you get JavaScript errors, you have not included all OpenLayers symbols or features that your app uses in `config/ol.json`. Review the `exports` and `compile`-`define` sections to include missing symbols and features, and go through the "Building the app for distribution" steps again. When everything works, you can grab the contents of the `dist/` directory and deploy it to your server.
