import mongoose from "mongoose";
import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate"
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";

//Models
import Campground from "./models/campground.js";

//Error Handler
import { ExpressError } from "./utils/ExpressError.js";
import { catchAsync } from "./utils/catchAsync.js";

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

//EJS Engine
app.engine('ejs', ejsMate)

//EJS/Route Set up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//#region Routes
//Home
app.get('/', (req, res) => {
    res.render('index')
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
//
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required(),
            location: Joi.string().required(),
            image: Joi.string().required(),
        }).required()
    })
    const result = campgroundSchema.validate(req.body)

    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

//Show campground
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
}))

//Edit a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))
//
app.put('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campgrounds/${id}`)
}))

//Delete a campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not Found!", 404))
})
//#endregion

//Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong." } = err
    res.status(status).render('error')
})

//Port
app.listen(8080, () => {
    console.log('Listening on Port 8080')
})