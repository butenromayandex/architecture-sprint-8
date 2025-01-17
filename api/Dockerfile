FROM node:16 AS build
WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

RUN npx tsc -p ./tsconfig.json


FROM node:16
RUN apt-get update && \
    apt-get install -y jq curl && \
    apt-get clean \

WORKDIR /usr/src/app

COPY package.json .
RUN npm install --production

COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/keycloak.json /


EXPOSE 8000
CMD ["node", "/usr/src/app/dist/app.js"]