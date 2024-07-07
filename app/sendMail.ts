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
      pass: "2d97f505634eaa761005456acaad2c1f"
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