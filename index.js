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

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//#region Routes
//Home
app.get('/', (req, res) => {
    res.send('Welcome to YelpCamp')
})

//Show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

//Create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
})

//Show campground
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
})

//Edit a campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body)
    res.redirect(`/campgrounds/${id}`)
})

//Delete a campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})
//#endregion

//Port
app.listen(8080, () => {
    console.log('Listening on Port 8080')
})