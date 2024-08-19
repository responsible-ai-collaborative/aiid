FROM node:17-alpine

LABEL maintainer="Sean McGregor <mongodb-awesome-backup@seanbmcgregor.com>"

RUN apk add --no-cache \
    coreutils \
    bash \
    tzdata \
    py3-pip \
    mongodb-tools \
    curl \
    npm

# install awscli
RUN pip install awscli

# install boto3
RUN pip install boto3

ENV AWS_DEFAULT_REGION=ap-northeast-1

COPY docker-db-backup/bin /docker-db-backup/opt/bin
WORKDIR /docker-db-backup/opt/bin
ENTRYPOINT ["/docker-db-backup/opt/bin/entrypoint.sh"]
CMD ["backup", "prune", "list"]
