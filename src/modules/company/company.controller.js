import { catchError } from "../../middleware/catchError.js";
import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";
import { AppError } from "../../utilities/appError.js";

// add new company
const addCompany = catchError(async (req, res, next) => {
  req.body.companyHR = req.user.userId;
  const company = await Company.insertMany(req.body);
  res.status(201).json({ message: `company added successfully`, company });
});

// update company
const updateCompany = catchError(async (req, res, next) => {
  // check if company_HR id equals the userId in token
  const HR_id = await Company.findOne({ companyHR: req.user.userId });
  HR_id || next(new AppError(`you are not the HR of this company`, 401));

  const company = await Company.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  res.status(200).json({ message: `company updated successfully`, company });
});

// delete company
const deleteCompany = catchError(async (req, res, next) => {
  // check if company_HR id equals the userId in token
  const HR_id = await Company.findOne({ companyHR: req.user.userId });
  HR_id || next(new AppError(`you are not the HR of this company`, 401));

  await Company.findByIdAndDelete({ _id: req.params.id });

  // confirm that documents related to company deleted
  const jobRelated = Job.findOne({ companyId: req.params.id });
  if (jobRelated) await Job.findOneAndDelete({ companyId: req.params.id });

  res.status(200).json({ message: `company deleted successfully` });
});

// Get company data
const getCompany = catchError(async (req, res, next) => {
  const company = await Company.findById({ _id: req.params.id }).populate(
    "companyHR",
    "userName email role"
  );
  res.status(200).json(company);
});

// Get all companies
const getCompanies = catchError(async (req, res, next) => {
  // applying api features
  let apiFeatures = new ApiFeatures(Company.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();

  let companies = await apiFeatures.mongooseQuery.populate(
    "companyHR",
    "userName email role"
  );
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, companies });
});

export { addCompany, updateCompany, deleteCompany, getCompany, getCompanies };
