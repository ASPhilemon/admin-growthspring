import * as nodemailer from 'nodemailer'

export function sendMail(
{
    recipient,
    sender,
    subject,
    body,
    replyAddress
  } : any
)
{

  let transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "dfa04f6b252a5436c6afc525de9f22ef"
    }
  });
  
  var mailOptions = {
    from:`<${sender}@growthspringers.com>`,
    to: recipient,
    subject: subject,
    html: body,
    replyTo: replyAddress
  };
  
  transporter.sendMail(mailOptions, function(err:any){
    if (err) throw Error(err.message); else{
      console.log("email sent")
    }
  });
}