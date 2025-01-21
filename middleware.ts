import * as jose from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest){
  const user = await getUser()
  if (!user) return NextResponse.redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
  if (user.isAdmin ==="false") return NextResponse.redirect('https://auth.growthspringers.com/signin?redirectURI=https://growthspringers.com')

  let reqHeaders = new Headers(req.headers)
  reqHeaders.set("user-id", user.id)
  reqHeaders.set("user-name", user.fullName)

  return NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  }); 
}

async function getUser(){
  const token = cookies().get('jwt')?.value
  if (!token) return null
  try{
    const {id, fullName, isAdmin} : any = (await jose.jwtVerify(token, new TextEncoder().encode('top_secret_xyz123') )).payload
    
    return {id, fullName, isAdmin}
  } catch(err){
    console.log(err)
    return null
  }
}
