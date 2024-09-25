import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchUserFromAPI } from './lib/apiUtils';

// function redirectToSignIn() {
//   const signinUrl = `${request.nextUrl.origin}/signin`;
//   console.log("User not found!")
//   return NextResponse.redirect(signinUrl);
// }

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token');
   //  const token = request.headers.get('Authorization')?.replace('Bearer ', ''); gormuyor server side localde oldugundan
    if (!token) {
      const signinUrl = `${request.nextUrl.origin}/signin`;
      return NextResponse.redirect(signinUrl);
    }

    const user = await fetchUserFromAPI(token.value) // alternatifler: token.value || "" ya da String(token.value) 

    if (!user) {
      const signinUrl = `${request.nextUrl.origin}/signin`;
      console.log("User not found!")
      return NextResponse.redirect(signinUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    const signinUrl = `${request.nextUrl.origin}/signin`;
    return NextResponse.redirect(signinUrl);
  }
}

export const config = {
  matcher: ['/tasks/:path*', '/profile/:path*', '/user/:path*'],
};
