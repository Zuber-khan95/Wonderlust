const Joi=require("@hapi/joi");

const listingSchema=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().allow("").allow(null).min(3).max(100),
    image:Joi.string().allow("").allow(null),
    price:Joi.number().required().min(0),
    location:Joi.string().required(),
    country:Joi.string().required()
 
});

const reviewSchema=Joi.object({
    rating:Joi.number().min(0).max(5),
    comment:Joi.string().required(),
    createdAt:Joi.date().allow("").allow(null)
})

module.exports={listingSchema,reviewSchema};
