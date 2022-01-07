## Config

The lightweight config for minimum bundle size.

#### Babel

The config supports all features of ECMAScript stage >= 3 up to
April 09, 2020.

###### Packages sidenote:

* core-js - contains polyfills for known features (installed version -
  as for April 09, 2020).
* @babel/preset-env - defines what features should be supported (stage >= 3)
  and what polyfills should be included to get an ability to use these
  features on the finite set of browsers. Feature list is specified by
  specifying version of core-js module installed. The list of browsers
  is defined with .browserlistrc file.

#### Webpack

Implemented:
* sass
* css modules
* autoprefixer
* code splitting. Implemented:
  - app and vendors (node_modules) chunks - separation for the browser
    caching purposes;
  - dynamic import.
* tree shaking
* mangling (js, css)
* minification (js, css)
* gzip
* unused files finder
* sourcemaps

## Notes

* Warning on build (size limit). It's OK that there are warnings about
  chunks size limit exceeding. I decided to leave the max chunk size as is
  (default); it's the optimal size, and indeed they should be lower than
  that value if possible. As long as there is no usage of dynamic import
  the app is always 3 chunks:
  - app;
  - vendors;
  - runtime.

  Of course, there is no way app or vendors to be lower than default
  244KiB in size while containing the whole app. It's perfectly fine;
  additionally, there is gzip, so the final files will be much smaller.
  Yet splitting the app in lower chunks and using dynamic import can be
  good for caching purposes and significantly improve page performance
  (load time). The warning is just the reminder for you as a developer
  to pay attention.

* Warning on build (unused files). It's OK for NotImplPage - component
  under /src/pages dir. It was used during development as a route stub to
  display message that page is not implemented yet. The component can be
  used in the future.

## Commands

Usage: `npm run <command>`

Commands:

```
start       - start in dev mode (start dev server with source code files watchers)
build       - build for production
lint        - run linting
stylelint   - run styles linting
analyze     - run bundle analyzer for latest build
```

Dev server proxies all requests that starts with /api/ to the backend
app.
