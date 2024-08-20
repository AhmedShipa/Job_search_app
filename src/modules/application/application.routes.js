import express from "express";
import {
  apply,
  deleteApplications,
  getAllApplications,
  getApplicationsByHr,
} from "./application.controller.js";

import { allowedTo, protectedRoutes } from "../user/user.controller.js";
import { uploadSingleFile } from "../../../fileUpload/fileUpload.js";

export const applicationRouter = express.Router();

applicationRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user"),
    uploadSingleFile("userResume", "cv"),
    apply
  )
  .delete(protectedRoutes, allowedTo("company_HR"), deleteApplications)
  .get(getAllApplications);
applicationRouter.get(
  "/getApplicationsByHR",
  protectedRoutes,
  allowedTo("company_HR"),
  getApplicationsByHr
);
