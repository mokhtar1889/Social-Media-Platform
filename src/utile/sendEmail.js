import nodemailer from "nodemailer"

export let sendEmail = async ({ to , subject , html})=>{

    const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: false,
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

    const info = await transporter.sendMail({
    from: `"socialMedia👻" <${process.env.NODEMIALER_USER}>`,
    to,
    subject,
    html
  });


}

