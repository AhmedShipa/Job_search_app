import { catchError } from "../../middleware/catchError.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import { Job } from "../../models/job.model.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add new job
const addJob = catchError(async (req, res, next) => {
  req.body.addedBy = req.user.userId;
  const job = await Job.insertMany(req.body);
  res.status(201).json({ message: `job added successfully`, job });
});

// update company
const updateJob = catchError(async (req, res, next) => {
  // check if addedBy id equals the userId in token
  const addedBy = await Job.findOne({ addedBy: req.user.userId });
  addedBy || next(new AppError(`you are not the HR of this company`, 401));

  const job = await Job.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });
  res.status(200).json({ message: `job updated successfully`, job });
});

// delete job
const deleteJob = catchError(async (req, res, next) => {
  // check if addedBy id equals the userId in token
  const addedBy = await Job.findOne({ addedBy: req.user.userId });
  addedBy || next(new AppError(`you are not the HR of this company`, 401));

  await Job.findByIdAndDelete({ _id: req.params.id });
  // confirm that documents related to jobs are deleted
  const applicationRelated = await Application.findOne({
    jobId: req.params.id,
  });
  if (applicationRelated)
    await Application.findOneAndDelete({ jobId: req.params.id });
  res.status(200).json({ message: `job deleted successfully` });
});

// Get all Jobs with their company’s information
const getJobs = catchError(async (req, res, next) => {
  // applying api features
  let apiFeatures = new ApiFeatures(Job.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();

  let jobs = await apiFeatures.mongooseQuery
    .populate("companyId", "companyName")
    .populate("addedBy", "userName email");
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, jobs });
});

// Get all Jobs for a specific company.
const getJobsForCompany = catchError(async (req, res, next) => {
  const job = await Job.find({ companyId: req.params.id })
    .populate("companyId", "companyName")
    .populate("addedBy", "userName email");
  res.json(job);
});

export { addJob, updateJob, deleteJob, getJobs, getJobsForCompany };
