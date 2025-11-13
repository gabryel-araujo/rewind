# Rewind API

Esta é a API para o Rewind, um aplicativo para rastrear filmes que você assistiu, quer assistir e está assistindo no momento.

## Endpoints

### Autenticação

- `POST /auth/signup`: Cria um novo usuário. Requer `username`, `email`, e `password`.
- `POST /auth/signup/:code`: Confirma o código de verificação enviado por e-mail para concluir o cadastro.
- `POST /auth/login`: Autentica um usuário. Requer `email` e `password`.
- `POST /auth/logout`: Desloga o usuário.
- `GET /auth/google`: Redireciona para a tela de login do Google.
- `GET /auth/github`: Redireciona para a tela de login do Github.
- `GET /auth/cb`: Callback para o OAuth do Google e Github.
- `POST /auth/code/resend`: Reenvia o código de verificação por e-mail.
- `DELETE /auth/delete`: Deleta o usuário (soft delete).

### Usuários

- `GET /users/@me`: Retorna as informações do usuário logado.
- `GET /users/movies`: Retorna a lista de filmes do usuário logado.
- `GET /users/photo`: Gera uma URL para upload de foto de perfil.
- `DELETE /users/photo`: Deleta a foto de perfil do usuário.
- `PUT /users/`: Atualiza as informações do usuário.

### Filmes

- `GET /movies`: Retorna uma lista de filmes agrupados por gênero.
- `GET /movies/filter`: Filtra os filmes por `search`, `genres`, `actors`, e `releaseYear`.
- `GET /movies/user`: Retorna a lista de filmes do usuário logado com suas marcações.
- `GET /movies/count`: Retorna as estatísticas de filmes do usuário (assistidos, assistindo, favoritos).
- `GET /movies/:movieId`: Retorna os detalhes de um filme específico.

### Marcas de Filmes

- `PUT /movieMarks/mark`: Marca um filme como "assistido", "quero assistir" ou "assistindo". Também permite favoritar um filme.

### Atores

- `GET /actors`: Retorna uma lista de atores.

### Saúde

- `GET /health`: Verifica o status da API e de suas dependências (banco de dados e cache).

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Redis](https://redis.io/)
- [Minio](https://min.io/)
- [Nodemailer](https://nodemailer.com/)
