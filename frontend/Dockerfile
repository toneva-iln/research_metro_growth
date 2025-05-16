# Dockerfile for React Frontend
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies and build
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .

# Accept environment variable from docker-compose
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Serve frontend with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]