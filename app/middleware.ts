import { NextResponse, NextRequest } from 'next/server'
//import { authenticate } from 'auth-provider'
 
export function middleware(request: NextRequest) {
  //const isAuthenticated = authenticate(request)
 
  // If the user is authenticated, continue as normal
  // if (isAuthenticated) {
  //   return NextResponse.next()
  // }
  //request.cookies.get('show-banner')
 
  // Redirect to login page if not authenticated
  //return NextResponse.redirect(new URL('/login', request.url))
  if (request.nextUrl.pathname.startsWith('/dash')) return NextResponse.redirect('https://growthspringers.com/test')

  return NextResponse.next()
}
 


// export const config = {
//   matcher: '/dashboard/:path*',
// }