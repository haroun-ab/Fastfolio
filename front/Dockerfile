FROM node:21
WORKDIR /app
COPY ./react/package*.json ./
RUN npm install
COPY ./react .
CMD ["npm", "start"]