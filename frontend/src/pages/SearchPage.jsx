import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import Inpage_Navigation from '../components/Inpage_Navigation'
import AnimationWrapper from '../common/PageAnimation'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPostCard'
import NloBlogData from '../components/NloBlogData'
import LoadMoreDataBtn from '../components/LoadMore'
import FilterPagination from '../common/FliterPagination'
import axios from 'axios'
import UserCard from '../components/UserCard'
import { LuUser2 } from "react-icons/lu";



const SearchPage = () => {
    const {query}=useParams()
    
    const [blog,setBlog]=useState()
    const [users,setUsers]=useState(null)
    const SearchBlog=({page=1,create_new_array=false})=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-blog",{query,page})
        .then(async blogs => {
            let formateData= await FilterPagination({
                state:blog,
                data:blogs.data.blogs,
                page,
                countRoute:"/search-blog-count",
                data_to_send:{query},
                create_new_array

            })
            setBlog(formateData)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const FetchUsers=()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/search-user",{query})
        .then(({data:{users}})=>{
            setUsers(users)
        })
    }
    useEffect(()=>{
        resetState()
        SearchBlog({page:1, create_new_array:true})
        FetchUsers()
    },[query])

    const resetState=()=>{
        setBlog(null)
        setUsers(null)
    }

    const UserCardWrapper=()=>{
        return(
            <>
            {
                users==null?<Loader/>:users.length?users.map((user,i)=>{
                    return(
                        <AnimationWrapper transition={{ duration: 1, delay: i *.1 }}>
                        <UserCard user={user} key={i}/>
                        </AnimationWrapper>
                    )
                }):<NloBlogData message={"No User Found"}/>
            }
            </>
        )
    }

    return (
        <section className='h-cover flex justify-center gap-10'>
            <div className='w-full'>
                <Inpage_Navigation routes={[`Search Results from ${query}`,"Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                    <>
                    {
                                blog == null ? <Loader /> :
                                blog.results.length?
                                    blog.results.map((blog, i) => {
                                        return (
                                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }}>
                                                <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        )
                                    })
                                    :<NloBlogData message={"No Blogs Found"}/>
                            }
                            <LoadMoreDataBtn state={blog} fetchData={SearchBlog}/>
                    </>

                    <UserCardWrapper/>
                </Inpage_Navigation>
            </div>

            <div className='min-w-[40%] lg:min-w-[350px] max-w-min pl-8 pt-3 max-md:hidden '>
                <h1 className='font-medium text-xl mb-8 flex gap-2'>
                    User Related To Search <LuUser2  className='text-2xl'/>
                    
                </h1>
                <UserCardWrapper/>
            </div>
        </section>
    )
}

export default SearchPage
