import mongoose from "mongoose";
import express from "express";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import path from "path";

//Models
import Campground from "./models/campground.js";
import Review from "./models/reviews.js";

//Models Validator
import {
  validateCampgroundSchema,
  validateReviewSchema,
} from "./utils/validateSchema.js";

//Error Handling helpers
import { ExpressError } from "./utils/ExpressError.js";
import { catchAsync } from "./utils/catchAsync.js";

//#region Mongoose Connect
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("Database Connected");
}
//#endregion

//#region __dirname workaround
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//#endregion

const app = express();

//EJS/Route Set up
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//EJS Engines
app.engine("ejs", ejsMate);

//Middleware functions
const validateCampground = (req, res, next) => {
  const { error } = validateCampgroundSchema.campgroundSchema.validate(
    req.body
  );

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 404);
  }

  next();
};

const validateReview = (req, res, next) => {
  const { error } = validateReviewSchema.reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 404);
  }

  next();
};

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//#region Routes
//Home
app.get("/", (req, res) => {
  res.render("index");
});

//Show all campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
//
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

//Show campground
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

//Edit a campground
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);
//
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
  })
);

//Delete a campground
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

//Create Review
app.post(
  "/campgrounds/:id/review",
  validateReview,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);

    campground.reviews.push(review);
    campground.save();
    review.save();

    res.redirect(`/campgrounds/${id}`);
  })
);

//Delete Review
app.delete(
  "/campgrounds/:id/review/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);
  })
);

//404 NOT FOUND
app.all("*", (req, res) => {
  res.status(404).render("404");
});
//#endregion

//Error Handler
app.use((err, req, res, next) => {
  res.status((err.status = 500)).render("error", { err });
});

//Port
app.listen(8080, () => {
  console.log("Listening on Port 8080");
});
