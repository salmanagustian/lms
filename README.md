
## Description
Loyalti Management System API

## Dependencies Documentation
- [NodeJs](https://nodejs.org) >= 18 LTS 
- [Typescript](https://www.typescriptlang.org/docs/) = 5.1
- [NestJs](https://nestjs.com/) = 10
- ORM [Sequelize-Typescript](https://www.npmjs.com/package/sequelize-typescript) = v2.1.3
- Base ORM [Sequelize](https://sequelize.org/master/) = 6
- Open API [Swagger](https://swagger.io/)

## Install

- pull this repository to your local machine
- open your project folder and run ``` pnpm i -g ts-node ```
- run ``` pnpm install ```
- make your .env based on .env.example and fill the minimum required environment property
- run `pnpm run migrate core up` to run database migrations and seeders
- open api documentation with `http://localhost:3000/api/docs`, default port is 3000

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

```

## Description System & How to use
- Untuk data yang menggunakan seeders antara lain:
  - Data Member
  - Data Loyalty
  - Data Loyalty Policy
  - Data Loyalty Benefit
  - Data Tier

- Untuk menggunakan API sign-in masukan kredensial di bawah ini: 
   - salmanagustian@gmail.com | Password@123
   - febrian@gmail.com | Password@123

- Untuk endpoint yang memerlukan authorization seperti endpoint API Earned Point dan Redeemed Point silahkan masukan token <br>
dari response API sign-in ke dalam input tipe Authorize Bearer di Swagger.


