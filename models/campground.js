import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

export default model("Campground", CampgroundSchema);
