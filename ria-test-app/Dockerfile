FROM node:8.9.1
RUN npm install -g cordova
ADD package.json /ria-app/package.json
WORKDIR /ria-app
RUN npm install; exit 0

# Two stage for caching to work, 100x perforamance increase :)
ADD . /ria-app
RUN npm run build

EXPOSE 3001
ENTRYPOINT ["npm", "run", "start"]