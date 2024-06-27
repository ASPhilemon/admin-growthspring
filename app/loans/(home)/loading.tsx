"use client"

import { Placeholder, Card, CardBody, PlaceholderButton } from "react-bootstrap";

export default function Loading(){
  return(
    <div className="px-md-5 px-3">
      <div className="d-flex align-items-center py-3">
        <Placeholder className = "me-3 col-12 col-md-4" as = "div" animation="glow" >
          <Placeholder className="me-2 rounded-1 py-3"  xs = {3}/>
          <PlaceholderButton size="sm" className = "py-1" variant="primary" xs = {3}/>
        </Placeholder>
      </div>
      <Placeholder animation="glow" >
        <Placeholder className="py-3 pb-4 mb-3 rounded-1" xs = {12}/>
      </Placeholder>
      
      <div>
        <div className="loan-cards p-2 rounded-2">
          <LoanCardSkeleton/>  
          <LoanCardSkeleton/> 
          <LoanCardSkeleton/> 
        </div>
      </div>
  </div>
    
  )
}


function LoanCardSkeleton(){
  return(
    <Card className="mb-2 loan-card border-0 " >
      <CardBody>
        <div className="d-flex mb-5 align-items-center header pb-3"  >
          {/* avatar */}
          <Placeholder animation="glow" >
            <Placeholder xs ={0} className = "p-3 rounded-circle me-2" />
          </Placeholder>
          <Placeholder className = "me-2 col-6" animation="glow" >
            <Placeholder className="rounded-pill"  xs = {12} />
          </Placeholder>
          <Placeholder className = "ms-auto col-5" animation="glow" >
            <Placeholder xs={7} className = "ms-auto me-3 d-block rounded-pill"/>
          </Placeholder>
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <div className="w-75">
            <Placeholder xs={12} animation="glow">
              <Placeholder xs={6} className = "mb-3 rounded-pill d-block"/>
              <Placeholder xs={6} className = "mb-2 rounded-pill d-block"/>
            </Placeholder>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center w-25 ms-auto justify-content-end" >
            <Placeholder xs={7} className="me-2" animation="glow">
              <PlaceholderButton xs={12} variant="primary" />
            </Placeholder>
            <Placeholder xs={5} animation="glow">
              <PlaceholderButton xs={12} variant="primary" />
            </Placeholder>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}