import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { FiFileText } from "react-icons/fi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { LuFileEdit } from "react-icons/lu";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";

const SideNavBar = () => {
    const { authUser, setAuthUser } = useAuthContext()
    const page=location.pathname.split('/')[2]
    const [pageState, setPageState] = useState(page.replace('-',' '))
    const activeTabLine=useRef()
    const sideBarIcon=useRef()
    const pageStateTab=useRef()
    
    const [showSideNav,setShowSideNav]=useState(false)

    const temp=useRef()
    const changePageState=(e)=>{
        
        let { offsetWidth,offsetLeft}=e.target
        activeTabLine.current.style.width=offsetWidth+"px"
        activeTabLine.current.style.left=offsetLeft+"px"
        if(e.target==sideBarIcon.current){
            setShowSideNav(true)
        }
        else{
            setShowSideNav(false)
        }
    }
    useEffect(()=>{
        pageStateTab.current.click()
    },[pageState])
    return (
        authUser === null ? <Navigate to={'/signin'} /> :
            <>
                <section className='flex gap-10 py-0 m-0 max-md:flex-col'>
                    <div className='sticky top-[-20] z-30'>
                        <div className='md:hidden py-1 flex flex-nowrap overflow-x-auto'>
                            <button onClick={changePageState} ref={sideBarIcon} className='p-5 capitalize'>
                            <RiMenu3Fill className='pointer-events-none w-6 h-6' />
                            </button>
                            
                            <button onClick={changePageState} ref={pageStateTab} className='p-5 capitalize text-2xl'>
                            {pageState}
                            </button>
                            <hr ref={activeTabLine} className='absolute bottom-0 duration-500'/>
                        </div>
                        <div className={'min-w-[200px] mt-4 h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto py-6 md:pr-0  absolute  max-md:top-[64px] max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 '+ (!showSideNav?"max-md:opacity-0 max-md:pointer-events-none":"opacity-100 pointer-events-auto")}>
                            <h1 className=' text-2xl text-grey/70 mb-3'>
                                Dashboard
                            </h1>
                            <hr className='-ml-6 mb-8 border-dark-grey'></hr>
                            <NavLink to={'/dashboard/blogs'} onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link ">
                                <FiFileText className='text-2xl' />
                                Blogs
                            </NavLink>
                            <NavLink to={'/dashboard/notifications'} onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                {
                                    authUser?.new_notification===true?                            
                                    <box-icon  name='bell' animation='tada' color='#fff' ></box-icon>
                                    :<MdOutlineNotificationsActive className='text-2xl' />

                                }
                                
                                Notification
                            </NavLink>
                            <NavLink to={'/editor'} onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <LuFileEdit className='text-2xl' />
                                Write
                            </NavLink>

                            <h1 className=' text-2xl mt-20 text-grey/70 mb-3'>
                                Settings
                            </h1>
                            <hr className='-ml-6 mb-8 mr-6 border-dark-grey'></hr>


                            <NavLink to={'/settings/edit-profile'} onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link flex mr-3">
                                <BsFillPersonLinesFill className='text-2xl' />
                                Edit Profile
                            </NavLink>
                            <NavLink to={'/settings/change-password'} onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link mr-3">
                                <FaLock className='text-2xl ' />
                                Change password
                            </NavLink>
                        </div>
                    </div>
                    <div ref={temp} className={'sticky max-md:-mt-8 mt-5 w-full ' +(showSideNav?" max-sm:hidden":"")}>
                    <Outlet />
                </div>
                </section>
            </>
    )
}

export default SideNavBar
