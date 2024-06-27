import { Spinner } from "react-bootstrap"


export function Loader(){
  return(
    <div className="d-flex justify-content-center py-5 my-5">
      <Spinner variant="warning" className="loader" animation="border" />
    </div>
  )
}