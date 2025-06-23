FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

COPY data ./data/

RUN yarn run build
EXPOSE 3001

CMD ["sh", "-c", "yarn run migration:run && yarn run start:prod"]