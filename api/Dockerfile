#FROM node:20.2-alpine
#
#WORKDIR /usr/src/app
#ENV NODE_ENV=production
#
#COPY package*.json ./
#
#RUN npm ci && npm install -g typescript tsc ts-node
#
#COPY . .
#
#RUN npm run build
#
#
#EXPOSE 8000
#
#CMD ["node", "dist/app.js"]


# First stage: compile things.
FROM node:16 AS build
WORKDIR /usr/src/app

# (Install OS dependencies; include -dev packages if needed.)

# Install the Javascript dependencies, including all devDependencies.
COPY package.json .
RUN npm install

# Copy the rest of the application in and build it.
COPY . .
# RUN npm build
RUN npx tsc -p ./tsconfig.json
RUN ls

# Now /usr/src/app/dist has the built files.

# Second stage: run things.
FROM node:16
WORKDIR /usr/src/app/dist

# (Install OS dependencies; just libraries.)

# Install the Javascript dependencies, only runtime libraries.
COPY package.json .
RUN npm install --production

# Copy the dist tree from the first stage.
COPY --from=build /usr/src/app .
COPY --from=build /usr/src/app/keycloak.json .

# Run the built application when the container starts.
EXPOSE 8000
CMD ["npm", "run", "start"]