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
        <BreadcrumbItem linkAs = {Link} href="/loans/requests"> Requests </BreadcrumbItem>
        <BreadcrumbItem  active>Detail</BreadcrumbItem>
      </Breadcrumb>
      <h6 className="mb-3 fw-bold">Loan Request Details</h6>
      <div className="d-md-flex">
        <div className="col-md-6">
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
                <td>{getDateString(loan.latest_date)}</td>
              </tr>
              <tr>
                <th>Loan Duration</th>
                <td>{loan.loan_duration} months</td>
              </tr>
              <tr>
                <th>Installment Amount</th>
                <td>UGX {Math.floor((loan.loan_amount + loan.interest_amount)/loan.loan_duration).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Total Interest</th>
                <td>UGX {loan.interest_amount.toLocaleString()}</td>
              </tr>
              <tr>
                <th>Total Points</th>
                <td>{loan.points_spent}</td>
              </tr>
              <tr>
                <th>Borrower Worth</th>
                <td>{loan.points_spent}</td>
              </tr>
              <tr>
                <th>Initiated By</th>
                <td>{loan.initiated_by}</td>
              </tr>
              <tr>
                <th>Loan Status</th>
                <td>Pending Approval</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="px-md-4">
          <h5 className="mb-2 mt-3 text-primary mt-md-0">NB</h5>
          <ul className="list-unstyled">
            <li className="mb-2"> <span className="fw-bold">Borrower Worth.</span>  This is the worth of borrower at loan request time.</li>
            <li className="mb-2"> <span className="fw-bold">Installment Amount.</span>  This is the amount to be paid on one month intervals.</li>
            <li className="mb-2"> <span className="fw-bold">Total Interest.</span>  This is the total interest the borrower will pay if equal monthly installmets are paid </li>
            <li> <span className="fw-bold">Total Points.</span>  This is the total number of points used if equal monthly installmets are paid </li>
          </ul>
        </div>
      </div>
    
    </div>
  
  );
}

