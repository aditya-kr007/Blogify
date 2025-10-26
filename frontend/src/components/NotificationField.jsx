import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'
const NotificationField = ({_id,blog_author,index=undefined,replyingTo=undefined,setReplying,notification_id,notification_data}) => {

    const [comment, setComment] = useState("")
    const {_id:user_id}=blog_author
    const {authUser}=useAuthContext()
    const {notifications,notifications:{results},setNotification}=notification_data
    const handleComment = (e) => {
            if (!comment.length) return toast.error("Please Write Something To Leave Comment")
    
                
            axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/add-comment", { _id, blog_author:user_id, comment, replying_to: replyingTo,notification_id }, {
                headers: {
                    "Authorization": `Bearer ${authUser.token}`
                }
            })
            .then(({data})=>{
                setReplying(false)
                results[index].reply={comment,_id:data._id}
                
                setComment("")

            })
            .catch(err=>{
                console.log(err)
            })
                
    
    }
    return (
        <>
            <textarea onChange={(e) => {
                setComment(e.target.value)
            }} className='input-box pl-5 bg-grey/5  placeholder:text-white placeholder:text-xl text-white resize-none h-[200px] overflow-auto' value={comment} placeholder='Leave a reply...'>

            </textarea>
            <button onClick={handleComment} className='btn-light mt-5 w-full'>Reply</button>
        </>
    )
}

export default NotificationField
