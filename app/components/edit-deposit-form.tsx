"use client"


import { Row, Col, Form, FormLabel, FormSelect, FormGroup } from "react-bootstrap"
import { useFormStatus, useFormState } from "react-dom"
import { editDeposit } from "../deposits/actions"
import Link from "next/link"


export function EditDepositForm({deposit}:any){
  const minDate = getMinimumDepositDate()
  const maxDate = getMaxDepositDate()

  const users = [
    'Akampurira David', 'Ariko Stephen Philemon', 'Arinaitwe Solomon',
    'Atim Dyna Loy', 'Atuhairwe Mary', 'Babirye Nicolatte',
    'Chesuro Benerd Boris', 'Club Fund', 'Kamya Timothy',
    'Kawuma Andrew', 'Mwebe Blaise Adrian', 'Nakato Leonora',
    'Nuwagira Noble', 'Omodo Joshua Deo', 'Paul Omare',
    'Pule Flavia', 'Rwothungeo Rogers', 'Sendikwanawa Jasper',
    'Sharon Natukunda', 'Wilson Mutebi'
  ]
  let editDepositBind = editDeposit.bind(null, deposit)
  const [state, dispatch] = useFormState(editDepositBind, {error: null})

  return(
    <form action ={dispatch} >
      <Row className = "mb-2" >
        <FormLabel htmlFor="depositor_name" column xs={3} md={2} >
          Depositor
        </FormLabel>
        <Col xs={9} md={6}>
          <FormSelect defaultValue = {deposit.depositor_name} name = "depositor_name" id = "depositor_name" >
            <option value = "" >Select depositor</option>
            {users.map((user, index) => {
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
          <Form.Control defaultValue = {deposit.deposit_amount}  name="deposit_amount" required id="deposit_amount" min={"10000"} type="number" placeholder="Amount" />
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
      <h6 className="mt-4 mb-3 fw-bolder text-primary" >Cash Locations </h6>
      <fieldset disabled = { !deposit.cashLocations } >
        <Row>
          <Col xs={6} md={4}>
            <Form.Group className="mb-3" controlId="sc">
              <Form.Label>Standard Chartered</Form.Label>
              <Form.Control defaultValue = {deposit.cashLocations?.standardChartered} name="standardChartered" type="number" />
          </Form.Group>
          </Col>
          <Col xs={6} md={4}>
            <Form.Group className="mb-3" controlId="unit-trust">
              <Form.Label>Unit Trust</Form.Label>
              <Form.Control defaultValue = {deposit.cashLocations?.unitTrust} name="unitTrust" type="number" />
          </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={4}>
            <Form.Group className="mb-3" controlId="adminAndrew">
              <Form.Label>Admin Andrew</Form.Label>
              <Form.Control defaultValue = {deposit.cashLocations?.adminAndrew} name="adminAndrew" type="number" />
          </Form.Group>
          </Col>
          <Col xs={6} md={4}>
            <Form.Group className="mb-3" controlId="adminRogers">
              <Form.Label> Admin Rogers </Form.Label>
              <Form.Control defaultValue = {deposit.cashLocations?.adminRogers} name="adminRogers" type="number" />
          </Form.Group>
          </Col>
        </Row>
      </fieldset>
   
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