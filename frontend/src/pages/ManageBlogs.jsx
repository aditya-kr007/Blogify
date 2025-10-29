import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'
import FilterPagination from '../common/FliterPagination'
import Inpage_Navigation from '../components/Inpage_Navigation'
import Loader from '../components/Loader'
import NoBlogData from '../components/NloBlogData'
import AnimationWrapper from '../common/PageAnimation'
import {ManageBlogCard,ManageDraftBlogPost} from '../components/ManageBlogCard'
import LoadMoreDataBtn from '../components/LoadMore'
import { useSearchParams } from 'react-router-dom'

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState(null)
    const [drafts, setDrafts] = useState(null)
    const [query, setQuery] = useState("")

    const { authUser } = useAuthContext()

    const activeTab=useSearchParams()[0].get("tab")

    const getBlogs = ({ page, draft, deleteDocsCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/user-written-blogs", { page, draft, deleteDocsCount, query }, {
            headers: {
                'Authorization': `Bearer ${authUser?.token}`
            }
        })
            .then(async ({ data }) => {
                const formattedData = await FilterPagination({
                    state: draft ? drafts : blogs,
                    data: data.blogs,
                    page,
                    user: authUser?.token,
                    countRoute: "/user-blog-count",
                    data_to_send: { draft, query }
                })

                if (draft) {
                    setDrafts(formattedData)

                }
                else {
                    setBlogs(formattedData)

                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {

        if (authUser?.token) {
            if (blogs == null) {
                getBlogs({ page: 1, draft: false })

            }
            if (drafts == null) {
                getBlogs({ page: 1, draft: true })
            }
        }

    }, [authUser?.token, blogs, drafts, query])

    const handleSearch = (e) => {

        let searchQuery = e.target.value
        setQuery(searchQuery)
        console.log(query)
        if (e.keyCode == 13 && searchQuery.length) {
            setBlogs(null)
            setDrafts(null)
        }
    }
    const handleChange = (e) => {
        if (!e.target.value.length) {
            setQuery("")
            setBlogs(null)
            setDrafts(null)
        }
    }
    return (
        <>
            <div>
                <h1 className='max-md:hidden text-2xl'>Manage Blogs</h1>
                <div className='relative max-md:mt-5 md:mt-8 mb-10'>
                    <input
                        onChange={handleChange}
                        onKeyDown={handleSearch}
                        type='search'
                        className='w-full p-4 pl-16 text-xl text-white bg-dark-grey rounded-full outline-none focus:outline-none placeholder:text-grey/70'
                        placeholder='Search Blogs'
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6 opacity-70 absolute right-[10%] md:pointer-events-none
                md:left-5 top-1/2 -translate-y-1/2 text-2xl color-white"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>

                </div>
            </div>
            <Inpage_Navigation routes={["Published Blogs", "Drafts"]} defaultActiveIndex={activeTab!="draft"?0:1}>
                { //published blogs

                    blogs == null ? <Loader /> :
                        blogs.results.length ?
                            <>
                                {
                                    blogs.results.map((blog, index) => {
                                        return (
                                            <AnimationWrapper key={index} transition={{ delay: 1 * 0.04 }}>
                                                <ManageBlogCard blog={{...blog,index:index,setStateFunc:setBlogs}} />
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                                <LoadMoreDataBtn state={blogs} fetchData={getBlogs}
                                additionalParams={{draft:false,decodeURIComponent:blogs.deleteDocsCount}}/>
                            </>

                            : <NoBlogData message={"No Published Blogs"} />
                }

                { //Draft blogs

                    drafts == null ? <Loader /> :
                        drafts.results.length ?
                            <>
                                {
                                    drafts.results.map((blog, index) => {
                                        return (
                                            <AnimationWrapper key={index} transition={{ delay: 1 * 0.04 }}>
                                                <ManageDraftBlogPost blog={{...blog,index:index,setStateFunc:setDrafts}} />
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                                <LoadMoreDataBtn state={drafts} fetchData={getBlogs} additionalParams={{drafts:true,deleteDocsCount:drafts.deleteDocsCount}}/>
                                
                            </>

                            : <NoBlogData message={"No Draft Blogs"} />
                }
            </Inpage_Navigation>
        </>


    )
}

export default ManageBlogs
