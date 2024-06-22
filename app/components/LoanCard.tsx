"use client"


import { Card, CardBody, Button, Modal } from "react-bootstrap";
import { Info, Check2, Clock } from "react-bootstrap-icons";
import Link from "next/link";
import {Badge} from "react-bootstrap";
import { useState } from "react";

export function LoanCard({loan}: any){

  const [status, setStatus] = useState("flat");

  function getDateString(date:any){
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString
  }

  return (
    <>
     <Card className="mb-2 loan-card border-0   " >
      <CardBody>
        <div className="d-flex mb-5 align-items-center header pb-3"  >
          {/* avatar */}
          <div style = {{width: "30px", height: "30px"}} className="rounded-circle bg-dark-subtle shadow-sm  me-3">
          </div>
          <h6 className="mb-0 depositor-name me-2" > {loan.borrower_name} </h6>
          { loan.loan_status == "Ended" && <Badge className="ms-auto me-2 py-1 px-2" pill bg="success">Ended <Check2 className="ms-1" size={16}/> </Badge>}
          {  loan.loan_status == "Ongoing" && <Badge className="ms-auto me-2 py-1 px-2" pill bg="secondary">Ongoing <Clock className="ms-1" size={16}/> </Badge>}
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div>
            <h6 className="mb-1 fw-bolder mb-2">UGX {loan.loan_amount.toLocaleString()}</h6>
            <p className=" mb-0 fw-light small ">{getDateString(loan.loan_date)}</p>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center" >
            <Button
              size="sm"
              variant="outline-primary"
              className= { "px-3 fw-bold me-2 me-md-4 rounded-1 " + (loan.loan_status =="Ended"? " disabled" : " ") }
              disabled = {status !== "flat"}
              onClick={()=>setStatus("input")}
              > Pay </Button>
            <Link href={`/loans/${loan._id}`} className="btn btn-sm btn-outline-primary me-2 rounded-1 me-md-4"><Info size={22}/></Link>
          </div>
        </div>
      </CardBody>
      </Card>
      <LoanPaymentModal setStatus = {setStatus} status = {status}/>
    </>
   
  )
}

function LoanPaymentModal({status, setStatus}:any){
  function handleClose(){
    setStatus("flat")
  }
  function handlePending(){
    setStatus("pending")
  }

  return(
    <Modal
      centered
      show = {status == "input"}
      onHide = {handleClose}
      animation = {false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick = {handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )

}