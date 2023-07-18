FROM node:18.16.1-alpine3.18

WORKDIR /data/apps

# enter user
ARG gUser
ARG gId

# remove user node
RUN deluser --remove-home node

# add user
RUN adduser -D -u ${gId} ${gUser}

# fix exec bin
RUN apk update
COPY ./bin/alpine/libvncserver.so.0.9.14 /usr/lib/libvncserver.so.0.9.14
COPY ./bin/alpine/libvncserver.so.1 /usr/lib/libvncserver.so.1
COPY ./bin/alpine/libvncserver.so /usr/lib/libvncserver.so
COPY ./bin/alpine/storepasswd /usr/bin/storepasswd
RUN chown -R ${gUser}:${gUser} /usr/bin/storepasswd
RUN chmod u+x /usr/bin/storepasswd

# add sudo
RUN apk --no-cache add sudo && \
    echo "${gUser} ALL=(ALL) NOPASSWD: ALL" | tee -a /etc/sudoers

# chown mount volume
RUN mkdir -p /data/apps && \
    chown -R ${gUser}:${gUser} /data/apps

RUN mkdir -p /keys && \
    chown -R ${gUser}:${gUser} /keys

RUN apk --no-cache add bash

USER ${gUser}

CMD ["bash", "-c", "yarn run start:dev"]

