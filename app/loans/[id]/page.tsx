import { Table, Breadcrumb, BreadcrumbItem} from "react-bootstrap"
import { getLoan } from "@/app/data/loan-queries";
import Link from "next/link";

export default async function Page({params}:any) {
  const loan = await getLoan(params.id)
  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }
  
  return (
    <div className="px-3 px-md-5 py-3">
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href="/loans"> Loans </BreadcrumbItem>
        <BreadcrumbItem  active>Detail</BreadcrumbItem>
      </Breadcrumb>
      <div className="d-md-flex">
        <div className="col-md-6">
          <h6 className="mb-3 fw-bold">Summary</h6>
          <div >
            <Table align="center" className="table-warning" responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Borrower</th>
                  <td> {loan.borrower_name} </td>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Loan Amount</th>
                  <td>UGX {loan.loan_amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Loan Date</th>
                  <td>{getDateString(loan.loan_date)}</td>
                </tr>
                <tr>
                  <th>Loan Duration</th>
                  <td>{loan.loan_duration} months</td>
                </tr>
                <tr>
                  <th>Approved By</th>
                  <td>{loan.approved_by}</td>
                </tr>
                <tr>
                  <th>Installment Amount</th>
                  {
                    loan.installment_amount? 
                    <td>UGX {loan.installment_amount.toLocaleString()}</td>:
                    <td className="text-muted">Not Available</td>
                  }
                </tr>
                <tr>
                  <th>Interest {loan.loan_status === "Ongoing"? "Accrued": "Paid"} </th>
                  {loan.loan_status === "Ongoing"?
                  <td>UGX {Math.floor(getInterestAndPoints(loan).interest_accrued).toLocaleString()}</td> :
                  <td>UGX {Math.floor(loan.interest_amount).toLocaleString()}</td>
                  }
                </tr>
                <tr>
                  <th>Points {loan.loan_status === "Ongoing"? "Accrued": "Spent"} </th>
                  {
                    loan.status === "Ongoing"?
                    <td>{ Math.floor(getInterestAndPoints(loan).points_accrued).toLocaleString() } points</td>:
                    <td>{ Math.floor(loan.points_spent).toLocaleString() } points</td>
                  }
                  
                </tr>
                <tr>
                  <th>Principal Left</th>
                  <td>UGX {loan.principal_left.toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Last payment date</th>
                  <td> { loan.payments.length > 0?  getDateString(loan.last_payment_date) : "No payment yet"}</td>
                </tr>
                <tr>
                  <th> Total Payments (To Date)</th>
                  <td>UGX {loan.payments.reduce((acc:any, cur:any)=> acc + cur.payment_amount, 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Loan Status</th>
                  <td>{loan.loan_status}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div  className="col-md-6 ms-md-3">
          <h6 className="mb-3 mt-4 mt-md-0 fw-bold">Payment History</h6>
          <div>
            {loan.payments.length > 0?
              <Table className="table-warning align-middle" responsive striped  bordered hover>
              <thead>
                <tr>
                  <th>Amount (UGX)</th>
                  <th>Date</th>
                  <th>Recorded By</th>
              </tr>
              </thead>
              <tbody>
              {
                loan.payments.map((payment:any, index: any)=>(
                  <tr key = {index} >
                    <td>{payment.payment_amount.toLocaleString()}</td>
                    <td>{getDateString(payment.payment_date)}</td>
                    <td>{payment.updated_by}</td>
                  </tr>
                ))
              }
              
              </tbody>
            
              </Table> :
              <p>No payments have been made for this loan</p>
            }
          </div>          
        </div>
      </div>
    </div>
  
  );
}


function getInterestAndPoints(loan:any){
  let constants = {
    max_lending_rate: 20,
    min_lending_rate: 12,
    annual_tax_rate: 20,
    max_credits: 20,
    min_discount: 25,
    discount_profit_percentage: 15,
    loan_multiple: 5,
    loan_risk: 30,
    members_served_percentage: 25,
    monthly_lending_rate: 2,
    one_point_value: 1000
  }
  let record = loan
  let interest_accrued = 0;
  let points_accrued =  0;
  // let pending_amount_interest:any;
  // let payment_interest_amount:any;
    if (record.loan_status == "Ongoing") {
      let remainder = getDaysDifference(record.loan_date, new Date());
      let current_loan_duration = Math.ceil(remainder / 30);
      let point_days = Math.max(0, Math.min(12, current_loan_duration) - 6) + Math.max(18, current_loan_duration) - 18;
      let running_rate = constants.monthly_lending_rate * (current_loan_duration - point_days);
      let pending_amount_interest = running_rate * record.principal_left / 100;
      let payment_interest_amount = 0;
      let points = constants.monthly_lending_rate * point_days * record.principal_left / 100000;
  
      if (record.payments) {
        record.payments.forEach((payment:any) => {
        let duration = (getDaysDifference(record.loan_date, payment.payment_date) % 30) / 30 < 0.24 ? Math.trunc(getDaysDifference(record.loan_date, payment.payment_date) / 30): Math.ceil(getDaysDifference(record.loan_date, payment.payment_date) / 30);
        let point_day = Math.max(0, Math.min(12, duration) - 6) + Math.max(18, duration) - 18;         
        let payment_interest = constants.monthly_lending_rate * (duration - point_day) * payment.payment_amount / 100;
        points += constants.monthly_lending_rate * point_day * payment.payment_amount / 100000;
        payment_interest_amount += payment_interest;
      })
    }
    interest_accrued = pending_amount_interest + payment_interest_amount;
    points_accrued = points;
  }
  return {interest_accrued, points_accrued}
}

//GET_DIFFERENCE_BETWEEN_DATES
function getDaysDifference(earlierDate:any, laterDate = new Date()) {
  const firstPeriod = new Date(earlierDate);
  const secondPeriod = new Date(laterDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = secondPeriod.getTime() - firstPeriod.getTime();
  const daysApart = Math.floor(timeDifference / millisecondsPerDay);
  return daysApart;
}