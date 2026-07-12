FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
RUN npm install
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 4000 5173
CMD ["npm","run","dev"]
