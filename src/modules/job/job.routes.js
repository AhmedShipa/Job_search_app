import express from "express";
import {
  addJob,
  deleteJob,
  getJobs,
  getJobsForCompany,
  updateJob,
} from "./job.controller.js";

import { validate } from "../../middleware/valiadate.js";
import { addJobVal, updateJobVal } from "./job.validation.js";
import { allowedTo, protectedRoutes } from "../user/user.controller.js";

export const jobRouter = express.Router();

jobRouter
  .route("/")
  .post(validate(addJobVal), protectedRoutes, allowedTo("company_HR"), addJob)
  .get(getJobs);

jobRouter
  .route("/:id")
  .put(
    validate(updateJobVal),
    protectedRoutes,
    allowedTo("company_HR"),
    updateJob
  )
  .delete(protectedRoutes, allowedTo("company_HR"), deleteJob)
  .get(protectedRoutes, allowedTo("company_HR"), getJobsForCompany);
