//next imports
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
//react imports
//installed components imports
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from "react-bootstrap";
//custom components imports
import { ClientNavWrapper } from "./components/ClientNavWrapper";
import "./globals.css";
import { getUser } from "./utils";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrowthSpring | Admin",
  description: "GrowthSpring Admin Website",
};

export default function RootLayout({
  children
}: any) {

    //admin authorization
    const cookieStore = cookies()
    const token = cookieStore.get('jwt')?.value
    const user = getUser(token)
    if (!user) redirect('https://auth.growthspringers.com/signin?redirectURI=https://admin.growthspringers.com')
    if (user && user.isAdmin == "false") redirect('https://growthspringers.com/signin')
    let names = user.fullName.split(" ")
    let displayName = names[names.length -1 ]

  return (
    <html lang="en">
      <body className = {inter.className}>
        <div>
          <ClientNavWrapper adminName = { displayName} />
          <Col className="" lg = {{  offset: 3 }}  >
            {children}
          </Col>
        </div>
      </body>
    </html>
  );
}
