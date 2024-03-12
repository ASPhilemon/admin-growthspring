'use client';
import {usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Row, Col,FormSelect, FormGroup, FormLabel } from 'react-bootstrap';
import { Arrow90degDown, Arrow90degUp } from 'react-bootstrap-icons';
import styles from './search.module.css'
import { Accordion, AccordionBody } from 'react-bootstrap';

export function Search() {

  const users = [
    'Akampurira David', 'Ariko Stephen Philemon', 'Arinaitwe Solomon',
    'Atim Dyna Loy', 'Atuhairwe Mary', 'Babirye Nicolatte',
    'Chesuro Benerd Boris', 'Club Fund', 'Kamya Timothy',
    'Kawuma Andrew', 'Mwebe Blaise Adrian', 'Nakato Leonora',
    'Nuwagira Noble', 'Omodo Joshua Deo', 'Paul Omare',
    'Pule Flavia', 'Rwothungeo Rogers', 'Sendikwanawa Jasper',
    'Sharon Natukunda', 'Wilson Mutebi'
  ]

  const months = [
    {
      month: "Jan",
      value: 1
    },
    {
      month: "Feb",
      value: 2
    },
    {
      month: "Mar",
      value: 3
    },
    {
      month: "Apr",
      value: 4
    },
    {
      month: "May",
      value: 5
    },
    {
      month: "Jun",
      value: 6
    },
    {
      month: "Jul",
      value: 7
    },
    {
      month: "Aug",
      value: 8
    },
    {
      month: "Sep",
      value: 9
    },
    {
      month: "Oct",
      value: 10
    },
    {
      month: "Nov",
      value: 11
    },
    {
      month: "Dec",
      value: 12
    }
  ]

  const currentMonth = new Date().getMonth() + 1;

  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  //   function handleParamChange(paramKey:string, paramValue:string) {
  //   const params = new URLSearchParams(searchParams);
  //   params.set(paramKey, paramValue);
  //   params.set('currentPage', '1');
  //   replace(`${pathname}?${params.toString()}`);
  // }

  return (
      <Accordion className='position-relative' >
        <Accordion.Item className='position-absolute w-100'  eventKey="0">
          <Accordion.Header >Filter & Sort Deposits</Accordion.Header>
          <Accordion.Body >
            <Row className = ' py-1 '>
              {/* Filter */}
              <Col className = " align-items-center" >
                <FormGroup className ='d-md-flex align-items-center  mb-3' controlId='year-filter' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Year</FormLabel>
                  <FormSelect  >
                    <option value = "" >All</option>
                    <option selected value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </FormSelect>
                </FormGroup>
     
                <FormGroup className = 'd-md-flex align-items-center mb-3' controlId='month-filter' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Month</FormLabel>
                  <FormSelect  >
                    <option value = "" >All</option>
                    {months.map((month, index) => {
                      return (
                        <option selected = {month.value == currentMonth} key = {index} value = {month.value} >{month.month}</option>
                      )
                    })}
                  </FormSelect>
                </FormGroup>
               
                <FormGroup className='d-md-flex align-items-center' controlId='member-filter'>
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Member</FormLabel>
                  <FormSelect  >
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
                  <FormSelect  >
                    <option selected value = "date" >Date</option>
                    <option value="amount">Amount</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup className ='d-md-flex align-items-center mb-3' controlId='order' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Order</FormLabel>
                  <FormSelect   >
                    <option selected value = "-1" >
                      DESC 
                      {/* <Arrow90degDown/> */}
                    </option>
                    <option value="1">
                      ASC 
                      {/* <Arrow90degUp/> */}
                    </option>
                  </FormSelect>
                </FormGroup>
                <FormGroup className ='d-md-flex align-items-center' controlId='perpage' >
                  <FormLabel className={`me-md-2 ${styles.formLabel}`} >Per page</FormLabel>
                  <FormSelect  >
                    <option selected  value = "1" > 2 </option>
                    <option  value = "5" > 5 </option>
                    <option  value = "10" > 10 </option>
                    <option  value = "50" >  50 </option>
                  </FormSelect>
                </FormGroup>
                <div className="vr me-2 d-none d-lg-block text-white"></div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>    
  );
}


