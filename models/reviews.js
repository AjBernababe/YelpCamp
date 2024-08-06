import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ReviewSchema = new Schema({
  comment: String,
  rating: Number,
});

export default model("Review", ReviewSchema);
