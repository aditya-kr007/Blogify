import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GetDate from '../common/date'
import { GrBlog } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";
import NotificationField from './NotificationField';
import { useAuthContext } from '../context/AuthContext';
import axios from "axios"
const NotificationsCard = ({ data, index, notificaionState }) => {

    const [isReplying,setIsReplying]=useState(false)
    const handleReply=()=>{
        setIsReplying(prev=>!prev)

    }
    
    const {authUser,setAuthUser}=useAuthContext()
    const {seen, type,reply, createdAt, comment, replied_on_comment, blog: { blog_id, title,_id }, user, user: { personal_info: { name, username, profile_img } },_id:notification_id } = data

    
    const {notifications,notifications:{results,totalDocs},setNotifications}=notificaionState
    
    const handleDelete=(comment_id,type,target)=>{
        target.setAttribute("disabled",true)
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/delete-comment', { _id:comment_id },{
            headers:{
                'Authorization':`Bearer ${authUser?.token}`
            }
        })
        .then(()=>{
            if(type=="comment"){
                results.splice(index,1)
            }
            else{
                delete results[index].reply
            }
            target.removeAttribute("disabled")
            setNotifications({...notifications,results,totalDocs:totalDocs-1,deletedDocsCount:notifications.deletedDocsCount+1})
        })
    }
    return (
        <div className={'p-6 border-b border-grey/10 border-l-dark-grey '+(!seen?" border-l-2":"")}>
            <div className='flex gap-5 mb-3'>
                <img src={profile_img} className='h-14 w-14 flex-none rounded-full' />
                <div className='w-full'>
                    <h1 className='font-medium text-xl text-grey/70'>

                        <Link to={`/user/${username}`} className='text-grey/80  text-xl mx-2  underline '>@{username}</Link>
                        <span className='font-normal'>
                            {
                                type == "like" ? "Liked Your blog" : type == "comment" ? "Commented on" : "replied on"
                            }
                        </span>
                    </h1>
                    {
                        type == "reply" ?
                            <div className='px-2 pt-2 flex'>
                                
                                <p className='text-xl'>
                                    {replied_on_comment?.comment} </p>
                            </div> : <Link className='text-medium hover:underline flex gap-3  text-xl pt-2 line-clamp-1' to={`/blog/${blog_id}`}>
                                <GrBlog className='h-7 w-7' /> {`${title}`}
                            </Link>
                    }
                </div>
            </div>
            {
                type != "like" ?
                    <p className='ml-20 flex pl-15 text-xl my-4'> <FaRegCommentDots className='w-7 h-7 mr-2'/> {comment?.comment}</p> : ""
            }
            <div className='ml-14 pl-5 mt-3 text-grey/70 flex gap-8'>
                <p>{GetDate(createdAt)}</p>
                {
                    type!="like"?
                    <>
                    {
                        !reply?<button onClick={handleReply} className='hover:underline'>Reply</button>:""
                    }
                    
                    <button onClick={(e)=>{handleDelete(comment._id,"comment",e.target)}} className='hover:underline'>Delete</button>
                    </>
                    :""
                }
            </div>
            {
                isReplying?
                <div className='mt-8'>
                    <NotificationField _id={_id} blog_author={user} index={index} replyingTo={comment._id}
                    setReplying={setIsReplying} notification_id={notification_id} notification_data={notificaionState}/>
                </div>
                :""
            }
            {
                reply?
                <div className='ml-20 p-5 bg-grey/10 mt-5 rounded-md'>
                    <div className='flex gap-3 mb-3'>
                        <img className='w-10 h-10 rounded-full' src={authUser?.profile_img}/>
                        <div>
                            <h1 className='text-xl font-medium'>
                                <Link to={`/user/${authUser?.username}`} className='mx-1 underline'>@{authUser?.username}</Link>
                                <span>
                                    Replied To
                                </span>
                                <Link to={`/user/${username}`} className='mx-1 underline'>@{username}</Link>
                            </h1>
                            </div>
                        </div>
                        <p className='ml-14 text-xl'>{reply.comment}</p>
                        {/* <button onClick={(e)=>{handleDelete(comment._id,"reply",e.target)}} className='hover:underline ml-14  mt-4'>Delete</button> */}
                </div>
                :""
            }
        </div>
    )
}

export default NotificationsCard
