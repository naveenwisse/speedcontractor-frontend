# Job Introduce Client Application #

## Project Description

HTML, JavaScript and CSS for the Job Introduce application.

## Commands

### NPM

  * `npm install` -- Install project NPM dependencies. This is automatically done when you first create the project. You should only need to run this if you add dependencies in `package.json`.
  * `npm update` -- Update project NPM dependencies.

### Bower

  * `bower install` -- Install project Bower dependencies. This is automatically done when you first create the project. You should only need to run this if you add dependencies in `bower.json`.
  * `bower update` -- Update project Bower dependencies.

### Grunt

  * `grunt` -- Default grunt command to build and test the project.
  * `grunt build` -- Build the project
  * `grunt server` -- Start a grunt server to view the client

### Steps to deploy

1) make sure to build the client code for the environment you are deploying to:
    for stage: grunt stage
    for prod:  grunt prod
    for local: grunt

2) install firebase-tools:
    - npm install -g firebase-tools

3) login to firebase:
    - firebase login

4) select which project you are deploying assets to:
    to deploy to stage:
        firebase use stage
        firebase deploy --only hosting

    to deploy to prod:
        firebase use prod
        firebase deploy --only hosting


5) to check which project you are currently on you can use firebase use
