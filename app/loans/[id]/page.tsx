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
      <h6 className="mb-3 fw-bold">Summary</h6>
      <div className="col-md-6">
        <Table className="table-warning" responsive striped bordered hover>
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
              <th>Ponts Spent</th>
              <td>{loan.points_spent}</td>
            </tr>
            <tr>
              <th>Principal Left</th>
              <td>UGX {loan.principal_left.toLocaleString()}</td>
            </tr>
            <tr>
              <th>Last payment date</th>
              <td>{getDateString(loan.last_payment_date)}</td>
            </tr>
            <tr>
              <th>Interest Paid</th>
              <td>UGX {loan.interest_amount.toLocaleString()}</td>
            </tr>
            <tr>
              <th>Loan Status</th>
              <td>{loan.loan_status}</td>
            </tr>
          </tbody>
         
        </Table>
      </div>
      <h6 className="mb-3 mt-4 fw-bold">Payment History</h6>
      <div className="col-md-6">
        {loan.payments.length > 0?
          <Table className="table-warning" responsive striped  bordered hover>
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
  
  );
}

