"use client"

import { Table, Breadcrumb, BreadcrumbItem , Placeholder} from "react-bootstrap"
import Link from "next/link";

export default function Page({params}:any) {


  return (
    <div className="px-3 px-md-5 py-3">
      <Breadcrumb>
        <BreadcrumbItem linkAs = {Link} href="/loans"> Loans </BreadcrumbItem>
        <BreadcrumbItem  active>Detail</BreadcrumbItem>
      </Breadcrumb>
      <h6 className="mb-3 fw-light">Loan Request Details</h6>
 
      <div className="d-md-flex">
        <div className="col-md-6">
          <Table borderless align="center" responsive  >
            <thead>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs = {12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs = {12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs ={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs = {12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12}/>
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
              <tr>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder animation="glow" >
                    <Placeholder className="rounded-1" xs={12} />
                  </Placeholder>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="px-md-4 col-md-6">
          <Placeholder className="mb-3 d-block" animation="glow">
            <Placeholder className="rounded-1" xs = {3}/>
          </Placeholder>
          <Placeholder animation="glow"className="d-block mb-2">
            <Placeholder className="rounded-1" xs = {12}/>
            <Placeholder className="rounded-1" xs = {12} />
          </Placeholder>
          <Placeholder className="d-block mb-2" animation="glow">
            <Placeholder className="rounded-1" xs = {12}/>
            <Placeholder className="rounded-1" xs = {12} />
          </Placeholder>
          <Placeholder className="d-block mb-2" animation="glow">
            <Placeholder className="rounded-1" xs = {12}/>
            <Placeholder className="rounded-1" xs = {12} />
          </Placeholder>
          <Placeholder className="d-block mb-2" animation="glow">
            <Placeholder className="rounded-1" xs = {12}/>
            <Placeholder className="rounded-1" xs = {12} />
          </Placeholder>
        </div>
      </div>
   
    </div>
  
  );
}

