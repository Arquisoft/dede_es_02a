/*
name: CI for ASW2122
on:
  push:
    branch: [develop]

jobs:
  unit-test-webapp:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: webapp
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: 16
    - run: npm ci
    - run: npm test
    - uses: codecov/codecov-action@v2
  unit-test-restapi:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: restapi
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: 16
    - run: npm ci
    - run: npm test
    - uses: codecov/codecov-action@v2
  e2e-tests:
    needs: [unit-test-webapp, unit-test-restapi]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: 16
    - run: npm --prefix webapp install
    - run: npm --prefix restapi install
    - run: npm --prefix webapp run build
    - run: npm --prefix webapp run test:e2e
  docker-push-webapp:
    name: Push webapp Docker Image to GitHub Packages
    runs-on: ubuntu-latest
    needs: [e2e-tests]
    steps:
    - uses: actions/checkout@v2
    - name: Publish to Registry
      uses: elgohr/Publish-Docker-Github-Action@3.04
      with:
          name: arquisoft/dede_es2a/webapp
          username: ${{ github.actor }}
          password: ${{ secrets.DOCKER_PUSH_TOKEN }}
          registry: ghcr.io
          workdir: webapp
  docker-push-restapi:
    name: Push restapi Docker Image to GitHub Packages
    runs-on: ubuntu-latest
    needs: [e2e-tests]
    steps:
    - uses: actions/checkout@v2
    - name: Publish to Registry
      uses: elgohr/Publish-Docker-Github-Action@3.04
      with:
          name: arquisoft/dede_es2a/restapi
          username: ${{ github.actor }}
          password: ${{ secrets.DOCKER_PUSH_TOKEN }}
          registry: ghcr.io
          workdir: restapi
  deploy-webapp:
    needs: [docker-push-restapi,docker-push-webapp]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy webapp
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.DEPLOY_HOST }}
        heroku_app_name: ${{ secrets.DEPLOY_USER }}
        heroku_email: ${{ secrets.DEPLOY_KEY }}
        usedocker: true
        appdir: "webapp"      
  deploy-restapi:
    needs: [docker-push-restapi,docker-push-webapp]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy restapi
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
         heroku_api_key: ${{ secrets.DEPLOY_HOST }}
        heroku_app_name: ${{ secrets.DEPLOY_USER }}
        heroku_email: ${{ secrets.DEPLOY_KEY }}
        usedocker: true
        appdir: "restapi" 
*/