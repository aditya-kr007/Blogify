import React, { useContext, useEffect, useState } from 'react'
import { BlogContext } from '../pages/BlogPage'
import { MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { FaXTwitter } from "react-icons/fa6";
import { useAuthContext } from '../context/AuthContext';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { toast } from 'react-hot-toast'
import axios from 'axios';
const BlogInteraction = () => {
    let [liked, setLiked] = useState(false)
    let { blog, blog: {_id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username, author_username } } }, setBlog, isLikedByUser, setIsLikedByUser, commentVisible, setCommentVisible } = useContext(BlogContext)


    const blog_id2=useParams()
    const id3=blog_id2["blog_id"]
    const { authUser, setAuthUser } = useAuthContext()

    useEffect(()=>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/isLiked-by-user',{id3},{
            headers:{
                'Authorization':`Bearer ${authUser?.token}`
            }
        })
        .then(({data:{result}})=>{
            console.log(result)
            console.log(result[0]._id)
            if(result){
                setLiked(true)
            }
            else{
                setLiked(false)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])
    const handleLike = () => {
        if (authUser?.token) {
            setLiked(preVal => !preVal)
            !liked ? total_likes++ : total_likes--
            setBlog({ ...blog, activity: { ...activity, total_likes } })

            axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/like-blog',{_id,isLikedByUser:liked},{
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`
                }
            })
            .then(({data})=>{
                console.log(data)
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else {
            toast.error("Please login to like this")
        }
    }
    return (
        <>
            <hr className='border-dark-grey' />
            <div className='flex gap-6 justify-between'>
                <div className='flex gap-4 items-center py-2'>
                    <button onClick={handleLike} className={'w-12 h-12 rounded-full flex items-center justify-center ' + (liked ? "bg-red/60" : "bg-grey/5")}>
                        {!liked ? <MdFavoriteBorder className='w-6 h-6' /> : <MdFavorite className='h-6 w-6' />}
                    </button>
                    <p className='font-mono text-xl'>{total_likes}</p>
                    <button onClick={()=>{
                        setCommentVisible(preVal=>!preVal)
                        
                    }} className='w-12 h-12 rounded-full flex items-center justify-center bg-grey/5'>
                        <FaRegComment className='w-6 h-6' />
                    </button>
                    <p className='font-mono text-xl'>{total_comments}</p>
                </div>
                <div className='flex gap-6 items-center'>
                    {
                        authUser?.username == blog.author.personal_info.username ?
                            <Link to={`/editor/${blog.blog_id}`}>
                                <button className='btn-light py-3 px-3 bg-grey/5 relative rounded-full'>
                                    <MdOutlineModeEditOutline className='w-6 h-6 text-white' />
                                </button>
                            </Link> : ""
                    }
                    <Link to={`https://twitter.com/intent/tweet?text=Read ${blog.title}&url=${location.href}`}>
                        <FaXTwitter className='w-6 h-6' />
                    </Link>
                </div>
            </div>

            <hr className='border-dark-grey' />
        </>
    )
}

export default BlogInteraction
