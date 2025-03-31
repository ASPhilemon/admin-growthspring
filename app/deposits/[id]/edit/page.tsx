import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { EditDepositForm } from "@/app/components/edit-deposit-form"
import { findDepositById } from "@/app/data/dbQueries"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Loader } from "@/app/components/Loader"


export default async function Page({params} : any){
  const deposit = await findDepositById(params.id)
  if (!deposit) notFound()

  return (
    <div className="px-md-5 px-3 py-3 my-2" >
      <Breadcrumb>
        <BreadcrumbItem linkAs = { Link } href="/deposits"> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Edit</BreadcrumbItem>
      </Breadcrumb>
      {/* <Suspense fallback = {<Loader/>} > */}
        <EditDeposit id = {params.id}  />
      {/* </Suspense> */}
    </div>
  )
}

async function EditDeposit({id}:any){
  const deposit = await findDepositById(id)
  if (!deposit) notFound()

  return(
    <EditDepositForm deposit = {deposit} />
  )
}
