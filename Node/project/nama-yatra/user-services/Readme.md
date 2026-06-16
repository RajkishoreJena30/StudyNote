## Initial setup
- npm init -y     
- npm i express @types/express @types/node cookie-parser winston zod helmet cors @types/cors
- npm install typescript --save-dev
- npx tsc --init

## Docker Cmd
- docker compose config    - check the yml file format is correct
- docker compose up   -   run all the container, services as per the docker-compose.yml file

## Prisma Configuration Steps:
- 
- 
- npx prisma migrate dev --name init
- npx prisma generate 