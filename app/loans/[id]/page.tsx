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
                  <th>Interest Accrued</th>
                  { loan.interest_accrued? <td>UGX {loan.interest_accrued.toLocaleString()}</td>:
                  <td><span className="text-muted">Not Available</span></td>
                  }
                </tr>
                <tr>
                  <th>{loan.loan_status == "Ongoing"? "Tentative Interest" : "Interest Paid" }</th>
                  <td>UGX {loan.interest_amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Points Accrued</th>
                  { loan.points_accrued? <td>{loan.points_accrued.toLocaleString()} points</td>:
                  <td><span className="text-muted">Not Available</span></td>
                  }
                </tr>
                <tr>
                  <th> {loan.loan_status == "Ongoing"? "Tentative Points" : "Points Spent" }</th>
                  <td>{loan.points_spent} points</td>
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

