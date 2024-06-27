import { PlusLg } from "react-bootstrap-icons";
import Link from "next/link";
import { Loader } from "@/app/components/Loader";


export default function Loading(){
  return(
  <div className="px-md-5 px-3">
    <div className="d-flex align-items-center py-3">
      <h5 className="me-4 mb-0  fw-light " >Deposits </h5>
      <Link className="shadow-sm btn btn-primary" href = "/deposits/add" >
        Add Deposit
        <PlusLg color="white" className="fw-bolder ms-2" size = {20} />
      </Link>
    </div>
    <Loader/>
  </div>
  )

}


