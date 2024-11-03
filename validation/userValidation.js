const Joi = require("joi");

const checkStringSpace = (value, helpers) => {
    if (/^\s*$/.test(value)) {
        return helpers.message('This field cannot be just whitespace');
    }
    return value;
};

const userSchema = Joi.object({
    username: Joi.string().required().custom(checkStringSpace).messages({
        'any.required': 'Username is required',
        'string.empty': 'Username cannot be empty'
    }),
    password: Joi.string().required().custom(checkStringSpace).messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty'
    }),
    role: Joi.array().items(
        Joi.string().valid('admin', 'manager', 'employee', 'customer', 'supplier')
    ).required().messages({
        'any.required': 'Role is required',
        'array.includesOnly': 'Role must be one of admin, manager, employee, customer, or supplier'
    }),
    profile: Joi.object({
        name: Joi.string().required().custom(checkStringSpace).messages({
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().custom(checkStringSpace).messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),
        address: Joi.string().required().custom(checkStringSpace).messages({
            'string.empty': 'Address cannot be empty',
            'any.required': 'Address is required'
        }),
        contact: Joi.string().pattern(/^[0-9]{10,15}$/).required().custom(checkStringSpace).messages({
            'string.empty': 'Contact cannot be empty',
            'string.pattern.base': 'Contact must be a valid phone number with 10-15 digits',
            'any.required': 'Contact is required'
        })
    })
})

module.exports = userSchema;
