import React from 'react'
import ErrorPage404 from '../imgs/404.png'
import { Link } from 'react-router-dom'
import logo from '../imgs/logo.svg'
const ErrorPage = () => {
    return (
        <section className='h-cover relative p-10 flex flex-col items-center   gap-20 text-center'>
            <img src={ErrorPage404} className='select-none border-2 border-dark-grey w-72 aspect-square object-cover rounded-sm'/>
            <h1 className='text-4xl leading-7'>Page Not Found</h1>
            <p className='text-xl '>The Page you are looking for does not exist. <Link className='underline' to={'/'}> Back to Homepage</Link></p>
            <div className='mx-auto'>
                <img src={logo} alt="" className='w-20 block mx-auto object-contain select-none'/> 
                <h1 className='mt-2 mb-2 text-2xl'>Blogify</h1>
                <p className=' text-dark-grey'>Read millions of stories around the world</p>

            </div>
        </section>
    )
}

export default ErrorPage
