# Realscape-web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0.

## Development environment on WSL2

Install WSL2: https://www.digitalocean.com/community/tutorials/how-to-install-the-windows-subsystem-for-linux-2-on-microsoft-windows-10

Use ubuntu 18.04, which you can obtain from the microsoft store.

Install nvm: https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl

Use the ubuntu terminal app rather than the windows terminal app (or opening a linux shell via shift-rightclick), otherwise it will break.
Then run the following before mounting:
```
nvm install 16.14.2
nvm use 16.14.2
npm install -g @angular/cli
```

Clone out the repo, then navigate to the realscape-web directory to run `npm install`.

## Development environment on Windows

Install NVM: `https://github.com/coreybutler/nvm-windows/releases`

Run powershell as administrator, then run the following:
```
nvm install 16.14.2
nvm use 16.14.2
npm install -g @angular/cli
```
Clone out the repo, then navigate to the realscape-web directory to run `npm install`.

## Development server

There needs to be an API and database running for the interface to work correctly. See the `https://github.com/virtual-space/realnet-server` readme for how to set those up if you want a local development server.

Run `nvm use v16.14.2` to swap to the node version required.

If you want to use a locally run API the `client_id` in `environment.ts` will need to be changed to the client-id of root_web in the database your local API connects to.

Run `ng serve --configuration=dev` for a dev server. Use `--configuration=local` for local API. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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
