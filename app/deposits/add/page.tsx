import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { headers } from "next/headers"
import { AddDepositForm } from "@/app/components/add-deposit-form"
import { getUsers } from "@/app/data/dbQueries"

export default async function Page(){
  const user = headers().get('user-name')!
  const users:any = await getUsers()
  
  return (
    <div className="px-md-5 px-3 py-3 my-2" >
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href="/deposits"> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Add</BreadcrumbItem>
      </Breadcrumb>
      <AddDepositForm user = {user} users = {users}  />
    </div>

  )
}