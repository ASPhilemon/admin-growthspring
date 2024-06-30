"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { Form, Button, Alert, Spinner} from "react-bootstrap"

export function AddRequest({users}:any){
  const [formStatus, setFormStatus] = useState("input")
  const [error, setError] = useState("")

  return(
    <div className="col-md-8">
      <RequestAddForm error = {error} formStatus = {formStatus} users = {users} setFormStatus = {setFormStatus} setError = {setError} />
    </div>
  )

}


export function RequestAddForm({users, setFormStatus, setError, error, formStatus}: any){

  const router = useRouter()
  const [loanAmount, setLoanAmount] = useState('')

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
    setFormStatus("pending")
    const payload = {
      borrower_name_id: e.target.borrower_name_id.value,
      loan_amount: parseFloat(e.target.loan_amount.value.replace(/,/g, '')),
      loan_duration: e.target.loan_duration.value,
      earliest_date: e.target.loan_date.value,
      latest_date: e.target.loan_date.value,
    }
    console.log({payload: payload})
    try{
      const res = await fetch(`${API}/initiate-request`, {
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
        router.push("/loans/requests")
        router.refresh()
      }
      else {
        setFormStatus("error")
        setError(data.msg)
      } 

    } catch(err){
      console.log(err)
      setFormStatus("error")
      setError("An error has occured")
    }
   
  }

  function getMinDate(){
    const minDate = new Date()
    const year = minDate.getFullYear()
    const month = (minDate.getMonth() + 1).toString().padStart(2, '0');
    const day = minDate.getDate()
    const minDateString = `${year}-${month}-${day}`
    return minDateString
  }
  
  function getMaxDate(){
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate()+120)
    const currentYear = maxDate.getFullYear()
    const currentMonth = (maxDate.getMonth() + 1).toString().padStart(2, '0');
    const day = maxDate.getDate()
    const maxDateString = `${currentYear}-${currentMonth}-${day}`
    return maxDateString
  }

  return(
    <Form onSubmit = { handleSubmit }>
      <fieldset className="faint p-3 position-relative rounded-1">
        <Form.Group className="mb-3" controlId = "borrower">
          <Form.Label>Borrower</Form.Label>
          <Form.Select required name ="borrower_name_id" >
            <option disabled hidden selected value=""></option>
            {
              users.map((user:any)=>(
                <option key = {user._id} value = {user._id}> {user.fullName} </option>
              ))
            }
          </Form.Select>
        </Form.Group>

        <Form.Group className = "mb-3 " controlId = "loan-amount">
          <Form.Label>Loan Amount</Form.Label>
          <Form.Control value={loanAmount} onChange={(e)=>handleChange(e, setLoanAmount)} name="loan_amount" type="text" required />
        </Form.Group>

        <Form.Group className = "mb-3 " controlId = "loan-duration">
          <Form.Label>Loan Duration</Form.Label>
          <Form.Control min={1} max={24} name="loan_duration" type="number" required />
        </Form.Group>

        <Form.Group className = "mb-3 " controlId = "loan-date">
          <Form.Label>Loan Date</Form.Label>
          <Form.Control max = {getMaxDate()} min = {getMinDate()} type = "date" name="loan_date" required />
        </Form.Group>

        {formStatus == "pending" && <RequestPending/>}
        {formStatus == "error" && <RequestError setFormStatus = {setFormStatus} error = {error} />}

      </fieldset>
      <Button variant = "primary" className="d-block ms-auto mt-4 mb-2" type = "submit">
        Submit
      </Button>
    </Form>
  )

}

function RequestPending(){

  return (
    <div className="d-flex align-items-center justify-content-center rounded-1 backdrop pending">
      <div className="d-flex align-items-center py-3 px-5 bg-white shadow-lg rounded-1">
        <Spinner animation="border" variant="primary" /> <span className="text-dark ms-4">Adding loan request ...</span>
      </div>
    </div>
    
  )
}

function RequestError({setFormStatus, error}: any) {

    return (
      <div className="v-center d-flex justify-content-center align-items-center">
        <Alert className="shadow" variant="danger" onClose = {() => setFormStatus("input")} dismissible>
          <p> {error} </p>
        </Alert>
      </div>
     
    );
}