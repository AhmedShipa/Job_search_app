import Joi from "joi";
const signUpVal = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  userName: Joi.string().min(5).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Za-z1-9]{8,40}$/)
    .required(),
  recoveryEmail: Joi.string().email().required(),
  DOB: Joi.date(),
  mobileNumber: Joi.number().required(),
  role: Joi.string().required(),
});

const signInVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Za-z1-9]{8,40}$/)
    .required(),
});

const updateUserVal = Joi.object({
  firstName: Joi.string().min(2).max(20),
  lastName: Joi.string().min(2).max(20),
  userName: Joi.string().min(5).max(30),
  email: Joi.string().email(),
  password: Joi.string().pattern(/^[A-Za-z1-9]{8,40}$/),
  recoveryEmail: Joi.string().email(),
  DOB: Joi.date(),
  mobileNumber: Joi.number(),
  role: Joi.string(),
  id: Joi.string().hex().length(24).required(),
});
export { signUpVal, signInVal, updateUserVal };
