FROM node:18.16.1-alpine3.18 as build
WORKDIR /usr/src/app
COPY --chown=node:node apps/server/ ./
RUN yarn build

###################
# PRODUCTION
###################
FROM node:18.16.1-alpine3.18 As production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# fix exec bin
RUN apk update
COPY docker/bin/alpine/libvncserver.so.0.9.14 /usr/lib/libvncserver.so.0.9.14
COPY docker/bin/alpine/libvncserver.so.1 /usr/lib/libvncserver.so.1
COPY docker/bin/alpine/libvncserver.so /usr/lib/libvncserver.so
COPY docker/bin/alpine/storepasswd /usr/bin/storepasswd
RUN chown -R node:node /usr/bin/storepasswd
RUN chmod u+x /usr/bin/storepasswd

USER node
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "dist/main.js"]