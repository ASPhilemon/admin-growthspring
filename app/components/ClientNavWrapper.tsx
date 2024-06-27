"use client"

//next imports
//react imports
import { useState } from "react";
//installed components imports
//custom components imports
import { TopNav } from "./TopNav";
import { SideNav } from "./SideNav";


export function ClientNavWrapper({adminName}:any){
  const [show, setShow] = useState(false)

  const handleShow = ()=> {
    setShow(true)
  }
  const handleClose = ()=> {
    setShow(false)
  }

  return(
    <div>
      <SideNav show = {show} handleClose = {handleClose } />
      <TopNav adminName = {adminName} handleShow = {handleShow} />
    </div>
  )
}