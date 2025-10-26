import React, { useContext, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BlogContext } from '../pages/BlogPage'

const CommentField = ({ action, index = undefined, replyingTo = undefined, setIsReplying }) => {
    const [comment, setComment] = useState("")
    const { authUser, setAuthUser } = useAuthContext()
    const username2 = authUser?.username
    const name2 = authUser?.name
    const profile_img2 = authUser?.profile_img
    let { blog, blog: { _id, author: { _id: blog_author }, comments, comments: { result }, activity, activity: { total_comments,
        total_parent_comments } }, setBlog, setTotalParentCommentLoaded } = useContext(BlogContext)


    const handleComment = () => {
        if (!authUser?.token) return toast.error("Please login to leave a comment")
        if (!comment.length) return toast.error("Please Write Something To Leave Comment")

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/add-comment", { _id, blog_author, comment, replying_to: replyingTo }, {
            headers: {
                "Authorization": `Bearer ${authUser.token}`
            }
        })
            .then(({ data }) => {
                setComment("")
                toast.success("Comment Added")
                data.commented_by = { personal_info: { username2, profile_img2, name2 } }
                let newCommentArray
                if(replyingTo){
                    result[index].children.push(data._id)
                    data.childrenLevel=result[index].childrenLevel+1
                    data.parentIndex=index
                    result[index].isReplyLoaded=true
                    result.splice(index+1,0,data)
                    newCommentArray=result
                    setIsReplying(false)
                    console.log(result)
                }
                else{
                data.childrenLevel = 0
                console.log(result)
                newCommentArray = [data, ...result]
                }
                
                let parentCommentIncrementVal=replyingTo?0 :1;
                
                setBlog({ ...blog, comments: { ...comments, result: newCommentArray }, activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + parentCommentIncrementVal } })
                setTotalParentCommentLoaded(preVal => preVal + parentCommentIncrementVal)

            })
            .catch(err => {
                console.log(err)
            })

    }
    return (
        <>
            <textarea onChange={(e) => {
                setComment(e.target.value)
            }} className='input-box pl-5 bg-grey/5  placeholder:text-white placeholder:text-xl text-white resize-none h-[200px] overflow-auto' value={comment} placeholder='Leave a comment...'>

            </textarea>
            <button onClick={handleComment} className='btn-light mt-5 w-full'>{action}</button>
        </>
    )
}

export default CommentField
