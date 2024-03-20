//next imports
import Link from "next/link";
import { usePathname } from "next/navigation";
//react imports
import { useState } from "react";
//installed components imports
import { Nav } from "react-bootstrap";
import { Offcanvas } from "react-bootstrap";
//custom components imports
import React from "react";
import { ArrowUpRight } from "react-bootstrap-icons";


export function SideNav({show, handleClose}: {show: true | false, handleClose: Function}) {

  return (
    <Offcanvas 
      show = { show }
      onHide = { handleClose }
      responsive = "lg"
      className = "col-3 min-vh-100  overflow-auto  bg-body-tertiary position-fixed"
    >
      <Offcanvas.Body className = "flex-column  px-0 py-0">
        <GrowthSpringLogo/>
        <DashboardPageLinks handleClose = {handleClose} />
        <div className="d-flex align-items-center  mt-2  mb-5">
          <a className='mt-3 text-primary fw-bold ms-3 me-3 h6' href="https://growthspringers.com">
            Member Dashboard 
          </a>
          <ArrowUpRight size = {20} />
        </div>
       
        <div className='d-flex my-4'>
          <a href="https://auth.growthspringers.com/signout?redirectURI=https://admin.growthspringers.com" className="btn ms-3 fw-bold btn-dark px-5 py-2"> Sign Out </a>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}



function  DashboardPageLinks({handleClose}:{handleClose: any}){

  const pathname = usePathname()
  

  let pages = [
    {
      linkText: "Home",
      linkUrl: "/"
    },
    {
      linkText: "Deposits",
      linkUrl: "/deposits"
    },
 
    
  ]

  return(
    <Nav className="flex-column mt-4">
      {
        pages.map((page)=> {
          return(
            <Nav.Link className="py-2" active = {page.linkUrl == pathname} as = {Link} href = {page.linkUrl}  key = {page.linkText} onClick = {handleClose} > {page.linkText}  </Nav.Link>
          )
        })
      }
    </Nav>
  )
}


function GrowthSpringLogo(){
  return(
    <div className="logo d-flex justify-content-center align-items-center">
       GROWTHSPRING ADMIN
    </div>
  )
}