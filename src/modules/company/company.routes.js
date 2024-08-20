import express from "express";
import {
  addCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
} from "./company.controller.js";
import { validate } from "../../middleware/valiadate.js";
import { addCompanyVal, updateCompanyVal } from "./company.validation.js";
import { allowedTo, protectedRoutes } from "../user/user.controller.js";

export const companyRouter = express.Router();

companyRouter
  .route("/")
  .post(
    validate(addCompanyVal),
    protectedRoutes,
    allowedTo("company_HR"),
    addCompany
  )
  .get(getCompanies);

companyRouter
  .route("/:id")
  .put(
    validate(updateCompanyVal),
    protectedRoutes,
    allowedTo("company_HR"),
    updateCompany
  )
  .delete(protectedRoutes, allowedTo("company_HR"), deleteCompany)
  .get(getCompany);
