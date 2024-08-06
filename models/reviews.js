import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  body: String,
  rating: Number,
});

export default model("Review", ReviewSchema);
