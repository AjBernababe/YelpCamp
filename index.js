import mongoose from "mongoose";
import express from "express";
import methodOverride from "method-override";
import path from 'path';
import { fileURLToPath } from 'url';

import Campground from "./models/campground.js";

//#region Mongoose Connect
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Database Connected')
}
//#endregion

//Dynamic Path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

//EJS/Route Set up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//#region Routes
//Home
app.get('/', (req, res) => {
    res.render('index')
})
//#endregion

//Port
app.listen(8080, () => {
    console.log('Listening on Port 8080')
})