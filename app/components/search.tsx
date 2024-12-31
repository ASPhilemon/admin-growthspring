'use client';

import { useEffect, useRef } from 'react';
import {usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Row, Col,FormSelect, FormGroup, FormLabel } from 'react-bootstrap';
import styles from './search.module.css'
import { Accordion } from 'react-bootstrap';

export function Search({users}:{users:string[]}) {

  const months = [
    {
      month: "Jan",
      value: "1"
    },
    {
      month: "Feb",
      value: "2"
    },
    {
      month: "Mar",
      value: "3"
    },
    {
      month: "Apr",
      value: "4"
    },
    {
      month: "May",
      value: "5"
    },
    {
      month: "Jun",
      value: "6"
    },
    {
      month: "Jul",
      value: "7"
    },
    {
      month: "Aug",
      value: "8"
    },
    {
      month: "Sep",
      value: "9"
    },
    {
      month: "Oct",
      value: "10"
    },
    {
      month: "Nov",
      value: "11"
    },
    {
      month: "Dec",
      value: "12"
    }
  ]

  const currentMonth = new Date().getMonth() + 1;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const keysArray = [...params.keys()];
  const { year, month, member, sortBy, order, perPage } = Object.fromEntries(keysArray.map(key => [key, params.get(key)]));

  const validMonths = months.map((month)=>month.value)
  const validYears = ["2022", "2023", "2024", "2025"]
  const validMembers = users;
  const validSort = ['deposit_amount', 'deposit_date']
  const validOrder = ['1', '-1']
  const validPerPage = ["2", "5", "20", "50", "100", "500"]

  function handleParamChange(paramKey:string, paramValue:string) {
    const params = new URLSearchParams(searchParams);
    params.set(paramKey, paramValue);
    params.set('currentPage', '1');
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
          <Accordion.Header > <span className="fw-bold text-primary">Filter & Sort Deposits</span> </Accordion.Header>
          <Accordion.Body className = 'shadow-sm bg-light' >
            <Row className = ' py-1 '>
              {/* Filter */}
              <Col className = " align-items-center" >
                <FormGroup className ='d-md-flex align-items-center  mb-3' controlId='year-filter' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Year</FormLabel>
                  <FormSelect defaultValue={ year && validYears.includes(year)? year: "all" } onChange = {(e)=> handleParamChange('year', e.target.value)}  >
                    <option value = "all" >All</option>
                    <option value="2025">2024</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </FormSelect>
                </FormGroup>
     
                <FormGroup className = 'd-md-flex align-items-center mb-3' controlId='month-filter' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Month</FormLabel>
                  <FormSelect defaultValue={ month && validMonths.includes(month)? month: "all" } onChange = {(e)=> handleParamChange('month', e.target.value)}  >
                    <option value = "all" >All</option>
                    {months.map((month, index) => {
                      return (
                        <option key = {index} value = {month.value} >{month.month}</option>
                      )
                    })}
                  </FormSelect>
                </FormGroup>
               
                <FormGroup className='d-md-flex align-items-center' controlId='member-filter'>
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Member</FormLabel>
                  <FormSelect defaultValue={ member && validMembers.includes(member)? member: "all" } onChange = {(e)=> handleParamChange('member', e.target.value)}  >
                    <option value = "all" >All</option>
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
                  <FormSelect defaultValue ={ sortBy && validSort.includes(sortBy)? sortBy: "deposit_date" } onChange = {(e)=> handleParamChange('sortBy', e.target.value)}  >
                    <option value = "deposit_date" >Date</option>
                    <option value="deposit_amount">Amount</option>
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


//<ArrowUp color="#ff33ff" size={96} />