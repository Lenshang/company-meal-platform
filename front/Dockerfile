FROM node
WORKDIR /app
COPY package*.json /app/
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
COPY . /app
RUN npm run build:prod

FROM nginx
COPY --from=0 /app/build /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf    