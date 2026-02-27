FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./

# RUN npm ci
RUN npm install

COPY frontend/ .

# RUN npm run build
RUN node --max-old-space-size=1536 node_modules/.bin/vite build

FROM nginx:alpine

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]