# App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building for production

When building for production the following environment needs to be defined:

`src/environments/firebaseConfig.prod.ts`  
 This should be in the format of a default export of the firebase config json, i.e.

```
export default {
  apiKey: "",
  authDomain: "",
  measurementId: "",
  ...
};
```

Or any other logic that results in a correct default export
