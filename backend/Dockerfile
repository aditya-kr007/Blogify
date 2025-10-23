# stage 1
FROM node:20 AS builder

WORKDIR /src

COPY package*.json ./

RUN npm install


COPY . .

#stage 2
FROM node:20-alpine

WORKDIR /src

COPY --from=builder /src /src

EXPOSE 5000

CMD ["npm", "run","dev"]