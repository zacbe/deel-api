FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Install SQLite3 in the container
RUN apk add --no-cache sqlite

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "sh", "-c", "npm run seed && npm start" ]
