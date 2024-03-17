//next imports
import Link from "next/link";
//react imports
import { useState } from "react";
//installed components imports
import { Nav } from "react-bootstrap";
import { Offcanvas } from "react-bootstrap";
//custom components imports
import Profile from "@/app/components/Profile"
import React from "react";


export function SideNav({show, handleClose}: {show: true | false, handleClose: Function}) {

  return (
    <Offcanvas 
      show = { show }
      onHide = { handleClose }
      responsive = "lg"
      className = "col-3 min-vh-100 px-3 overflow-auto  bg-body-tertiary position-fixed"
    >
      <Offcanvas.Body className = "flex-column  px-0 py-0">
        <Profile />
        <DashboardPageLinks handleClose = {handleClose} />
        <div className='d-flex my-4'>
          <a href="https://auth.growthspringers.com/signout?redirectURI=https://admin.growthspringers.com" className="btn ms-3 fw-bold btn-dark px-5 py-2"> Sign Out </a>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}



function  DashboardPageLinks({handleClose}:{handleClose: any}){
  

  let pages = [
    {
      linkText: "Deposits",
      linkUrl: "/deposits"
    },
    {
      linkText: "Home",
      linkUrl: "/"
    },
    
  ]

  return(
    <Nav className="flex-column mt-4">
      {
        pages.map((page)=> {
          return(
            <Nav.Link as = {Link} href = {page.linkUrl}  key = {page.linkText} onClick = {handleClose} > {page.linkText}  </Nav.Link>
          )
        })
      }
    </Nav>
  )
}
