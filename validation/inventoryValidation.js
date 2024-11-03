const Joi = require('joi');

const checkStringSpace = (value, helpers) => {
    if (/^\s*$/.test(value)) {
        return helpers.message('This field cannot be just whitespace');
    }
    return value;
};

const inventorySchema = Joi.object({
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be greater than 0.',
    'any.required': 'Quantity is required'
  }),
  expiryDate: Joi.date().greater('now').required().messages({
    'date.base': 'Expiry date must be a valid date',
    'date.greater': 'Expiry date cannot be in the past',
    'any.required': 'Expiry date is required'
  }),
  sku: Joi.string().required().custom(checkStringSpace).messages({
    'any.required': 'SKU is required',
    'string.empty': 'SKU cannot be empty'
  }),
  name: Joi.string().required().custom(checkStringSpace).messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty'
  }),
  description: Joi.string().required().custom(checkStringSpace).messages({
    'any.required': 'Description is required',
    'string.empty': 'Description cannot be empty'
  }),
  price: Joi.number().integer().min(1).required().messages({
    'number.base': 'Price must be a number',
    'number.integer': 'Price must be an integer',
    'number.min': 'Price must be greater than 1',
    'any.required': 'Price is required'
  })
});

module.exports = inventorySchema;
