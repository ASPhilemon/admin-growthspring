import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { cookies } from "next/headers"
import { getUser } from "@/app/utils"
import { redirect } from "next/navigation"
import { EditDepositForm } from "@/app/components/edit-deposit-form"
import { findDepositById } from "@/app/data/dbQueries"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Loader } from "@/app/components/Loader"

export default async function Page({params} : any){
  const deposit = await findDepositById(params.id)
  if (!deposit) notFound()

    //admin authorization
    const cookieStore = cookies()
    const token = cookieStore.get('jwt')?.value
    const user = getUser(token)
    if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
    if (user && user.isAdmin == "false") redirect('https://growthspringers.com/signin')

  return (
    <div className="px-md-5 px-3 py-3 my-2" >
      <Breadcrumb>
        <BreadcrumbItem linkAs = { Link } href="/deposits"> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Edit</BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback = {<Loader/>} >
        <EditDeposit id = {params.id}  />
      </Suspense>
 
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