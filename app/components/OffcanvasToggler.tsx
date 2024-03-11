"use client"

import Image from "next/image"
import { Button } from "react-bootstrap"


export function OffcanvasToggler({handleShow}:{handleShow: any }){

  return(
    <Button
      variant='none'
      className='offcanvas-toggler d-inline-block d-md-none me-2 px-0 '
      onClick = { handleShow }
    >
      <Image
        src="/icons/close.svg"
        width = {30}
        height = {30}
        alt = "menu icon"
      />
    </Button>
  )
}
        