import * as Joi from 'joi';

export default Joi.object({
  JWT_ALGORITHM: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
