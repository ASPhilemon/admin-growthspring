import { cookies } from 'next/headers'
import Image from 'next/image'
 
export default function Profile() {
  // const cookieStore = cookies()
  // const token = cookieStore.get('token')
  const user = {
    fullName: 'Ariko Stephen Phlemon',
  }
  const displayName = user.fullName.split(' ')[0]
  
  return (
    <div>
      <Image
        src="/img/admin-logo.jpg"
        width={80}
        height={80}
        className='rounded-circle me-2'
        alt="Admin profile logo"
      />
      <span> {displayName} </span>
    </div>

  )
}