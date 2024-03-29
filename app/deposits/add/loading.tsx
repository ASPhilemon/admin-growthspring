import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { Loader } from "@/app/components/Loader"


export default function Page(){

  return (
    <div className="px-md-5 px-3 py-3 my-2" >
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href="/deposits"> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Add</BreadcrumbItem>
      </Breadcrumb>
      <Loader/>
    
    </div>

  )
}