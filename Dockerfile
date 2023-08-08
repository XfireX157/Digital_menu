# Use uma imagem base Node.js
FROM node:latest

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código para o diretório de trabalho
COPY . .

# Porta em que a aplicação estará rodando
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]