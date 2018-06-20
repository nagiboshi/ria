FROM node:8.9.1

ADD package.json /ria-backend/package.json
WORKDIR /ria-backend
RUN npm install; exit 0
RUN echo "deb http://httpredir.debian.org/debian jessie main contrib" > /etc/apt/sources.list \
   && echo "deb http://security.debian.org/ jessie/updates main contrib" >> /etc/apt/sources.list \
    && echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
    && apt-get update \
    && apt-get install -y ttf-mscorefonts-installer \
    && apt-get clean \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
# Two stage for caching to work, 100x perforamance increase :)
ADD . /ria-backend
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]