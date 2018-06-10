FROM node:8.9.1
RUN apt-get update
RUN apt-get install -y bash git make g++ autoconf libpng-dev python python-pip
RUN npm install -g @angular/cli --no-optional
RUN npm install http-server -g

ADD package.json /ria-admin/package.json
WORKDIR /ria-admin
RUN npm install; exit 0

# Two stage for caching to work, 100x perforamance increase :)
ADD . /ria-admin
RUN npm run build

EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]