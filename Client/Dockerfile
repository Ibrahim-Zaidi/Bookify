FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
ARG VITE_API_URL_PROD 
ARG VITE_CLIENT_ID 
ENV VITE_API_URL_PROD=$VITE_API_URL_PROD
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID 
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


