
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
- Untuk ERD bisa dilihat pada root folder dengan nama ERD-LMS.png
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

## Default config Loyalty Policy & Benefit
- Pengaturan default loyalty policy adalah sebagai berikut
  - Transactional
    - minimal qty pembelian
    - apakah pembelian pertama kali
    - minimal total pembelian transaksi
    - `RULES - 1`: first_purchase && total qty >= qty pembelian = earned point 
    - `RULES - 2`: total pembelian transaksi > minimal pembelian transaksi = earned point
  
  - Community
    - MGM: `RULES:`: total member invited * dengan fixed point di pengaturan loyalty benefit
    - ACTIVITY: `RULES`: tidak ada, default earned point yang di dapat mengikuti pengaturan loyalty benefit

- Pengaturan default loyalty benefit adalah sebagai berikut
  - Transactional
    - Percentage dan fixed point: Dapat berupa kelipatan
    - `NOTES:` untuk nilai percentage yg di input ke database harus berupa nilai desimal, seperti `0.30` artinya 30% di ambil dari max point nilai fixed point. Jika nilai percentage null atau tidak di set, nilai kelipatan menggunakan fixed point
  
  - Community 
    - fixed point: Dapat berupa kelipatan


