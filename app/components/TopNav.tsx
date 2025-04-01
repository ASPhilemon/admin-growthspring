
//next imports
import Link from "next/link";
import Image from "next/image";

//react imports
//installed components imports
import { Navbar, Col,  Container, NavbarBrand } from "react-bootstrap";
//custom components imports
import { OffcanvasToggler } from "@/app/components/OffcanvasToggler";

export function TopNav({handleShow, adminName} : any){

  return(
    <Navbar as = {Col} className='py-2 mb-1 px-3 bg-warning top-nav' lg = {{  offset: 3 }}>
      <Container fluid className='justify-content-between px-0 py-0'>
        <OffcanvasToggler handleShow = {handleShow} />
        <NavbarBrand as = {Link} href = '/' className="ms-auto" >
          {/* <Image
            src = "/img/logo.png"
            alt = "logo"
            width = {140}
            height = {28}
          /> */}
          <h6>Admin | {adminName}</h6>
        </NavbarBrand> 
      </Container>
    </Navbar>
  )
}