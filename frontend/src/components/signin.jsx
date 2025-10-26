import React, { useState } from 'react'
import googleIcon from '../imgs/google.png'
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom'
import useSignin from '../hooks/useSignin'
import { authWithGoogle } from '../common/firebase'
import useGoogleAuth from '../hooks/useGoogleAuth'
import { useAuthContext } from '../context/AuthContext'
// import { useHistory } from "react-router-dom";
function Signin({type}) {
    const [input,setInput]=useState({
        email:"",
        password:""
    })

    const navigate=useNavigate()
    const {loading,Signin}=useSignin()
    const {googleAuth}=useGoogleAuth()
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const data=await Signin(input)
        if(data){
            navigate('/',{replace:true})
            window.location.reload(false)
        }
    
        
    }

    const handleGoogleAuth=async(e)=>{
        e.preventDefault()
        const user=await authWithGoogle()
        const token= await user.accessToken
        const res=await googleAuth(token)
        if(res){
            navigate('/',{replace:true})
            window.location.reload(false)
        }
        
        
        
    }
    return (
        <section className='h-cover flex items-center justify-center'>
            <form onSubmit={handleSubmit} style={{ height: "600px" }} className='w-[80%] max-w-[400px]'>
            <h1 style={{fontFamily:"serif"}} className='text-4xl capitalize text-center mb-20'>
                {type === 'signup'? 'Welcome Back!!' : 'Join Us Today!!'}
            </h1>
            <div className='relative w-[100%} mb-6'>
                <label className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                    <input value={input.email} onChange={(e)=>setInput({...input,email:e.target.value})} style={{ fontSize: "16px" }} type="email" name="email" placeholder="Email" id="email" className="grow" />
                </label>
            </div>
            <div className='relative w-[100%} mb-6'>
                <label className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                    <input value={input.password} onChange={(e)=>setInput({...input,password:e.target.value})}  style={{ fontSize: "16px" }} type="password" name="name" placeholder="Password" id="password" className="grow" />
                </label>
            </div>
            <button className='btn-light center px-8 mt-14'>
            {loading?<span className="loading loading-dots loading-lg"></span>:'Sign In'}

            </button>
            <div className='relative w-full flex items-center gap-2 my-8 opacity-10 text-black uppercase font-bold'>
                <hr className='w-1/2 border-white'></hr>
                <p className='text-white'>Or</p>
                <hr className='w-1/2 border-white'></hr>

            </div>
            <button onClick={handleGoogleAuth} className='btn-dark flex border-b border-dark-grey items-center justify-center gap-4 md-max:w-[100%] center'>
                <img src={googleIcon} className='w-6' />
                Continue With Google
            </button>
            <Link to={'/signup'}>
                <p className='text-center pt-5 text-xl text-white'>Don't have an account? <span className='font-medium text-2xl'>Sign Up</span></p>
            </Link>
        </form>
        </section>
        

    )
}

export default Signin
