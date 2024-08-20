import { catchError } from "../../middleware/catchError.js";
import { Application } from "../../models/application.model.js";
import { Company } from "../../models/company.model.js";
import fs from "fs";
import path from "path";
import { AppError } from "../../utilities/appError.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";
import { Job } from "../../models/job.model.js";

// apply for job
const apply = catchError(async (req, res, next) => {
  req.body.userId = req.user.userId;
  req.body.userResume = req.file.filename;

  const application = new Application(req.body);
  await application.save();

  res
    .status(201)
    .json({ message: `application added successfully`, application });
});

// Get all applications
const getAllApplications = catchError(async (req, res, next) => {
  // applying api features
  let apiFeatures = new ApiFeatures(Application.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let applications = await apiFeatures.mongooseQuery
    .populate("userId", "userName")
    .populate("jobId", "jobTitle");
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, applications });
});

// get applications by HR
const getApplicationsByHr = catchError(async (req, res, next) => {
  const job = await Job.findOne({ addedBy: req.user.userId });

  if (job) {
    const application = await Application.find({ jobId: job._id });
    res.json(application);
  } else {
    return next(AppError(`you have no jobs in the applications`));
  }
});

// delete applications by HR
const deleteApplications = catchError(async (req, res, next) => {
  const job = await Job.findOne({ addedBy: req.user.userId });
  if (job) {
    const application = await Application.find({ jobId: job._id });

    application.forEach(
      async (ele) => await Application.findByIdAndDelete({ _id: ele.id })
    );

    res.json({ message: `applications deleted successfully` });
  } else {
    return next(AppError(`you have no jobs in the applications`));
  }
});

export { apply, getAllApplications, getApplicationsByHr, deleteApplications };
