import React, { useContext, useState } from 'react'
import GetDate from '../common/date'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import CommentField from './CommentField'
import { BlogContext } from '../pages/BlogPage'
import axios from 'axios'

const CommentCard = ({ index, leftVal, commentData }) => {
    const { commented_by: { personal_info: { profile_img, name, username: commented_by_username } }, commentedAt, comment, _id, children } = commentData
    const { authUser, setAuthUser } = useAuthContext()
    const [isReplying, setIsReplying] = useState(false)

    const { blog, blog: { comments, activity, activity: { total_parent_comments }, comments: { result: commentsArr }, author: { personal_info: { username: blog_author } } }, setBlog, setTotalParentCommentLoaded } = useContext(BlogContext)
    const handleReplyClick = () => {
        if (!authUser?.token) {
            return toast.error("Please login to reply")
        }
        setIsReplying(prevVal => !prevVal)
    }

    const getParentIndex = () => {
        let startingPoint = index - 1
        try {
            while (commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--
            }

        } catch (error) {
            startingPoint = undefined
        }
        return startingPoint
    }
    const removeCommentCard = (startingPoint, isDelete = false) => {
        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
                commentsArr.splice(startingPoint, 1)
                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }
        if (isDelete) {
            let parentIndex = getParentIndex()
            if (parentIndex !== undefined) {
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)
                if (commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReplyLoaded = false
                }
            }
            commentsArr.splice(index, 1)
        }
        if (commentData.childrenLevel == 0 && isDelete) {
            setTotalParentCommentLoaded(prevVal => prevVal - 1)
        }

        setBlog({ ...blog, comments: { result: commentsArr }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0) } })

    }
    const deleteComments = (e) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/delete-comment', { _id }, {
            headers: {
                "Authorization": `Bearer ${authUser?.token}`
            }
        })
            .then(() => {
                removeCommentCard(index + 1, true)
                
            })
            .catch(err => {
                console.log(err)
            })
        console.log("clicked")
    }
    const hideReply = () => {
        commentData.isReplyLoaded = false
        removeCommentCard(index + 1)
    }
    const LoadReply = ({ skip = 0 }) => {
        if (children.length) {
            hideReply()
            axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-replies', { _id, skip })
                .then(({ data: { replies } }) => {
                    console.log(replies)
                    commentData.isReplyLoaded = true
                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentData.childrenLevel + 1
                        commentsArr.splice(index + 1 + i + skip, 0, replies[i])
                    }
                    setBlog({ ...blog, comments: { ...comments, result: commentsArr } })
                    
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    const LoadMoreMoreRepliesButton = () => {
        let parentIndex = getParentIndex()
        if (commentsArr[index + 1]) {
            if (commentsArr[index+1].childrenLevel < commentsArr[index].childrenLevel) {
                return (<button>
                    Load More
                </button>)
            }
        }

    }
    return (
        <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className='my-5 p-6 rounded-md border border-white/20'>
                <div className='flex gap-3 items-center mb-4'>
                    <img src={profile_img} className='w-8 h-8 rounded-full' />
                    <p className='text-grey/80 line-clamp-1 k'> @{commented_by_username}</p>
                    <p className=' min-w-fit text-grey/80'>{GetDate(commentedAt)}</p>
                </div>
                <p className=' text-xl  text-grey/90'>{comment}</p>
                <div className='flex gap-5 items-center mt-5'>
                    {
                        commentData.isReplyLoaded ? <button onClick={hideReply} className='text-grey/80'>
                            Hide Reply
                        </button>
                            : <button onClick={LoadReply} className='text-grey/80'>
                                <span className='font-mono'>{children?.length}</span> Reply
                            </button>
                    }
                    <button onClick={handleReplyClick} className='underline text-grey/80 text-lg'>Reply</button>
                    {
                        authUser?.username == commented_by_username || authUser?.username == blog_author ?
                            <button onClick={deleteComments} className='underline text-grey/80 text-lg'>Delete</button>
                            : ""
                    }
                </div>
                {
                    isReplying ?
                        <div className='mt-8'>
                            <CommentField action={"reply"} index={index} replyingTo={_id} setIsReplying={setIsReplying} />
                        </div>
                        : ""
                }
            </div>
            <LoadMoreMoreRepliesButton />
        </div>
    )
}

export default CommentCard
