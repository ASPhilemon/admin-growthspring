import { getUser } from './utils';
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export default function Home(
    NextRequest
: any) {

   //admin authorization
  //  const cookieStore = cookies()
  //  const token = cookieStore.get('jwt')?.value
  //  const user = getUser(token)
  //  if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
  //  if (user && user.isAdmin == "false") redirect('https://growthspringers.com')

  return (
    <div>
      <h3 className = " py-3 lead ms-4 " > Dashboard Overview </h3>
    </div>
      
  );
}

