import Link from 'next/link'

const FooterHome = () =>{
    return (
<div className="bg-white">
    <div className="mx-auto w-full max-w-screen-xxl py-2 px-8">
      <hr className="my-4 border-lime-500 sm:mx-auto" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center ">© 2024 <Link href="https://flowbite.com/" className="hover:underline">Ideas Drone™</Link>. All Rights Reserved.
          </span>

      </div>
    </div>
    </div>
    )
    }
    
    export default FooterHome