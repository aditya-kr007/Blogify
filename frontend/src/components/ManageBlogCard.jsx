import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetDate from '../common/date'
import { useAuthContext } from '../context/AuthContext'
import axios from 'axios'
// const {authUser}=useAuthContext()
const BlogStats=({stats})=>{
    return(
        <div className='flex gap-2 max-lg:mb-6 max-lg:pb-4 border-dark-grey max-lg:border-b'>
            {Object.keys(stats).map((key,index)=>{
                return !key.includes("parent")?<div key={index} className={'flex flex-col items-center w-full h-full justify-center p-4 px-6 '+(index!=0?"border-dark-grey border-l":"")}>
                <h1 className='text-xl lg:text-2xl mb-2 font-sans'>{stats[key].toLocaleString()}</h1>
                <p className='max-lg:text-grey/80 capitalize'>{key.split("_")[1]}</p>
            </div>:""
            })
        }
        </div>
    )
}

export const ManageBlogCard = ({ blog }) => {
    const { banner, des, title, blog_id, publishedAt, activity } = blog
    const [showStat, setShowStat] = useState(false)
    const {authUser:{token},authUser}=useAuthContext()
    return (
        <>
            <div className='flex gap-10 border-b mb-6 max-md:px-4 border-dark-grey pb-6 items-center'>
                <img src={banner} className='max-md:hidden rounded-md lg:hidden xl:block w-28 h-28 flex-none bg-dark-grey object-cover' />
                <div className='flex flex-col justify-between py-2 w-full min-w-[300px] '>
                    <div >
                        <Link className='blog-title mb-4 hover:underline' to={`/blog/${blog_id}`}>
                            {title}
                        </Link>
                        <p className='line-clamp-1 text-xl'>Published on <span className='font-sans'>{GetDate(publishedAt)}</span> </p>
                        <div className='flex gap-4 mt-4'>
                            <Link className='pr-4 underline' to={`/editor/${blog_id}`}>
                                <button className='btn-light px-8'>Edit</button>
                            </Link>
                            <button onClick={() => setShowStat(prev => !prev)} className='btn-light lg:hidden mr-2 px-8'>Stats</button>
                            <button onClick={(e)=>DeleteBlog(blog,authUser?.token,e.target)} className='btn-light text-white bg-grey/10 px-8'>Delete</button>
                        </div>

                    </div>
                </div>
                <div className='max-lg:hidden '>
                    <BlogStats stats={activity}/>
                </div>
            </div>
            {
                showStat?<div className='lg:hidden'>
                    <BlogStats stats={activity}/>
                </div>:""
            }
            
        </>

    )
}

export const ManageDraftBlogPost=({blog})=>{
    let {title,blog_id,des,index}=blog
    const {authUser}=useAuthContext()
    index++
    return(
        <div className='flex gap-5 lg:gap-10 pb-6 mb-6 border-b border-dark-grey'>
            <h1 className='font-sans blog-index text-center pl-4 md:pl-6 flex-none'>{index<10?"0"+index:index}</h1>
            <div className=''>
                <h1 className='blog-title mb-3'>{title}</h1>
                <p className='line-clamp-2'>{des?des:"No Description"}</p>
                <div className='flex gap-6 mt-4'>
                    <Link to={`/editor/${blog.blog_id}`}>
                        <button className='btn-light px-8'>Edit</button>
                    </Link>
                    <button onClick={(e)=>DeleteBlog(blog,authUser?.token,e.target)} className='btn-light text-white bg-grey/10 px-8'>Delete</button>
                </div>
            </div>
        </div>
    )
}


const DeleteBlog=(blog,token,target)=>{
    const {index,blog_id,setStateFunc}=blog
    target.setAttribute("disabled",true)
    axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/delete-blog',{blog_id},{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })
    .then(({data})=>{
        target.removeAttribute("disabled")
        setStateFunc(prev=>{
            let {deletedDocsCount,totalDocs,results}=prev
            results.splice(index,1)
            if(!deletedDocsCount){
                deletedDocsCount=0
            }
            if(!results.length && totalDocs>0){
                return null
            }
            return {...prev,deletedDocsCount:deletedDocsCount+1,totalDocs:totalDocs-1}
        })
    })
    .catch(err=>{
        console.log(err)
        target.removeAttribute("disabled")
    })
}