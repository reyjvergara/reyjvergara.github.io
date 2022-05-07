FROM node:latest as build

WORKDIR /

COPY . .

RUN npm install
RUN npm run build -- --prod

FROM nginx:alpine

WORKDIR /

COPY --from=build /app/dist .


#docker build . -t chainofazns/pokeac-front

#docker run -p 5000:80 -d chainofazns/pokeac-back  this is for local stuff, try to remember how you tied it to azure and github some other time

#docker push chainofazns/pokeac-front