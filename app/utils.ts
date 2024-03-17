
import jwt from 'jsonwebtoken'

export const generatePagination = (totalPages: number, currentPage: number, prevPage: number) => {


  //if currentPage < 1, set currentPage = 1
  currentPage = currentPage < 1 ? 1 : currentPage;

  //if currentPage > totalPages, return empty array
  if (currentPage > totalPages) return []

  // If the total number of pages is 6 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 6) return  Array.from({ length: totalPages }, (_, i) => i + 1)
   
  //if current page is among the first 3 pages
  if (currentPage <= 3) return [
    1,
    2,
    3,
    4,
    Math.floor((totalPages + 4) /2 ),
    totalPages
  ]

 //if current page is among the last 3 pages
  if (currentPage >= totalPages - 2) return [
    1,
    Math.ceil((totalPages - 2)/2),
    totalPages - 3,
    totalPages - 2,
    totalPages - 1,
    totalPages
  ]
  
//the rest
  const isFrontSeek = currentPage > prevPage
  return [
    1,
    isFrontSeek? Math.ceil((currentPage + 1)/2) : Math.ceil(currentPage /2),
    isFrontSeek? currentPage: currentPage -1,
    isFrontSeek? currentPage + 1: currentPage,
    isFrontSeek? Math.floor((currentPage + totalPages + 1)/2) : Math.floor((currentPage + totalPages )/2),
    totalPages]
}



export function getUser(token: any) {
  const user: any = verifyToken(token)
  if (user) return user
  return null
}


function verifyToken(token: any){
  try {
    const { id, fullName , isAdmin} : any = jwt.verify(token, 'top_secret_xyz123')
    return {id, fullName, isAdmin}
  } catch (err) {
    console.log(err)
    return null
  }
}
