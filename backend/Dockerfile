FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# for development
RUN npm install

# for production
# RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

# for development
# CMD ["npm", "run", "dev"]

# for production
CMD ["node", "dist/index.js"]