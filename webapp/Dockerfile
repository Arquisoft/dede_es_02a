FROM node:16.13.1
LABEL org.opencontainers.image.source https://github.com/Arquisoft/dede_es2a
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:5000"
ENV REACT_APP_API_URI=$API_URI

#Crete an optimized version of the webapp
RUN npm run build

#Ver como podemos llamar npm run prod aquí
CMD [ "npm", "run", "prod" ]