FROM node:14

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN cd /app; yarn install
RUN yarn global add typescript
COPY . .

ENV NODE_ENV development
CMD yarn run watch
