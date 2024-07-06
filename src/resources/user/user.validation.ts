import Joi from 'joi';

const register = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(6).required(),
});

const login = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(6).required(),
});

export default { register, login };
