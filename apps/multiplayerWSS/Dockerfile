# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base

# this will cache them and speed up future builds
FROM base AS install

COPY package.json .

RUN  bun install --frozen-lockfile --production

COPY . .

# run the app
USER bun
EXPOSE 3002/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]