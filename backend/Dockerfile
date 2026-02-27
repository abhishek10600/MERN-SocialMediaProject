FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# for development
RUN npm install

# for production
# RUN npm ci

COPY . .

RUN mkdir -p public/temp

# RUN npm run build
RUN node --max-old-space-size=512 node_modules/.bin/tsc

EXPOSE 4000

# for development
# CMD ["npm", "run", "dev"]

# for production
CMD ["node", "dist/index.js"]