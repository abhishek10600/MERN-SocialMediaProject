# -----BUILD-----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# development
RUN npm install

# production
# RUN npm ci

COPY . .

# don't expose the port when in production
# for development
# EXPOSE 5173

# for development
# CMD ["npm", "run", "dev"]

# for production
RUN npm run build

# for production
# -----SERVE-----

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off"]