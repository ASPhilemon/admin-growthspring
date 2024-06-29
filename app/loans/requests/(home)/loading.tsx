"use client"

import { Breadcrumb, BreadcrumbItem, Placeholder, Card, CardBody, PlaceholderButton } from "react-bootstrap";
import Link from "next/link";
import { PlusLg } from "react-bootstrap-icons";

export default function Loading(){
  return(
    <div className="px-md-5 px-3 py-3 my-2">
      <Breadcrumb className="d-inline-block">
        <BreadcrumbItem linkAs = {Link} href="/loans" > Loans </BreadcrumbItem>
        <BreadcrumbItem  active>Requests</BreadcrumbItem>
      </Breadcrumb>
      <Link className="btn btn-primary btn-sm ms-3 " href = "/loans/requests/add" >
        Add Request <PlusLg color="white" className="fw-bolder ms-2" size = {20} />
      </Link>
      <LoanRequestCardsSkeleton/>
  </div>
    
  )
}


function RequestCardSkeleton(){
  return(
    <Card className="mb-2 loan-card border-0 " >
      <CardBody>
        <div className="d-flex mb-5 align-items-center header pb-3"  >
          {/* avatar */}
          <Placeholder animation="glow" >
            <Placeholder xs ={0} className = "p-3 rounded-circle me-2" />
          </Placeholder>
          <Placeholder className = "me-2 col-6" animation="glow" >
            <Placeholder className="rounded-pill"  xs = {12} />
          </Placeholder>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div className="w-75">
            <Placeholder xs={12} animation="glow">
              <Placeholder xs={6} className = "mb-3 rounded-pill d-block"/>
              <Placeholder xs={5} className = "mb-2 rounded-pill d-block"/>
              <Placeholder xs={5} className = "mb-2 rounded-pill d-block"/>
            </Placeholder>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center w-25 ms-auto justify-content-end" >
            <Placeholder xs={7} className="me-2" animation="glow">
              <PlaceholderButton xs={12} variant="primary" />
            </Placeholder>
            <Placeholder xs={5} animation="glow">
              <PlaceholderButton xs={12} variant="primary" />
            </Placeholder>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function LoanRequestCardsSkeleton(){
  return(
    <div className="loan-cards p-2 rounded-2">
      <RequestCardSkeleton/>  
      <RequestCardSkeleton/> 
  </div>
  )
}