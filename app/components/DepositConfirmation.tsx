
export function DepositConfirmation({deposit}:any){
  return (
    <div className='container'>
      <header>
        <img src = "https://api.growthspringers.com/img/logo1.png" alt="GrowthSpring Logo"/>
      </header>

      <div className='content'>
        <p className='mb-4 fw-light'>Dear {deposit.user},</p>
        <p className='mb-4'>We are pleased to confirm that your recent deposit has been successfully processed.</p>
        <h6 className='mb-1'>Deposit Details:</h6>
        <ul>
          <li className='mb-1'>
            Amount Deposited:
            <span className="fw-bold"> UGX {Math.floor(deposit.amount).toLocaleString()}.</span>
          </li>
          <li className='mb-1'>
            Deposit Date:
            <span className="fw-bold"> {formatDate(deposit.date)}.</span>
          </li>
        </ul>
        <p className='mb-1'>
          With this deposit, your new worth is
          <span style= {{"whiteSpace": "nowrap"}} className="fw-bold mb-1"> UGX {Math.floor(deposit.newWorth).toLocaleString()}.</span>  <br/>
        </p>
        <a className='d-block mb-4' href="https://growthspringers.com">  Go to dashboard</a>
        <h6 className='mb-1'>Points Earned:</h6>
        <p className='mb-4'>
          You received <span className="fw-bold">{deposit.points}</span> points for this deposit. You now have
          <span className="fw-bold"> {deposit.newPoints.toLocaleString()} points. </span>
           Please note that 3 points are awarded for every UGX 10, 000 deposited.
        </p>
        <p className='mb-3'>Thank you for your continued trust and support. If you have any questions or need further assistance, please do not hesitate to contact us.</p>
        <p className='mb-4'>Best regards,</p>
        <h5 className='mb-3'>Treasury Dept | GrowthSpring</h5>
      </div>
    </div>
  )

}


function formatDate(date:any){
  date = new Date(date)
  const options = { month: 'short', day: '2-digit', year: 'numeric' };
  const dateString = date.toLocaleDateString('en-US', options);
  return dateString
}


export async function depositEmailConfirmationHTML(deposit:any){
  const ReactDOMServer = (await import('react-dom/server')).default;
  const componentHTML = ReactDOMServer.renderToStaticMarkup(<DepositConfirmation deposit = {deposit}/>)
  return(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email</title>
      <style>
        /* Add your email styles here */
        *{
          box-sizing: border-box;
        }

        .d-block{
          display: block;
        }
        
        header{
          padding: 30px 0;
        }
      
        .container{
          max-width: 500px;
          margin: 0 auto;
          font-size: 14px;
          border: 1px solid #ddd; /* Light gray border */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow */
          border-radius: 5px; /* Rounded corners */
          background-color: #fff; /* White background */
          
        }
        
        .content{
          padding: 20px;
        }


        header{
          background-color: #E7C615;
          text-align: center;
          margin-bottom: 15px;
          padding: 30px 0;
        }
        
        h6{
          font-weight: bold;
          font-size: 15px;
        }
        h6, p, ul, li, h5{
          margin: 0;
        }
        ul{
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        .fw-bold{
          font-weight: bold;
        }
      
        h5{
          font-size: 15px;
          color:#a58d08;
          font-weight: bolder;
        }
        .mb-1{
          margin-bottom: 5px;
        }
        .mb-2{
          margin-bottom: 8px;
        }
        .mb-3{
          margin-bottom: 12px;
        }
        .mb-4{
          margin-bottom: 15px;
        }
        a{
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
          ${componentHTML}
    </body>
    </html>
    `
  )
}

