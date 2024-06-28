"use client"


import { Card, Alert, Form, CardBody, Button, Modal, Spinner } from "react-bootstrap";
import {  Trash } from "react-bootstrap-icons";
import { useState} from "react";

export function LoanRequestCard({loan, handleLoanDelete}: any){

  const [status, setStatus] = useState("flat");
  const [errMsg, setErrMsg] = useState("")
  const [pendingMsg, setPendingMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const StatusSetter= {
    setErrMsg,
    setPendingMsg,
    setSuccessMsg
  }

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
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div>
            <h6 className="mb-1 fw-bolder mb-2">UGX {loan.loan_amount.toLocaleString()}</h6>
            <p className=" mb-0 fw-light small ">{getDateString(loan.latest_date)} | {loan.loan_duration} months </p>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center" >
            <Button
              size="sm"
              variant="outline-primary"
              className= { "px-3 fw-bold me-2 me-md-4 rounded-1 "}
              onClick = {
                ()=> setStatus("modal-approve")
              }
              > Approve
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              className= { "px-3 fw-bold me-2 me-md-4 rounded-1 "}
              onClick = {
                ()=> setStatus("modal-delete")
              }
              > <Trash size = {16} />
            </Button>
           
          </div>
        </div>
      </CardBody>
      {status == "pending" && <Pending msg = {pendingMsg} />}
      {status == "error" && <Error msg = {errMsg} setStatus = {setStatus} />}
      {status == "success" && <Success msg = {successMsg} setStatus = {setStatus} />}
    </Card>

      <RequestApprovalModal handleLoanDelete = {handleLoanDelete} StatusSetter = {StatusSetter} status = {status} setStatus = {setStatus} loan = {loan}/>
      {/* <LoanDeleteModal setStatus = {setStatus} loan = {loan}/> */}
    </>
   
  )
}


function RequestApprovalModal({status, setStatus, loan, StatusSetter, handleLoanDelete}:any){
  function handleClose(){
    setStatus("flat")
  }

  return(
    <Modal
      centered
      show = {status == "modal-approve"}
      onHide = {handleClose}
      backdrop="static"
      keyboard={false}
      animation = {false}
    
      className="rounded-0"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h6">Loan Request Approval | {loan.borrower_name} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="fw-bold mb-1">Please fill in the cash location amounts. <br/>  </h6>
        <p className="fw-light mb-3">(The total amount should be equal to the loan amount UGX {loan.loan_amount.toLocaleString()})</p>

        <RequestApprovalForm handleLoanDelete StatusSetter = {StatusSetter} setStatus = {setStatus} loan = {loan}/>
      </Modal.Body>
    </Modal>
  )

}

function RequestApprovalForm({loan, setStatus, StatusSetter, handleLoanDelete}: any) {
  const API =  "https://api.growthspringers.com"
  async function handleSubmit(e:any){
    e.preventDefault()
    setStatus("pending")
    StatusSetter.setPendingMsg("approving loan request")
    const payload = {
      loan_id: e.target.loan_id.value,
      sources: [
        { "Standard Chartered": e.target['Standard Chartered'].value }, 
        { "Mobile Money": e.target['Mobile Money'].value }
      ]
    }
    console.log({payload: payload})
    try{
      const res = await fetch(`${API}/approve-loan-request`, {
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
        handleLoanDelete(loan._id)
      }
      else {
        setStatus("error");
        StatusSetter.setErrMsg(data.msg || data.error)
      } 

    } catch(err){
      console.log(err)
      setStatus("error")
      StatusSetter.setErrMsg("An error occured")
    }
   
  }

  return (
    <Form onSubmit = {handleSubmit}>
      <fieldset className="faint p-3  rounded-1">
        <Form.Group className="mb-3" controlId = "location-standard-chartered">
          <Form.Label>Standard Chartered</Form.Label>
          <Form.Control name="Standard Chartered" type="number" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "location-Mobile-Money">
          <Form.Label>Mobile Money</Form.Label>
          <Form.Control name="Mobile Money" type="number" placeholder="" />
        </Form.Group>
        <input name="loan_id" hidden type="text" value = {loan._id} />
      </fieldset>
 

      <Button variant="primary" className="d-block ms-auto mt-4 mb-2" type="submit">
        Submit
      </Button>
    </Form>
  );
}

// function LoanDeleteModal(){

// }

// function LoanDeleteForm({loan}:any){

// }

function Pending({msg}:any){

  return (
    <div className="d-flex align-items-center justify-content-center rounded-1 backdrop pending">
      <div className="d-flex align-items-center py-3 px-5 bg-white shadow-lg">
        <Spinner animation="border" variant="primary" /> <span className="text-dark ms-4">{msg}</span>
      </div>
    </div>
    
  )
}

function Error({setStatus, msg}: any) {

  return (
    <div className="v-center d-flex justify-content-center align-items-center">
      <Alert className="shadow" variant="danger" onClose = {() => setStatus("flat")} dismissible>
        <p> { msg } </p>
      </Alert>
    </div>
  );
}

function Success({setStatus, msg}: any) {

  return (
    <div className="v-center d-flex justify-content-center align-items-center">
      <Alert className="shadow" variant="success" onClose = {() => setStatus("flat")} dismissible>
        <p> { msg } </p>
      </Alert>
    </div>
   
  );
}