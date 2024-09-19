import { Card, CardBody } from "react-bootstrap";
import { Trash, Pencil, Info } from "react-bootstrap-icons";
import Link from "next/link";
import Image from "next/image";

export function DepositCard({deposit}: any){
  const API = "https://api.growthspringers.com"
  let imgSrc = deposit.depositor.photoURL
  imgSrc = imgSrc? `${API}/${imgSrc}`: "/img/defaultPhoto.jpg"
  console.log(deposit)

  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }

  return (
    <Card className="mb-2 rounded-1  shadow-sm  " >
      <CardBody>
        <div className="d-flex mb-5 align-items-center border-bottom pb-3 border-opacity-10"  >
          {/* avatar */}
          {/* <div style = {{width: "30px", height: "30px"}} className="rounded-circle bg-dark-subtle shadow-sm  me-3">
          </div> */}
          <img className="rounded-circle me-3 shadow-sm" width={30} height={30} src={imgSrc} alt={deposit.depositor_name} />
          <h6 className="mb-0 depositor-name" > {deposit.depositor_name} </h6>
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div>
            <h6 className="mb-1 fw-bolder mb-2">UGX {deposit.deposit_amount.toLocaleString()}</h6>
            <p className=" mb-0 fw-light small ">{getDateString(deposit.deposit_date)}</p>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center" >
            <Link href={`/deposits/${deposit._id}`} className="btn btn-primary shadow-sm me-2 p-0 rounded-circle me-md-4"><Info size={22}/></Link>
            <Link href= {`/deposits/${deposit._id}/edit`} className="btn me-2 me-md-4 rounded-circle p-2"><Pencil size={18}  /></Link>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}