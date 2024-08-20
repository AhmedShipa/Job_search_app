import Joi from "joi";

const addJobVal = Joi.object({
  jobTitle: Joi.string().min(2).max(20).required(),
  jobLocation: Joi.string().min(2).max(20).required(),
  workingTime: Joi.string().min(5).max(30).required(),
  seniorityLevel: Joi.string().min(5).max(30).required(),
  jobDescription: Joi.string().min(5).max(30).required(),
  technicalSkills: Joi.array().required(),
  softSkills: Joi.array().required(),
  companyId: Joi.string().hex().length(24).required(),
});

const updateJobVal = Joi.object({
  jobTitle: Joi.string().min(2).max(20),
  jobLocation: Joi.string().min(2).max(20),
  workingTime: Joi.string().min(5).max(30),
  seniorityLevel: Joi.string().min(5).max(30),
  jobDescription: Joi.string().min(5).max(30),
  technicalSkills: Joi.array(),
  softSkills: Joi.array(),
  companyId: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24),
});
export { addJobVal, updateJobVal };
