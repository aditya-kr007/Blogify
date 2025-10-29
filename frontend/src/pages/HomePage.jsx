import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/PageAnimation'
import Inpage_Navigation, { activeTabRef } from '../components/Inpage_Navigation'
import axios from 'axios'
import Loader from '../components/Loader'
import BlogPostCard from '../components/BlogPostCard'
import TrendingBlogPostCard from '../components/TrendingBlogPostCard'
import { FaArrowTrendUp } from "react-icons/fa6";
import NloBlogData from '../components/NloBlogData'
import FilterPagination from '../common/FliterPagination'
import LoadMoreDataBtn from '../components/LoadMore'

function HomePage() {
    const [blog, setBlog] = useState(null)
    const [trendingBlog, setTrendingBlog] = useState(null)
    const categories = ["anime", "music", "politics", "hollywood", "movies", "technology", "food", "travel","Games"]
    const [pageState,setPageState]=useState("home")
    const FetchAllBlogs = ({page=1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/latest-blog', {page
        })
        
            .then(async blogs => {
                let formateData= await FilterPagination({
                    state:blog,
                    data:blogs.data.blogs,
                    page,
                    countRoute:"/all-latest-blog-count",

                })
                setBlog(formateData)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const FetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN+'/trending-blog', {
        })
            .then(blogs => {
                setTrendingBlog(blogs.data.blogs)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const FetchBlogByCategory = ({page=1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/search-blog', {tag:pageState,page})
            .then(async blogs => {
                let formateData= await FilterPagination({
                    state:blog,
                    data:blogs.data.blogs,
                    page,
                    countRoute:"/search-blog-count",
                    data_to_send:{tag:pageState}

                })
                setBlog(formateData)
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        activeTabRef.current.click()
        if(pageState=="home"){
            FetchAllBlogs({page:1})
        }
        else{
            FetchBlogByCategory({page:1})
        }

        if(!trendingBlog)
        FetchTrendingBlogs()
    }, [pageState])

    const loadBlogByCategory=(e)=>{
        let category=e.target.innerText.toLowerCase()
        setBlog(null)
        if(pageState==category){
            setPageState("home")
            return
        }

        setPageState(category)

    }

    return (
        <AnimationWrapper
        >
            <section className="h-cover flex justify-center gap-10">
                {/* latest blogs */}
                <div className='w-full'>
                    <Inpage_Navigation routes={[pageState, "Trending Blogs"]} defaultHidden={["Trending Blogs"]}>

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
                            <LoadMoreDataBtn state={blog} fetchData={(pageState=="home"?FetchAllBlogs:FetchBlogByCategory)}/>
                        </>
                        <>
                        <div className='flex flex-col gap-10'>
                        <div>
                            <h1 className='font-medium text-2xl mb-8 mt-2.5'>Stories from all interest</h1>
                            <div className='flex gap-3 flex-wrap mb-6'>
                                {
                                    categories.map((category, i) => {
                                        return <button key={i} onClick={loadBlogByCategory} className={'tag '+(pageState==category?" bg-white text-black":"")}>
                                            {category}
                                        </button>
                                    })
                                }
                            </div>

                        </div>
                    </div>
                    <div>
                        <h1 className='font-medium flex gap-3 mb-4 text-xl'>Trending <FaArrowTrendUp className='text-xl' /></h1>
                        {
                            trendingBlog == null ? <Loader /> :
                            trendingBlog.length?
                                trendingBlog.map((blog, i) => {
                                    return (
                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }}>
                                            <TrendingBlogPostCard blog={blog} key={i} index={i} />
                                        </AnimationWrapper>
                                    )
                                })
                                :<NloBlogData message={"No Trending Blogs"}/>
                        }

                    </div>
                        </>
                    </Inpage_Navigation>
                </div>

                {/* filter and trending blogs */}
                <div className='min-w-[40%] lg:min-w-[400px] max-w-min  border-1 border-grey pl-8 pt-3 max-md:hidden'>
                    <div className='flex flex-col gap-10'>
                        <div>
                            <h1 className='font-medium text-2xl mb-8 mt-2.5'>Stories from all interest</h1>
                            <div className='flex gap-3 flex-wrap mb-6'>
                                {
                                    categories.map((category, i) => {
                                        return <button onClick={loadBlogByCategory} className={'tag '+(pageState==category?" bg-white text-black":"")} key={i}>
                                            {category}
                                        </button>
                                    })
                                }
                            </div>

                        </div>
                    </div>
                    <div>
                        <h1 className='font-medium flex gap-3 mb-4 text-xl'>Trending <FaArrowTrendUp className='text-xl' /></h1>
                        {
                            trendingBlog == null ? <Loader /> :
                            trendingBlog?
                                trendingBlog.map((blog, i) => {
                                    return (
                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }}>
                                            <TrendingBlogPostCard blog={blog} key={i} index={i} />
                                        </AnimationWrapper>
                                    )
                                })
                                :<NloBlogData message={"No Trending Blogs"}/>
                        }

                    </div>
                </div>
            </section>

        </AnimationWrapper>
    )
}

export default HomePage

