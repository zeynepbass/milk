FROM node:22-alpine

WORKDIR /app
ENV MONGOMS_DISABLE_POSTINSTALL=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5346
CMD ["npm", "start"]
