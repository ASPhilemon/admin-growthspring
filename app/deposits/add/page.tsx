import { Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import Link from "next/link"
import { cookies } from "next/headers"
import { getUser } from "@/app/utils"
import { redirect } from "next/navigation"
import { AddDepositForm } from "@/app/components/add-deposit-form"
import { headers } from "next/headers"



export default function Page(){


    //admin authorization
    const cookieStore = cookies()
    const token = cookieStore.get('jwt')?.value
    const user = getUser(token)
    if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
    if (user && user.isAdmin == "false") redirect('https://growthspringers.com/signin')

    const headerList = headers()
    const referer = headerList.get("referer") || "/deposits"

  return (
    <div className="px-md-5 px-3 py-3 my-2" >
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href={referer}> Deposits </BreadcrumbItem>
        <BreadcrumbItem  active>Add</BreadcrumbItem>
      </Breadcrumb>
      <AddDepositForm referer = {referer} user = {user.fullName} />
    </div>

  )
}