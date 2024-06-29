import Link from "next/link"
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import { getUsersWithIds } from "@/app/data/dbQueries"
import { AddRequest } from "@/app/components/RequestAdd"

export default async function Page(){
  const users = await getUsersWithIds()
  await new Promise(resolve => setTimeout(resolve, 5000));
    return(
    <div className="px-md-5 px-3 py-3 my-2" >
      <div className="d-flex align-items-center py-0">
        <Breadcrumb>
          <BreadcrumbItem linkAs = {Link} href="/loans" > Loans </BreadcrumbItem>
          <BreadcrumbItem linkAs = {Link} href = '/loans/requests' >Requests</BreadcrumbItem>
          <BreadcrumbItem  active> Add </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <AddRequest users = {users} />
    </div>
    )
}
