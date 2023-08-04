const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");


dotenv.config({ path: "./config/config.env" });


cloudinary.config({
  cloud_name: "ddedeiqus",
  api_key: "142745125387671",
  api_secret: "_7NbXmaYk4IZ6Ko5A1vk_U0eBdY",
});

connectDatabase();



app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
