const nodemailer = require('nodemailer');
const sendMail = async (transporterOptions, mailOptions) => {
  const transporter = nodemailer.createTransport(transporterOptions);
  const info = await transporter.sendMail(mailOptions);
  return info;
};
module.exports = {sendMail};