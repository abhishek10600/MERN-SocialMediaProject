FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

# for development
# CMD ["npm", "run", "dev"]

# for production
CMD ["node", "dist/index.js"]