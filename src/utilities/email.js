import nodemailer from "nodemailer";
export const email = async (nums) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ahmedshipa0123@gmail.com",
      pass: "frwouelitfdhioil",
    },
  });
  // sending OTP to user
  const info = await transporter.sendMail({
    from: "<ahmedshipa0123@gmail.com>",
    to: "ahmedshadddd@gmail.com",
    subject: "OTP",
    html: `<h1>you OTP is ${nums}</h1>`,
  });

  console.log("Message sent: %s", info.messageId);
};
