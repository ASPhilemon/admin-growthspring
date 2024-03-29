"use client"

import { Card, CardBody, Placeholder, CardTitle} from "react-bootstrap"


function DepositSkeleton(){
  return(
    <Card className="mb-2 rounded-1 skeleton placeholder-glow shadow-sm  " >
      <CardBody className = "">
        <div className="d-flex mb-5 align-items-center border-bottom pb-3 border-opacity-10"  >
          {/* avatar */}
          <div style = {{width: "30px", height: "30px"}} className="placeholder rounded-circle bg-dark-subtle shadow-sm  me-3">
          </div>
          <div className="name-skel placeholder rounded-pill"></div>
    
        </div>
        <div className="d-flex align-items-end justify-content-between">
          <div className = "mb-2">
            <div className="amount-skel placeholder d-block mb-3 rounded-pill"></div>
            <div className="date-skel placeholder rounded-pill"></div>
          </div>

          {/* icons */}
          <div className="d-flex align-items-center mb-2" >
            <div className="icon-skel placeholder  rounded-circle me-2 me-md-4"></div>
            <div className="icon-skel placeholder  rounded-circle  me-2 me-md-4 "></div>
            <div className="icon-skel placeholder  rounded-circle"></div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function DepositsSkeleton(){
  return (
    <div>
      <DepositSkeleton/>
      <DepositSkeleton/>
      <DepositSkeleton/>
    </div>
  )
}