"use client"

import { Button } from "react-bootstrap"


export function OffcanvasToggler({handleShow}:{handleShow: any }){

  return(
    <Button variant='none' className='offcanvas-toggler d-inline-block d-md-none me-2 px-0 '>
      <img
        src="/icons/menu.svg"
        width ="30px"
        height = "30px"
        alt="menu icon"
        onClick = { handleShow }
      />
    </Button>
  )
}
        