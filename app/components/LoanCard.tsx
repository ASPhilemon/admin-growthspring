"use client"


import { Card, Overlay, Tooltip, Alert, Form, CardBody, Button, Modal, Spinner } from "react-bootstrap";
import { Info, Check2, Clock } from "react-bootstrap-icons";
import Link from "next/link";
import {Badge} from "react-bootstrap";
import { useState, useRef } from "react";

export function LoanCard({loan}: any){
  const API = "https://api.growthspringers.com"
  let imgSrc = loan.borrower.photoURL
  imgSrc = imgSrc? `${API}/${imgSrc}`: "/img/defaultPhoto.jpg"

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
        <div className="d-flex mb-2 align-items-center header pb-3"  >
          <img
            width={30} height={30}
            src={imgSrc} alt={loan.borrower_name}
            className="rounded-circle shadow-sm  me-3"
          />
          <h6 className="mb-0 depositor-name me-2" > {loan.borrower_name} </h6>
          { loanStatus == "Ended" && <Badge className="ms-auto me-2 py-1 px-2" pill bg="success">Ended <Check2 className="ms-1" size={16}/> </Badge>}
          {  loanStatus == "Ongoing" && <Badge className="ms-auto me-2 py-1 px-2" pill bg="secondary">Ongoing <Clock className="ms-1" size={16}/> </Badge>}
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div>
            <h6 className="mb-1 fw-bolder mb-2">UGX {loan.loan_amount.toLocaleString()}</h6>
            <p className=" mb-3 fw-light large ">{getDateString(loan.loan_date)}</p>
          {  loanStatus == "Ongoing" && 
          <div>
          <p className="fw-light small "> Total Payment Left: </p> 
          <p style={{color: 'blue'}} className="fw-bold small ">UGX {Math.ceil(parseInt(loan.principal_left, 10) + getInterestAndPoints(loan).interest_accrued).toLocaleString()}</p>  
          </div>
           }
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
  const [amount, setAmount] = useState('')

  // Function to format number with thousands separator
  const formatNumber = (num:any) => {
    return num.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle input change
  const handleChange = (e:any, setFunc:any) => {
    const formattedValue = formatNumber(e.target.value);
    setFunc(formattedValue);
  };

  const API =  "https://api.growthspringers.com"
  async function handleSubmit(e:any){
    e.preventDefault()
    setStatus("pending")
    const payload = {
      loan_id: e.target.loan_id.value,
      payment_amount: parseFloat(e.target.payment_amount.value.replace(/,/g, '')),
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
    const day = minDate.getDate().toString().padStart(2, '0');
    const minDateString = `${year}-${month}-${day}`
    return minDateString
  }
  
  function getMaxPaymentDate(){
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const maxDateString = `${currentYear}-${currentMonth}-${day}`
    return maxDateString
  }

  return (
    <Form onSubmit = {handleSubmit}>
      <fieldset className="faint p-3  rounded-1">
        <Form.Group className="mb-3" controlId = "payment-amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control value = {amount} onChange={(e)=>handleChange(e, setAmount)} name="payment_amount" required type="text" placeholder="" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "payment-date">
          <Form.Label>Date</Form.Label>
          <Form.Control max = {getMaxPaymentDate()} min = {getMinPaymentDate()} name="payment_date" required type="date" />
        </Form.Group>
        <Form.Group className="mb-3" controlId = "payment-cash-location">
          <Form.Label>Cash Location</Form.Label>
          <Form.Select name="payment_location" required aria-label="Default select example">
            <option selected disabled hidden value =''></option>
            <option value="Standard Chartered">Standard Chartered</option>
            <option value="Mobile Money">Mobile Money</option>
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
        <Spinner animation="border" variant="secondary" /> <span className="text-dark ms-4">processing payment ...</span>
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


function getInterestAndPoints(loan:any){
  let constants = {
    max_lending_rate: 20,
    min_lending_rate: 12,
    annual_tax_rate: 20,
    max_credits: 20,
    min_discount: 25,
    discount_profit_percentage: 15,
    loan_multiple: 5,
    loan_risk: 30,
    members_served_percentage: 25,
    monthly_lending_rate: 2,
    one_point_value: 1000
  }
  let loan_finding = loan
  let interest_accrued = 0;
  let points_accrued =  0;

    if (loan_finding.loan_status == "Ongoing") {
    const loanYear = loan_finding.loan_date.getFullYear();
        const thisYear = new Date().getFullYear();
        let points_balance = 0;
        let points_spent = loan_finding.points_spent;
        let loan_duration = loan_finding.loan_duration;
        let remainder = getDaysDifference(loan_finding.loan_date, new Date()) % 30;
        let current_loan_duration = remainder < 0.24 ? Math.trunc(getDaysDifference(loan_finding.loan_date, new Date()) / 30): Math.ceil(getDaysDifference(loan_finding.loan_date, new Date()) / 30);    
        let point_days = Math.max(0, Math.min(12, current_loan_duration) - 6) + Math.max(18, current_loan_duration) - 18;
        let running_rate = constants.monthly_lending_rate * (current_loan_duration - point_days);
        let last_payment_duration = getDaysDifference(loan_finding.loan_date, loan_finding.last_payment_date) % 30 < 0.24 ? Math.trunc(getDaysDifference(loan_finding.loan_date, loan_finding.last_payment_date) / 30): Math.ceil(getDaysDifference(loan_finding.loan_date, loan_finding.last_payment_date) / 30);
        let current_principal_duration = current_loan_duration - last_payment_duration;
        //code below doesn't cater for points usage for latest loans
        let pending_amount_interest = loanYear == thisYear ? constants.monthly_lending_rate * current_principal_duration * loan_finding.principal_left / 100: running_rate * loan_finding.principal_left / 100;
        points_accrued = constants.monthly_lending_rate * point_days * loan_finding.principal_left / 100000;
        let payment_interest_amount = 0;   
        let totalPayments = 0;

        if (loan_finding.payments) {
            loan_finding.payments.forEach((payment: { payment_date: Date | undefined; payment_amount: number; }) => {
                let duration = (getDaysDifference(loan_finding.loan_date, payment.payment_date) % 30) / 30 < 0.24 ? Math.trunc(getDaysDifference(loan_finding.loan_date, payment.payment_date) / 30): Math.ceil(getDaysDifference(loan_finding.loan_date, payment.payment_date) / 30);
                let point_day = Math.max(0, Math.min(12, duration) - 6) + Math.max(18, duration) - 18;         
                let payment_interest = constants.monthly_lending_rate * (duration - point_day) * payment.payment_amount / 100;
                points_accrued += constants.monthly_lending_rate * point_day * payment.payment_amount / 100000;
                payment_interest_amount += payment_interest;
                totalPayments += payment.payment_amount;
            })
        }

        let msg = '';
        let loan_status = loan_finding.loan_status;
        //console.log(remainder, running_rate, pending_amount_interest);

        interest_accrued = loanYear == thisYear ? pending_amount_interest : pending_amount_interest + payment_interest_amount;
        interest_accrued = interest_accrued == 0 ? constants.monthly_lending_rate * loan_finding.principal_left / 100 : interest_accrued;
  }
  return {interest_accrued, points_accrued}
}

//GET_DIFFERENCE_BETWEEN_DATES
function getDaysDifference(earlierDate:any, laterDate = new Date()) {
  const firstPeriod = new Date(earlierDate);
  const secondPeriod = new Date(laterDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = secondPeriod.getTime() - firstPeriod.getTime();
  const daysApart = Math.floor(timeDifference / millisecondsPerDay);
  return daysApart;
}