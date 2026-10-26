# Object Manager

Angular version of the two supplied HTML pages. Uses Bootstrap and SCSS.

Use Node 24.15 or newer within 24.x, and npm 11. Run `nvm use` if you use nvm.

```sh
npm ci
npm start
```

Open http://localhost:4200. Use the login credentials provided with the assignment. Login needs the supplied API to be reachable.

Run `npm test -- --runInBand` for Jest tests and `npm run build` for the production build. Tests cover the auth reducer/effects and subordinates effects (more than what is requested in the assignment PDF file).

`AppModule` bootstraps the app and `ObjectsModule` is lazy loaded. Components are standalone. The creation pages are at `/objects/add` and `/objects/types`. With an objects homepage at `/objects` that helps navigating between the two creation pages.

Data services and models are in `core`. Components use facades to access data or NgRx stores that are accessed to using the NgRx selectors. Auth and subordinates use NgRx, including loading and error states (as requested). Each page has one root form, with step groups accessed through `ControlContainer`. Selected IDs stay in the form. Shared controls are in `shared/ui`.

API settings are in `src/environments/environment.ts`. Login uses the real API. The other requests are mocked after the auth interceptor adds the token, you can disable the mock interceptor by setting the value of `useMockApi` in `src/environments/environment.ts` to `false`. Auth is kept in localStorage for refresh and cleared on logout. Forms and saved objects are not persisted (no backend for them and no storing for them on the frontend, however if I had more time, I would've stored them in localStorage or IndexedDB).

Some Object Type controls are placeholders from the HTML reference: Responsibilities, Linked Object Types and Actions keep static rows. Their Add/Cancel buttons close the dialogs, and row actions don't change the tables. Actions search doesn't filter. The relationship chart and advanced widgets use demo data. These were not polished due to the limited time and lack of working HTML reference that could've made implementing a more round implementation more possible in the limited time window.
