# ---- Base Stage ----
# Usamos uma imagem oficial do Node.js baseada no Alpine Linux.
# Alpine é uma distribuição Linux muito leve, o que torna nossa imagem final menor.
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
# Copiamos apenas os arquivos de dependência primeiro.
# O Docker cria camadas para cada comando. Se package.json não mudar,
# o Docker reutiliza a camada de 'npm install', tornando os builds futuros muito mais rápidos.
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm install

# ---- Production Stage ----
# Esta é a imagem final que será usada em produção.
FROM base AS production
ENV NODE_ENV=production

# Copia as dependências já instaladas do estágio 'dependencies'.
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copia o resto do código da sua aplicação.
COPY . .

# Expõe a porta que a aplicação usa dentro do container.
# A conexão com o mundo exterior será feita no docker-compose.yml.
EXPOSE 3333

# Comando para iniciar a aplicação quando o container for executado.
CMD ["npm", "start"]