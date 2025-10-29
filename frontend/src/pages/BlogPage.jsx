import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import AnimationWrapper from '../common/PageAnimation'
import Loader from '../components/Loader'
import GetDate from '../common/date'
import BlogInteraction from '../components/BlogInteraction'
import BlogPostCard from '../components/BlogPostCard'
import BlogContent from '../components/BlogContent'
import Comments, { fetchComments } from '../components/Comments'

export const blogStructure = {
    title: "",
    banner: "",
    des: "",
    tags: [],
    activity: [
        {
            total_likes: 0,
            total_comments: 0,
            total_Reads: 0,
            total_parent_comments: 0
        }
    ],
    content: [{
        time: "",
        blocks: [
            {
                type: "header",
                data: {
                    text: "",
                    level: 2
                }
            },
            {
                type: "header",
                data: {
                    text: "",
                    level: 3
                }
            },
            {
                type: "paragraph",
                data: {
                    text: ""
                }
            },
            {
                type: "image",
                data: {
                    file: {
                        url: "",
                        caption: ""
                    },
                }
            },
            {
                type: "embed",
                data: {
                    src: ""
                }
            },
            {
                type: "code",
                data: {
                    text: ""
                }
            },
            {
                type: "quote",
                data: {
                    text: "",
                    caption: ""
                }
            },

            {
                type: "table",
                data: {
                    header: [],
                    rows: []
                }
            },
            {
                type: "list",
                data: {
                    style: "",
                    items: []
                }
            },
        ]
    }
    ],
    author: {
        personal_info: {
            name: "",
            username: "",
            profile_img: ""
        }
    },
    publishedAt: ""
}
export const BlogContext = createContext({})
const BlogPage = () => {
    const { blog_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [similarBlogs, setSimilarBlogs] = useState(null)
    const [blog, setBlog] = useState(blogStructure)
    const [commentVisible, setCommentVisible] = useState(false)
    const [totalParentCommentLoaded, setTotalParentCommentLoaded] = useState(0)
    let [isLikedByUser, setIsLikeByUser] = useState(true)
    const { title, banner, content, author: { personal_info: { name, username: author_username, profile_img } }, publishedAt, des } = blog

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-blog', { blog_id })
            .then(async({ data: { blog } }) => {
                blog.comments=await fetchComments({blog_id:blog._id,setParentCommentCountFun:setTotalParentCommentLoaded})
                setBlog(blog)
                axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/search-blog', { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
                    .then(({ data }) => {
                        setSimilarBlogs(data.blogs)
                    })
                    .catch(err => {
                        console.log(err)
                        setLoading(false)
                    })

                
                setLoading(false)

            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })

    }


    useEffect(() => {
        resetState()
        fetchBlog()
    }, [blog_id])

    const resetState = () => {
        setBlog(blogStructure)
        setSimilarBlogs(null)
        setLoading(true)
        // setCommentVisible(false)
        // setTotalParentComment(false)
    }

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    <BlogContext.Provider value={{ blog, setBlog, isLikedByUser, setIsLikeByUser,commentVisible, setCommentVisible, totalParentCommentLoaded,setTotalParentCommentLoaded }}>
                        <Comments/>
                        <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                            <div className='w-full aspect-video rounded-lg overflow-hidden mb-4 bg-dark-grey mt-4'>
                                <img src={banner} alt="" className='w-full' />
                            </div>
                            <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
                            <div className='flex max-sm:flex-col justify-between my-8'>
                                <div className='flex gap-5 items-start'>
                                    <Link to={`/user/${author_username}`}>
                                        <img className='w-12 h-12 rounded-full' src={profile_img} />
                                    </Link>
                                    <p className='capitalize text-dark-grey text-xl'>
                                        {name}
                                        <br />
                                        <Link className='text-white' to={`/user/${author_username}`}>@{author_username}</Link>
                                    </p>
                                </div>
                                <p className='text-dark-grey max-sm:mt-6 max:sm:ml-12 max-sm:pl-16'>Published on {GetDate(publishedAt)}</p>
                            </div>
                            <BlogInteraction />
                            <div className='my-12 blog-page-content'>

                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div key={i}>

                                            <BlogContent block={block} />
                                        </div>
                                    })
                                }
                            </div>
                            {
                                similarBlogs != null && similarBlogs.length ?
                                    <>
                                        <h1 className='text-2xl mt-14 mb-10 font-medium'>
                                            Similar Blogs
                                        </h1>
                                        {
                                            similarBlogs.map((blog, i) => {

                                                return (
                                                    <div className='flex gap-4 mb-10'>
                                                        <AnimationWrapper transition={{ duration: 1, delay: i * 0.08 }}>
                                                            <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                                        </AnimationWrapper>

                                                    </div>
                                                )
                                            })
                                        }
                                    </> : ""
                            }
                        </div>
                    </BlogContext.Provider>


            }
        </AnimationWrapper>
    )
}


export default BlogPage
