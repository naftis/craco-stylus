# craco-stylus

Stylus plugin for [Craco](https://www.npmjs.com/package/@craco/craco). Allows using Stylus `.styl` files in create-react-app 3.0 and also works with TypeScript.

- CSS Module imports: `import styles from "./App.module.styl";`
- Global imports: `import "./App.module.styl";`

## Getting started with create-react-app

```
$ create-react-app karate-app

$ cd karate-app

$ yarn add @craco/craco craco-stylus stylus stylus-loader
```

<sub>package.json</sub>

```diff
   "scripts": {
-    "start": "react-scripts start",
+    "start": "craco start",
-    "build": "react-scripts build",
+    "build": "craco build",
-    "test": "react-scripts test",
+    "test": "craco test",
-    "eject": "react-scripts eject"
+    "eject": "craco eject"
   },
```

<sub>craco.config.js</sub>

```js
const CracoStylusPlugin = require("craco-stylus");

module.exports = {
  plugins: [
    {
      plugin: CracoStylusPlugin
    }
  ]
};
```
