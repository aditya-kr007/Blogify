import logo from '../imgs/logo.svg'
import {Link, Outlet, useNavigate} from 'react-router-dom'
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { LuFile, LuFileEdit } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useAuthContext } from '../context/AuthContext';
import UserNavigation from './UserNavigation';
import { MdOutlineNotificationsActive } from "react-icons/md";
import axios from 'axios'


// {authUser?.new_notification===true?
//     <MdOutlineNotificationsActive className='w-7 h-7' />:<box-icon  name='bell' animation='tada' color='#000' ></box-icon>}
function Navbar() {
    const {authUser,setAuthUser}=useAuthContext()
    const Navigate=useNavigate()
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userPanel,setUserPanel]=useState(false)
    let [query,setQuery]=useState("")
    const handlePanel=()=>{
        setUserPanel(curr=>!curr)
    }
    const handleBlur=()=>{
        setTimeout(() => {
            setUserPanel(curr=>!curr)
        }, 500);
        
    }
    const handleSearchFunction=(e)=>{
        query=e.target.value
        if(query.length===0){
            setQuery("")
            Navigate('/')
        }
        if(query.length>1){
            setTimeout(()=>{
                Navigate(`/search/${query}`)
            },1000)
        }
    }
    useEffect(()=>{
        
        if(authUser?.token){
            axios.get(import.meta.env.VITE_SERVER_DOMAIN+'/new-notification',{
                headers:{
                    'Authorization':`Bearer ${authUser?.token}`
                }
            })
            .then(({data})=>{
                setAuthUser({...authUser,...data})
                
            })
        }
    },[authUser?.token])
    return (
        <>
        <nav className='navbar bg-opacity-5 z-50'>
            <Link to={'/'} className=''>
            <img src={logo} alt='logo' className='flex-none w-12 h-12'/>
            </Link>

            <div className={ !searchBoxVisibility?` absolute w-full left-0 top-full rounded-full mt-0.5 py-4 px-[4vw] md:block md:relative md:inset-0 md:p-0 md:w-auto hidden`:""}>
                <input onChange={(e)=>handleSearchFunction(e)} style={{fontFamily:""}} type='text' placeholder='Search' className='w-full md:w-auto border-spacing-y-3 border-white bg-dark-grey p-4 pl-6 pr-[12%] md:pe-6 rounded-full md:pl-12' placeholder:text-dark-grey="true">
                </input>
                {!searchBoxVisibility?                
                <CiSearch className={ `absolute text-2xl right-[10%] text-white md:pointer-events-none md:left-5 top-1/2 -translate-y-2 md:-translate-y-3`}/>:""}

            </div>
            <div className='flex items-center gap-3 md:gap-6 lg:gap-10 ml-auto '>
                <button onClick={()=> setSearchBoxVisibility(curr=>!curr)} className='md:hidden bg-white w-12 h-12 rounded-full pl-3.5'>
                <FaSearch className="text-xl text-black"/>
                </button>
                {
                    authUser?
                    <Link to={'/editor'}>
                        <button className='btn-light py-3 px-3 bg-grey relative rounded-full hidden md:block'>
                        <LuFileEdit className='w-6 h-6' />
                        </button>
                    </Link>:""
                }
                
                {
                    authUser?<>
                    <Link to={'/dashboard/notifications'}>
                    {
                        authUser?.new_notification!==true?
                        <>
                        <button className='btn-light py-3 px-3 bg-grey relative rounded-full'>
                        <MdOutlineNotificationsActive className='w-7 h-7' />
                        </button>
                        </>
                        :<button className='btn-light py-2 px-3 bg-grey relative rounded-full'>
                            <box-icon  name='bell' animation='tada' color='#000' ></box-icon>
                        </button>
                        
                    }
                        
                        
                        
                    </Link>
                    <div className='relative' onClick={handlePanel} >
                        <button className='w-12 h-12 mt-1'>
                            <img src={authUser.profile_img} className='w-full h-full object-cover rounded-full'/>
                        </button>
                        {
                            userPanel?<UserNavigation/>:""
                        }
                    </div>
                    

                    </>:<>
                    <Link className='btn-dark py-2.5 border border-dark-grey' to={'/signin'}>
                SignIn
            </Link>
            <Link className='btn-light py-2.5 hidden md:block' to={'/signup'}>
                SignUp
            </Link>
                    </>
                    
                }
            
            </div>
            
        </nav>
        <Outlet/>
        </>
        
    )
}

export default Navbar
