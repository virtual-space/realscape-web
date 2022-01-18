# Realscape-web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Development environment

Install WSL2: https://www.digitalocean.com/community/tutorials/how-to-install-the-windows-subsystem-for-linux-2-on-microsoft-windows-10

Use ubuntu 18.04, which you can obtain from the microsoft store.

Install nvm and node: https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl

Use the ubuntu terminal app rather than the windows terminal app (or opening a linux shell via shift-rightclick), otherwise it will break.
Run `nvm install v10.24.1` to install the node.js version for this project.

Navigate to the realscape-web directory to run `npm install`.

## Development server

There needs to be an API and database running for the interface to work correctly. See the `https://github.com/virtual-space/realnet-server` readme for how to set those up if you want a local development server.

Run `nvm use v10.24.1` to swap to the node version required.

If you want to use the development API, run `export NODE_ENV=dev` before `ng serve`. If you want to use a locally run API, use `export NODE_ENV=local` and the `client_id` in `environment.ts` will need to be changed to the client-id of root in the database your local API connects to.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
