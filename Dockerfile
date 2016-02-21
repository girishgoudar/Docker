FROM ubuntu:14.04
MAINTAINER girish goudar
RUN apt-get -y update
RUN apt-get -y install node.js
RUN apt-get -y install nodejs-legacy
RUN apt-get -y install npm
RUN npm install -g bower
RUN bower install
RUN npm install -g superstatic
COPY . /src
WORKDIR src/
EXPOSE 2169
ENTRYPOINT superstatic --host 0.0.0.0 --port 2169