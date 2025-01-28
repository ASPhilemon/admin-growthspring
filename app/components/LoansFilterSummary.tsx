"use client"

import { Table, Overlay, Button, Tooltip } from "react-bootstrap"
import { QuestionCircleFill } from "react-bootstrap-icons"
import { useRef, useState } from "react"


export function LoansFilterSummary({loans_summary}:any){

  const [overlays, setOverlays] = useState({loanCount: false, principal: false, interest: false, memberCount:false})
  const overlayRefs = useRef({loanCount: null, principal: null, interest: null, memberCount:null})

  function handleOverlays(overlay:any){
    setOverlays({...overlays, [overlay]: !overlays.principal})
  }

  return (
    <div className="bg-white filter-summary p-2 rounded-2" >
      <Table className="rounded-table mb-0" size="sm" responsive >
        <thead>
          <tr>
            <th>Loan Count
              <Button
                  ref = {(el:any)=>overlayRefs.current.loanCount = el}
                  className="px-1 border-0 rounded-2 py-0" variant="outline-secondary"
                  onClick= {()=>handleOverlays("loanCount")}
                >
                  <QuestionCircleFill size={15} />
              </Button>
              <Overlay rootClose = {true} onHide={()=>setOverlays({...overlays, loanCount: false})} target = {overlayRefs.current.loanCount} show={overlays.loanCount} placement="bottom">
                  <Tooltip className="d-flex align-items-center" >
                    A <div className="vr mx-2 fw-bolder bg-white"/> B <br/>
                    A: Total number of ongoing loans <br/> 
                    B: Total number of ended loans
                  </Tooltip>
              </Overlay>
            </th>
            <td> {loans_summary.ongoingLoansCount} <div className="vr mx-3 bg-dark"/> {loans_summary.endedLoansCount}  </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th> Principal (UGX)
              <Button
                ref = {(el:any)=>overlayRefs.current.principal = el}
                className="px-1 border-0 rounded-2 py-0" variant="outline-secondary"
                onClick= {()=>handleOverlays("principal")}
              >
                <QuestionCircleFill size={15} />
              </Button>
              <Overlay rootClose = {true} onHide={()=>setOverlays({...overlays, principal: false})} target = {overlayRefs.current.principal} show={overlays.principal} placement="bottom">
                  <Tooltip className="d-flex align-items-center" >
                    A <div className="vr mx-2 fw-bolder bg-white"/> B <br/>
                    A: Total principal <br/> 
                    B: Total principal left
                  </Tooltip>
              </Overlay>
            </th>
            <td> {Math.floor(loans_summary.totalPrincipal).toLocaleString()} <div className="vr mx-3 bg-dark"/> {Math.floor(loans_summary.principalLeft).toLocaleString()}  </td>
          </tr>
          <tr>
            <th>Interest (UGX)
              <Button
                ref = {(el:any)=>overlayRefs.current.interest = el}
                className="px-1 border-0 rounded-2 py-0" variant="outline-secondary"
                onClick= {()=>handleOverlays("interest")}
              >
                <QuestionCircleFill size={15} />
              </Button>
              <Overlay rootClose = {true} onHide={()=>setOverlays({...overlays, interest: false})} target = {overlayRefs.current.interest} show={overlays.interest} placement="bottom">
                  <Tooltip className="d-flex align-items-center">
                    A <div className="vr mx-2 fw-bolder bg-white"/> B <br/>
                    A: Total expected interest from ongong loans <br/>
                    B: Total interest from ended loans 
                  </Tooltip>
              </Overlay>              
            </th>
            <td>{Math.floor(loans_summary.expectedInterest).toLocaleString()} <div className="vr mx-3 bg-dark"/>{Math.floor(loans_summary.interestPaid).toLocaleString()}   </td>
        
          </tr>
          <tr className="border-bottom-none">
            <th>Member Count
              <Button
                ref = {(el:any)=>overlayRefs.current.memberCount = el}
                className="px-1 border-0 rounded-2 py-0" variant="outline-secondary"
                onClick= {()=>handleOverlays("memberCount")}
              >
                <QuestionCircleFill size={15} />
              </Button>
              <Overlay rootClose = {true} onHide={()=>setOverlays({...overlays, memberCount: false})} target = {overlayRefs.current.memberCount} show={overlays.memberCount} placement="bottom">
                  <Tooltip className="d-flex align-items-center">
                    A <div className="vr mx-2 fw-bolder bg-white"/>   B <div className="vr mx-2 fw-bolder bg-white"/> C <br/>
                    A: Number of members with atleast one (1) ongoing loan <br/> 
                    B: Number of members with atleast one (1) ended loan <br/> 
                    C: Number of members with atleast one (1) loan
                  </Tooltip>
              </Overlay>              
            </th>
            <td> {loans_summary.membersOngoingLoans.size} <div className="vr mx-3 bg-dark"/> {loans_summary.membersEndedLoans.size} <div className="vr mx-3 bg-dark"/> {loans_summary.members.size}</td>
          </tr>
        </tbody>
    </Table>
    </div>
  
  )
}