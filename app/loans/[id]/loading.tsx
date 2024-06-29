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
      <h6 className="mb-3 fw-bold">Summary</h6>
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
          </tbody>
        </Table>
      </div>
      <h6 className="mb-3 mt-4 fw-bold">Payment History</h6>
      <div className="col-md-6">
        
          <Table className="align-middle" responsive borderless>
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
                    <Placeholder className="rounded-1" xs = {12} />
                  </Placeholder>
                </td>
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
                    <Placeholder className="rounded-1" xs = {12} />
                  </Placeholder>
                </td>
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
                    <Placeholder className="rounded-1" xs = {12} />
                  </Placeholder>
                </td>
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
         
          </Table> :
      </div>

    </div>
  
  );
}

