import { User } from "../models/user.model.js";

export const isLogged = async (req, res, next) => {
  // check if user is login first
  const loggedIn = await User.findById({ _id: req.params.id });
  if (loggedIn.status == "offline") return res.json({ message: `please login` });
  console.log(loggedIn);
  next();
};
