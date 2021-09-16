# NestJS Auth Template

## It`s a my template for jwt authentication

## Set up

### Edit a .env file

### Start docker

```bash
$ docker-compose up -d
$ docker exec -it nestjs_auth_template_server sh
$ npm install
```

### Create a schema in database

### Execute migration and run server

```bash
$ docker exec -it nestjs_auth_template_server sh
$ npm run build
$ npx typeorm migration:run
$ npm run start:dev
```
