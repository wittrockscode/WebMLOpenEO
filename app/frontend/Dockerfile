FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN echo $PORT
RUN echo $VITE_NODE_BACKEND_URI_CONTAINER
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && sed -i -e 's@$VITE_NODE_BACKEND_URI_CONTAINER@'"$VITE_NODE_BACKEND_URI_CONTAINER"'@g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'