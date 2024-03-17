import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
 
export function middleware(request: NextRequest) {

  const token = request.cookies.get('jwt')
  const user =  getUser(token)
  if (user && !user.isAdmin) return NextResponse.redirect( new URL( 'https://auth.growthspringers.com/signin'))
  if (!user) return NextResponse.redirect( new URL( 'https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com'))

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-fullName', user.fullName)
  requestHeaders.set('x-userId', user.id)
 
  return NextResponse.next()
}
 



function getUser(token: any) {
  const user: any = verifyToken(token)
  if (user) return user
  return null
  
}


function verifyToken(token: any){
  try {
    const { id, fullName , isAdmin} : any = jwt.verify(token, process.env.SECRET || 'top_secret_xyz123')
    return {id, fullName, isAdmin}
  } catch (err) {
    return null
  }
}
