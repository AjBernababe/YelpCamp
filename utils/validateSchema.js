import Joi from "joi";

export const validateCampgroundSchema = {
  //Campground Model
  campgroundSchema: Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
    }).required(),
  }),
};

export const validateReviewSchema = {
  //Campground Model
  reviewSchema: Joi.object({
    review: Joi.object({
      comment: Joi.string().required(),
      rating: Joi.number().required().min(1).max(5),
    }).required(),
  }),
};
