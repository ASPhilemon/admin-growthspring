"use client"


import { Card, Form, CardBody, Button, Modal, Spinner } from "react-bootstrap";
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
              onClick={()=>setStatus("input")}
              > Pay </Button>
            <Link href={`/loans/${loan._id}`} className="btn btn-sm btn-outline-primary me-2 rounded-1 me-md-4"><Info size={22}/></Link>
          </div>
          {status == "error" && "An error occured"}
          {status == "success" && "Loan payment sucessful"}
        </div>
      </CardBody>
      {status == "pending" && <PaymentPending/>}
    </Card>

      <LoanPaymentModal setStatus = {setStatus} status = {status} loan = {loan}/>
    </>
   
  )
}

function LoanPaymentModal({status, setStatus, loan}:any){
  function handleClose(){
    setStatus("flat")
  }

  return(
    <Modal
      centered
      show = {status == "input"}
      onHide = {handleClose}
      backdrop="static"
      keyboard={false}
      animation = {false}
    
      className="rounded-0"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h6">Loan payment | {loan.borrower_name} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoanPaymentForm setStatus = {setStatus} loan = {loan}/>
      </Modal.Body>
    </Modal>
  )

}

function LoanPaymentForm({loan, setStatus}: any) {
  const API = "https://api.growthspringers.com"
  async function handleSubmit(e:any){
    e.preventDefault()
    setStatus("pending")
    const payload = {
      loan_id: e.target.loan_id.value,
      payment_amount: e.target.payment_amount.value,
      payment_date: e.target.payment_date.value,
      payment_location: e.target.payment_location.value,
    }
    const res = await fetch(`${API}/make-loan-payment`, {
      method: "POST",
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    console.log( await res.json())
    if (res.ok) setStatus("success");
    else setStatus("error");
  }
  return (
    <Form onSubmit={handleSubmit}>
      <fieldset className="faint p-3  rounded-1">
        <Form.Group className="mb-3" controlId = "payment-amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control name="payment_amount" required type="number" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "payment-date">
          <Form.Label>Date</Form.Label>
          <Form.Control max={new Date().toLocaleDateString()} name="payment_date" required type="date" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "payment-cash-location">
          <Form.Label>Cash Location</Form.Label>
          <Form.Select name="payment_location" required aria-label="Default select example">
            <option value =''>select cash location</option>
            <option value="Standard Chartered">Standard Chatered</option>
            <option value="Admin Andrew">Admin Andrew</option>
            <option value="Admin Joshua">Admin Joshua</option>
          </Form.Select>
        </Form.Group>
        <input name="loan_id" hidden type="text" value = {loan._id} />
      </fieldset>
 

      <Button variant="primary" className="d-block ms-auto mt-4 mb-2" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function PaymentPending(){

  return (
    <div className="d-flex align-items-center justify-content-center rounded-1 backdrop pending">
      <div className="d-flex align-items-center p-4 bg-light">
        <Spinner animation="border" variant="primary" /> <span className="text-dark ms-2">processing payment ...</span>
      </div>
    </div>
    
  )
}