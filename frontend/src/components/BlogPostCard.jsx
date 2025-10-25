import React from 'react'
import GetDate, { GetFullDay } from '../common/date'
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from 'react-router-dom';

const BlogPostCard = ({ content, author }) => {
    const { blog_id: id, publishedAt, tags, title, des, banner, activity: { total_likes } } = content
    const { name, username, profile_img } = author
    return (
        <Link to={`/blog/${id}`} className='flex gap-8  pb-5 mb-12'>
            <div className='w-full'>
                <div className='flex gap-2 flex-col items-start mb-3'>
                    <div className='flex flex-row gap-2'>
                        <img src={profile_img} className='w-6 h-6 rounded-full' />
                        <p className='line-clamp'>
                            @{username}
                        </p>
                    </div>
                    <p className='min-w-fit text-grey/70'>
                        {GetFullDay(publishedAt)}
                    </p>
                </div>
                <h1 className='blog-title text-grey'>{title}</h1>
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{des}</p>
                <div className='flex gap-4'>
                    <span className='btn-light py-1 px-4 mt-3 md:mt-3'>
                        {tags[0]}
                    </span>
                    <span className='ml-3 flex items-center gap-2 mt-3 md:mt-3 text-grey font-sans'>
                        <IoMdHeartEmpty className='text-2xl' />
                        {total_likes}
                    </span>
                </div>
            </div>
            <div className='h-40  bg-dark-grey rounded-xl object-cover aspect-square '>
                <img className='rounded-lg' src={banner} />
            </div>
        </Link>

    )
}

export default BlogPostCard
