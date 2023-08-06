FROM node:18.16.1-alpine3.18 as build
WORKDIR /usr/src/app
COPY --chown=node:node apps/frontend/ ./
RUN yarn build

###################
# PRODUCTION
###################
FROM nginx:1.25.1-alpine3.17 As production
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
