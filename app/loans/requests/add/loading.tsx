"use client"

import { Placeholder, PlaceholderButton, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import Link from "next/link";

export default function Loading(){
  return(
    <div className="px-md-5 px-3 py-3 my-2" >
      <div className="d-flex align-items-center mb-2 py-0">
        <Breadcrumb>
          <BreadcrumbItem linkAs = {Link} href="/loans" > Loans </BreadcrumbItem>
          <BreadcrumbItem linkAs = {Link} href = '/loans/requests' >Requests</BreadcrumbItem>
          <BreadcrumbItem  active> Add </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="px-3 rounded-1 col-md-8">
        <Placeholder className = "mb-4 d-block" animation = {"glow"}>
          <Placeholder className = "py-2 rounded-2 d-block mb-2" xs = {4} />
          <Placeholder className = "py-4 rounded-2"  xs = {12} />
        </Placeholder>
        <Placeholder className = "mb-4 d-block" animation = {"glow"}>
          <Placeholder className = "py-2 rounded-2 d-block mb-2" xs = {4} />
          <Placeholder className = "py-4 rounded-2"  xs = {12} />
        </Placeholder>
        <Placeholder className = "mb-4 d-block" animation = {"glow"}>
          <Placeholder className = "py-2 rounded-2 d-block mb-2" xs = {4} />
          <Placeholder className = "py-4 rounded-2"  xs = {12} />
        </Placeholder>
        <Placeholder className = "mb-5 d-block" animation = {"glow"}>
          <Placeholder className = "py-2 rounded-2 d-block mb-2" xs = {4} />
          <Placeholder className = "py-4 rounded-2"  xs = {12} />
        </Placeholder>
        <Placeholder xs={3} md={2} className = "d-block ms-auto" animation="glow">
          <PlaceholderButton xs={12} variant="primary" />
        </Placeholder>
      </div>
    </div>
  )
}