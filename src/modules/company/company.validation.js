import Joi from "joi";

const addCompanyVal = Joi.object({
  companyName: Joi.string().min(2).max(20).required(),
  description: Joi.string().min(2).max(20).required(),
  industry: Joi.string().min(2).max(20).required(),
  address: Joi.string().min(2).max(20).required(),
  numberOfEmployees: Joi.number().required(),
  companyEmail: Joi.string().email().required(),
});

const updateCompanyVal = Joi.object({
  companyName: Joi.string().min(2).max(20),
  description: Joi.string().min(2).max(20),
  industry: Joi.string().min(2).max(20),
  address: Joi.string().min(2).max(20),
  numberOfEmployees: Joi.number(),
  companyEmail: Joi.string().email(),
  companyHR: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24),
});
export { addCompanyVal, updateCompanyVal };
