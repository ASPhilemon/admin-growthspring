import { Button } from "react-bootstrap"
import { getTotalDepositsCount, getDepositsByPage } from "../data/dbQueries"
import { Search } from "../components/search"


export default async function Deposits (){
  const searchFilter = {}
  const depositsCount = await getTotalDepositsCount(searchFilter)
  const deposits = await getDepositsByPage({...searchFilter, page: 1})
  
  return(
    <div>
      <div className="d-flex align-items-center py-3">
        <h5 className="me-4 mb-0" >Deposits</h5>
        <Button variant = 'primary' >Add Deposit + </Button>
      </div>
      
      <Search/>
      <p >
        ariko
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum voluptates minus assumenda fugit iure provident distinctio consectetur quidem dignissimos iusto mollitia dolores, aut tempora nisi molestiae quaerat omnis reprehenderit facere voluptatibus dicta maxime! Nostrum deleniti eligendi expedita impedit corporis natus. Voluptatem delectus molestias similique vel alias, repudiandae quaerat veritatis exercitationem.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus atque assumenda voluptatum consequuntur at facere animi, aut unde facilis explicabo ducimus dolor beatae cupiditate eius odit aperiam suscipit architecto dolore id voluptate veritatis perspiciatis odio vel asperiores? Possimus, labore minus?
        stephen
      </p>
    </div>
  )
}