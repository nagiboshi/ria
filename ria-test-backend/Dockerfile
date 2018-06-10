FROM node:8.9.1

ADD package.json /ria-backend/package.json
WORKDIR /ria-backend
RUN npm install; exit 0

# Two stage for caching to work, 100x perforamance increase :)
ADD . /ria-backend
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]