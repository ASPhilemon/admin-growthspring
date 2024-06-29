"use client"


import { Card, Overlay, Tooltip, Alert, Form, CardBody, Button, Modal, Spinner } from "react-bootstrap";
import { Info, Check2, Clock } from "react-bootstrap-icons";
import Link from "next/link";
import {Badge} from "react-bootstrap";
import { useState, useRef } from "react";

export function LoanCard({loan}: any){

  const [status, setStatus] = useState("flat");
  const [loanStatus, setLoanStatus] = useState(loan.loan_status)
  const [showToolTip, setShowToolTip] = useState(false)
  const toolTipTarget = useRef(null);

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
          { loanStatus == "Ended" && <Badge className="ms-auto me-2 py-1 px-2" pill bg="success">Ended <Check2 className="ms-1" size={16}/> </Badge>}
          {  loanStatus == "Ongoing" && <Badge className="ms-auto me-2 py-1 px-2" pill bg="secondary">Ongoing <Clock className="ms-1" size={16}/> </Badge>}
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div>
            <h6 className="mb-1 fw-bolder mb-2">UGX {loan.loan_amount.toLocaleString()}</h6>
            <p className=" mb-0 fw-light small ">{getDateString(loan.loan_date)}</p>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center" >
            <Button
              ref = {toolTipTarget}
              size="sm"
              variant="outline-primary"
              className= { "px-3 fw-bold me-2 me-md-4 rounded-1 " + (loanStatus =="Ended"? "opacity-25" : " ") }
              onClick = {
                ()=> {
                  if (loanStatus !== "Ended") setStatus("input");
                  else setShowToolTip(!showToolTip);
                }
              }
              > Pay
            </Button>
            <Overlay rootClose = {true} onHide={()=>setShowToolTip(false)} target = {toolTipTarget.current} show={showToolTip} placement="left">
              <Tooltip id="loan-tool-tip">
                This loan is fully paid
              </Tooltip>
            </Overlay>
            <Link href={`/loans/${loan._id}`} className="btn btn-sm btn-outline-primary me-2 rounded-1 me-md-4"><Info size={22}/></Link>
          </div>
        </div>
      </CardBody>
      {status == "pending" && <PaymentPending/>}
      {status == "error" && <PaymentError setStatus={setStatus} />}
      {status == "success" && <PaymentSuccess setStatus = {setStatus} />}
    </Card>

      <LoanPaymentModal setLoanStatus = {setLoanStatus} setStatus = {setStatus} status = {status} loan = {loan}/>
    </>
   
  )
}


function LoanPaymentModal({status, setStatus, loan, setLoanStatus}:any){
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
        <LoanPaymentForm setLoanStatus = {setLoanStatus} setStatus = {setStatus} loan = {loan}/>
      </Modal.Body>
    </Modal>
  )

}

function LoanPaymentForm({loan, setStatus, setLoanStatus}: any) {
  const API =  "https://api.growthspringers.com"
  async function handleSubmit(e:any){
    e.preventDefault()
    setStatus("pending")
    const payload = {
      loan_id: e.target.loan_id.value,
      payment_amount: e.target.payment_amount.value,
      payment_date: formatDate(e.target.payment_date.value),
      payment_location: e.target.payment_location.value,
    }
    console.log({payload: payload})
    try{
      const res = await fetch(`${API}/make-loan-payment`, {
        method: "POST",
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      console.log( data)
      if (res.ok) {
        setStatus("success");
        setLoanStatus(data.loan_status)
      }
      else setStatus("error");
    } catch(err){
      console.log(err)
      setStatus("error")
    }
   
  }

  function formatDate(date:string){
    const dateObj = new Date(date)
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    return `${month}-${day}-${year}`
  }
  function getMinPaymentDate(){
    const minDate = new Date()
    minDate.setDate(minDate.getDate()-40)
    const year = minDate.getFullYear()
    const month = (minDate.getMonth() + 1).toString().padStart(2, '0');
    const day = minDate.getDate()
    const minDateString = `${year}-${month}-${day}`
    return minDateString
  }
  
  function getMaxPaymentDate(){
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate()
    const maxDateString = `${currentYear}-${currentMonth}-${day}`
    return maxDateString
  }

  return (
    <Form onSubmit = {handleSubmit}>
      <fieldset className="faint p-3  rounded-1">
        <Form.Group className="mb-3" controlId = "payment-amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control name="payment_amount" required type="number" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "payment-date">
          <Form.Label>Date</Form.Label>
          <Form.Control max = {getMaxPaymentDate()} min = {getMinPaymentDate()} name="payment_date" required type="date" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "payment-cash-location">
          <Form.Label>Cash Location</Form.Label>
          <Form.Select name="payment_location" required aria-label="Default select example">
            <option value =''>select cash location</option>
            <option value="Standard Chartered">Standard Chartered</option>
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
    <div className="d-flex align-items-center justify-content-center rounded-2 backdrop pending">
      <div className="d-flex align-items-center py-3 px-5 bg-white shadow-lg">
        <Spinner animation="border" variant="primary" /> <span className="text-dark ms-4">processing payment ...</span>
      </div>
    </div>
    
  )
}

function PaymentError({setStatus}: any) {

    return (
      <div className="v-center d-flex justify-content-center align-items-center">
        <Alert className="shadow" variant="danger" onClose = {() => setStatus("flat")} dismissible>
          <p> An error occured processing payment</p>
        </Alert>
      </div>
     
    );
}

function PaymentSuccess({setStatus}: any) {

  return (
    <div className="v-center d-flex justify-content-center align-items-center">
      <Alert className="shadow" variant="success" onClose = {() => setStatus("flat")} dismissible>
        <p> Payment successful </p>
      </Alert>
    </div>
   
  );
}