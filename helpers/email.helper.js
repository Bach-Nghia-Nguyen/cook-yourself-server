const mongoose = require("mongoose");
const Template = require("../models/Template");
const Mailgun = require("mailgun-js");
const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const emailHelper = {};

const template = {
  name: "Email Verification Template",
  template_key: "verify_email",
  description: "This template is used when an user register a new email",
  from: "Cook Yourself Founder <bachnghianguyen@gmail.com>",
  subject: "Hi %name%, welcome to Cook Yourself",
  variables: ["name", "code"],
  html: `Hi <strong>%name%</strong>,
        <br /> <br />
        Thank you for your registration.
        <br /> <br />
        Please confirm your email address by clicking on the link below.
        <br /> <br />
        %code%
        <br /> <br />
        If you face any problem during the sign-up, just forget all of these
        things and do something else because I don't even know how to deal wih it!
        <br /> <br /> Master your kitchen!
        <br /> Cook Yourself
        `,
};

emailHelper.createTemplatesIfNotExistent = async () => {
  try {
    // email
    let template2 = await Template.findOne({
      template_key: template.template_key,
    });

    if (!template2) {
      await Template.create(template);
      console.log(
        `Created ${template.template_key} email verification template`
      );
    } else {
      console.log(`Email template ${template.template_key} already existed `);
    }
  } catch (error) {
    console.log(error);
  }
};

emailHelper.renderEmailTemplate = async (
  template_key,
  variablesObj,
  toEmail
) => {
  const template3 = await Template.findOne({ template_key });

  if (!template3) {
    return { error: "Invalid Template Key" };
  }

  const data = {
    from: template3.from,
    to: toEmail,
    subject: template3.subject,
    html: template3.html,
  };

  for (let i = 0; i < template3.variables.length; i++) {
    let key = template3.variables[i];

    if (!variablesObj[key]) {
      return {
        error: `Invalid variable keys: Missing ${template3.variables[i]}`,
      };
    }

    let re = new RegExp(`%${key}%`, "g");
    data.subject = data.subject.replace(re, variablesObj[key]);
    data.html = data.html.replace(re, variablesObj[key]);
  }

  return data;
};

emailHelper.send = (data) => {
  mailgun.messages().send(data, function (error, info) {
    if (error) {
      console.log(error);
    }
    console.log(info);
  });
};

module.exports = emailHelper;
