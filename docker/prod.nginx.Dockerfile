FROM node:18.16.1-alpine3.18 as build
WORKDIR /usr/src/app
COPY --chown=node:node apps/frontend/ ./
RUN yarn build

FROM node:18.16.1-alpine3.18 as build-wb-client
WORKDIR /usr/src/app
COPY --chown=node:node apps/frontend-wb-client/ ./
RUN yarn build

###################
# PRODUCTION
###################
FROM nginx:1.25.1-alpine3.17 As production
WORKDIR /usr/share/nginx/html/frontend
COPY --from=build /usr/src/app/dist .

WORKDIR /usr/share/nginx/html/frontend-wb-client
COPY --from=build-wb-client /usr/src/app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
