import Link from "next/link"
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"

export default function Page(){
    return(
    <div className="px-md-5 px-3 py-3 my-2" >
      <div className="d-flex align-items-center py-0">
        <Breadcrumb>
          <BreadcrumbItem linkAs = {Link} href="/loans" > Loans </BreadcrumbItem>
          <BreadcrumbItem linkAs = {Link} href = '/loans/requests' >Requests</BreadcrumbItem>
          <BreadcrumbItem  active>Add</BreadcrumbItem>
        </Breadcrumb>
      
      </div>
    </div>
    )
}