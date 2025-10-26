import React from 'react'
import { Link } from 'react-router-dom'
import GetDate from '../common/date'

function TrendingBlogPostCard({ blog, index }) {
    const { title,banner, blog_id: id, author: { personal_info: { name, username, profile_img } }, publishedAt } = blog
    return (
        <Link to={`/blog/${id}`} className='flex gap-8  pb-5 mb-12'>
            <h1 className='blog-index font-sans'>
                {index < 10 ? "0" + (index + 1) : index}
            </h1> 
        <div className='w-full'>
            <div className='flex gap-2 items-center mb-7'>
                <img src={profile_img} className='w-6 h-6 rounded-full mt-2'/>
                <p className='line-clamp mt-2'>
                    @{username}
                    </p>
                    <p className='min-w-fit mt-2'>
                        {GetDate(publishedAt)}
                    </p>
            </div>
            <h1 className='blog-title text-grey'>{title}</h1>
        </div>
        <div className='h-24 mt-12 bg-dark-grey rounded-xl object-cover aspect-square '>
            <img className='rounded-xl' src={banner} />
        </div>
        </Link>
    )
}

export default TrendingBlogPostCard
