import React from 'react'
import AnimationWrapper from '../common/PageAnimation'
import { LuFileEdit } from "react-icons/lu";
import {Link, Outlet} from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext';
import { CgProfile } from "react-icons/cg";
import { PiCoffeeDuotone } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";


const UserNavigation=()=> {
    const {authUser,setAuthUser}=useAuthContext()
    const signOutUser=()=>{
        sessionStorage.removeItem("user")
        setAuthUser(null)
    }
    return (
    <AnimationWrapper
    className="absolute right-0 z-250"
    transition={{duration:0.2 }}

    >
        <div className='b-white absolute right-0 bg-black mt-4 w-60 n duration-200 rounded-3xl'>
            <Link style={{textDecoration:"none"}}  to="/editor" className="flex gap-2 link pl-8 py-4 rounded-2xl">
            <LuFileEdit className='text-3xl'/>
                <p style={{fontSize:"16px"}}>Write</p>
            </Link>
            <Link style={{textDecoration:"none"}}  to={`/user/${authUser?.username}`} className="flex gap-2 link pl-8 py-4 z-60 rounded-2xl">
            <CgProfile className='text-3xl' />
                <p style={{fontSize:"16px"}}>Profile</p>
            </Link>
            
            <Link style={{textDecoration:"none"}}  to={`/dashboard/blogs`} className='flex gap-2 link pl-8 py-4 text-xl rounded-2xl'>
            <PiCoffeeDuotone className='text-3xl'/>
                Dashboard
            </Link>
            <Link style={{textDecoration:"none"}}  to={`/settings/edit-profile`} className='flex gap-2 link pl-8 py-4 text-xl rounded-2xl'>
            <IoSettingsOutline className='text-3xl'/>
                Settings
            </Link>
            <span className='absolute border-t border-dark-grey w-[100%]'></span>
            <button 
            onClick={signOutUser}
            className='text-left p-4 hover:bg-white w-full pl-8 py-4 hover:text-black rounded-2xl'>
                <div className="flex gap-3 align-center mb-2">
                <h1 style={{fontSize:"20px"}}  className=' text-dark-grey mg-1 '>Logout </h1>
                <IoMdLogOut className='text-3xl text-dark-grey' />
                    </div>
                <p className='text-dark-grey'>@{authUser?.username}</p>
            </button>
        </div>

    </AnimationWrapper>
    )
}

export default UserNavigation
