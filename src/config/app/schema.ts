import * as Joi from 'joi';
export default Joi.object({
  ENV: Joi.string().valid('development').required(),
  PORT: Joi.number().default(3000),
});
