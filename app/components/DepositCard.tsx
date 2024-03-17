import { Card, CardBody } from "react-bootstrap";
import { Trash, Pencil, Info } from "react-bootstrap-icons";

export function DepositCard({deposit}: any){

  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }

  return (
    <Card className="mb-2 rounded-1 shadow-sm  bg-warning-subtle " >
      <CardBody>
        <div className="d-flex mb-5 align-items-center border-bottom py-3 border-opacity-10"  >
          {/* avatar */}
          <div style = {{width: "30px", height: "30px"}} className="rounded-circle shadow-sm bg-dark-subtle me-3">
          </div>
          <p className="mb-0 depositor-name fw-bold " > {deposit.depositor_name} </p>
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div>
            <h6 className="mb-1 fw-bold mb-2">UGX {deposit.deposit_amount.toLocaleString()}</h6>
            <p className=" mb-0 fw-light small text-muted">{getDateString(deposit.deposit_date)}</p>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center" >
            <a href="" className="btn btn-primary shadow-sm me-2 p-1 rounded-circle me-md-4"><Info size={22}/></a>
            <a href="" className="btn me-2 me-md-4  disabled opacity-50 rounded-circle p-2"><Pencil size={18}  /></a>
            <a href="" className="btn disabled opacity-50  rounded-circle p-2"  > <Trash size={18} className=""/></a>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}