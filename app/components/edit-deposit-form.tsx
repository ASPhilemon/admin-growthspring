"use client"

import { Row, Col, Form, FormLabel, FormSelect, FormGroup } from "react-bootstrap"
import { useFormStatus, useFormState } from "react-dom"
import { editDeposit } from "../deposits/actions"
import Link from "next/link"
import { useState } from "react"


export function EditDepositForm({deposit, users}:any){
  const [amount, setAmount] = useState(formatNumber(String(deposit.deposit_amount)))

  // Function to format number with thousands separator
  function formatNumber (num:any){
    return num.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Handle input change
  const handleChange = (e:any, setFunc:any) => {
    const formattedValue = formatNumber(e.target.value);
    setFunc(formattedValue);
  };

  const minDate = getMinimumDepositDate()
  const maxDate = getMaxDepositDate()


  let editDepositBind = editDeposit.bind(null, deposit)
  const [state, dispatch] = useFormState(editDepositBind, {error: null})

  return(
    <form action ={dispatch} >
      <Row className = "mb-2" >
        <FormLabel htmlFor="depositor_name" column xs={3} md={2} >
          Depositor
        </FormLabel>
        <Col xs={9} md={6}>
          <FormSelect readOnly defaultValue = {deposit.depositor_name} name = "depositor_name" id = "depositor_name" >
            {users.map((user:any, index:any) => {
              return (
                <option key = {index} value = {user} >{user}</option>
              )
            })}
          </FormSelect> 
        </Col>
    
      </Row>
      <Row className="mb-2">
        <FormLabel htmlFor="deposit_amount" column xs={3} md={2} >
          Amount
        </FormLabel>
        <Col xs={9} md={6}>
          <Form.Control value = {amount} onChange={(e)=>handleChange(e, setAmount)} type = "text"  name="deposit_amount" required id="deposit_amount" min={"10000"} />
        </Col>
      </Row>
      <Row>
        <FormLabel htmlFor ="deposit_date" column md={2} xs={3}>
          Date
        </FormLabel>
        <Col xs={9} md={6}>
          <Form.Control defaultValue = { formatDate(deposit.deposit_date) }  name="deposit_date" required  max ={maxDate} id="deposit_date" type="date" placeholder="Date of deposit" />
        </Col>
      </Row>
      <fieldset disabled = { !deposit.cashLocation} >
        <Row className="mt-2">
          <Col xs = {3} md = {2}>
            <Form.Label className="col-2">Cash Location</Form.Label>
          </Col>
          <Col xs = {9} md = {6}>
            <Form.Select defaultValue = {deposit.cashLocation} className="col-8" name="cash_location" required>
              <option selected hidden disabled value=""></option>
              <option value="Standard Chartered">Standard Chartered</option>
              <option value="Mobile Money">Mobile Money</option>
            </Form.Select>
          </Col>
        </Row>
      </fieldset>
      <Form.Group xs = {12} md = {8} as = {Col} className="mt-3" controlId="deposit-comment">
        <Form.Label>Comment</Form.Label>
        <Form.Control defaultValue={deposit.comment} name="comment" as="textarea" rows={3} />
      </Form.Group>
   
      <FormError message = {state} />
      <div className="col-md-8 d-flex mt-3">
        <Link className="btn  btn-secondary me-3 ms-auto px-2" href = "/deposits" > Cancel </Link>
        <SubmitButton />
      </div>
    </form>
  
  )

}

function SubmitButton(){
  const status = useFormStatus();
  return(
    <button disabled = {status.pending} type="submit" className="btn shadow-sm  btn-primary px-4">
      Save
    </button>
  )
}

function FormError(message: any){
  console.log(message)
  const status = useFormStatus();
  return (
  message.message.error? <p className='text-danger'> {message.message.error} </p> : ""
  )
}


function getMinimumDepositDate(){
  const minDate = new Date()
  minDate.setMonth(minDate.getMonth()-8)
  const year = minDate.getFullYear()
  const month = minDate.getMonth().toString().padStart(2, '0');
  const day = minDate.getDate().toString().padStart(2, '0');
  const minDateString = `${year}-${month}-${day}`
  return minDateString
}

function getMaxDepositDate(){
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const maxDateString = `${currentYear}-${currentMonth}-${day}`
  return maxDateString
}

function formatDate(date:any){
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`
}
