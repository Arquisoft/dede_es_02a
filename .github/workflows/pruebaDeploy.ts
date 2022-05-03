/*
name: CI for ASW2122
on:
  release:
    types: [published]
jobs:
  docker-push-webapp:
    name: Push webapp Docker Image to GitHub Packages
    runs-on: ubuntu-latest
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
        heroku_api_key: ${{ secrets.DEPLOY_KEY }}
        heroku_app_name: "dede-es2a-webapp"
        heroku_email: ${{ secrets.EMAIL }}
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
        heroku_api_key: ${{ secrets.DEPLOY_KEY }}
        heroku_app_name: "dede-es2a-restapi"
        heroku_email: ${{ secrets.EMAIL }}
        usedocker: true
        appdir: "restapi"
        */