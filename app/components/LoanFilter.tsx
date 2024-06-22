'use client';

import { useEffect, useRef } from 'react';
import {usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Row, Col,FormSelect, FormGroup, FormLabel } from 'react-bootstrap';
import styles from './search.module.css'
import { Accordion } from 'react-bootstrap';

export function LoanFilter({users}:{users:string[]}) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const keysArray = [...params.keys()];
  const { year, member, loan_status, sortBy, order, perPage } = Object.fromEntries(keysArray.map(key => [key, params.get(key)]));

  const validYears = ["2022", "2023", "2024"]
  const validMembers = users;
  const validStatus = ["Ended", "Ongoing"]
  const validSort = ['loan_amount', 'loan_date']
  const validOrder = ['1', '-1']
  const validPerPage = ["2", "5", "20", "50", "100", "500"]

  function handleParamChange(paramKey:string, paramValue:string) {
    const params = new URLSearchParams(searchParams);
    params.set(paramKey, paramValue);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }

  const accordionRef:any = useRef(null);

  useEffect(() => {
    
    function fireClickEvent(element: any){
      // Create a new click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true
        });
  
      // Dispatch the click event on the element
      element.dispatchEvent(clickEvent);
    }

    function handleClickOutside(event:any) {
      if (!accordionRef.current.contains(event.target)){
        const accordionButton = accordionRef.current.querySelector('.accordion-button');
        const isCollapsed = accordionButton.classList.contains('collapsed');
        if(!isCollapsed) fireClickEvent(accordionButton) //fire click event only when accordion is expanded
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Unbind the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);
  

  return (
    <div className='' ref = {accordionRef} >
      <Accordion className='position-relative' >
        <Accordion.Item className='position-absolute bg-white z-1 w-100'  eventKey="0">
          <Accordion.Header > <span className="fw-bold text-primary">Filter & Sort Loans</span> </Accordion.Header>
          <Accordion.Body className = 'shadow-sm bg-light' >
            <Row className = ' py-1 '>
              {/* Filter */}
              <Col className = " align-items-center" >
                <FormGroup className ='d-md-flex align-items-center  mb-3' controlId='year-filter' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Year</FormLabel>
                  <FormSelect defaultValue={ year && validYears.includes(year)? year: "" } onChange = {(e)=> handleParamChange('year', e.target.value)}  >
                    <option value = "" >All</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup className ='d-md-flex align-items-center  mb-3' controlId='status-filter' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Status</FormLabel>
                  <FormSelect defaultValue={ loan_status && validStatus.includes(loan_status)? loan_status: "" } onChange = {(e)=> handleParamChange('loan_status', e.target.value)}  >
                    <option value = "" >All</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Ended">Ended</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup className='d-md-flex align-items-center' controlId='member-filter'>
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Member</FormLabel>
                  <FormSelect defaultValue={ member && validMembers.includes(member)? member: "" } onChange = {(e)=> handleParamChange('member', e.target.value)}  >
                    <option value = "" >All</option>
                    {users.map((user, index) => {
                      return (
                        <option key = {index} value = {user} >{user}</option>
                      )
                    })}
                  </FormSelect> 
                </FormGroup>
              </Col>
        
              {/* Sort */}
              <Col  className = " align-items-center" >
                <FormGroup className ='d-md-flex align-items-center mb-3' controlId='sortby' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Sort By</FormLabel>
                  <FormSelect defaultValue ={ sortBy && validSort.includes(sortBy)? sortBy: "loan_date" } onChange = {(e)=> handleParamChange('sortBy', e.target.value)}  >
                    <option value = "loan_date" >Date</option>
                    <option value="loan_amount">Amount</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup className ='d-md-flex align-items-center mb-3' controlId='order' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Order</FormLabel>
                  <FormSelect defaultValue = { order && validOrder.includes(order)? order: "-1" }  onChange = {(e)=> handleParamChange('order', e.target.value)}  >
                    <option value = "-1" >
                      DESC 
                    
                    </option>
                    <option value="1">
                      ASC 
                      {/* <Arrow90degUp/> */}
                    </option>
                  </FormSelect>
                </FormGroup>
                <FormGroup className ='d-md-flex align-items-center' controlId='perpage' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Per page</FormLabel>
                  <FormSelect defaultValue={perPage && validPerPage.includes(perPage)? perPage : "20" } onChange = {(e)=> handleParamChange('perPage', e.target.value)}  >
                    <option  value = "2" > 2 </option>
                    <option  value = "5" > 5 </option>
                    <option  value = "20" > 20 </option>
                    <option  value = "50" >  50 </option>
                    <option  value = "100" >  100 </option>
                    <option  value = "500" >  500 </option>
                  </FormSelect>
                </FormGroup>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>   
    </div>
     
  );
}