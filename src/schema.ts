import joi from 'joi';

const validate = joi.object({
    amount: joi.number().required(),
    category: joi.string().required(),
    name: joi.string().required()
})

export default validate