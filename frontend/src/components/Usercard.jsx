import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({user}) => {
    const {personal_info:{name,username,profile_img}}=user
    return (
        <div>
            <Link to={`/user/${username}`} className='flex gap-5 border-b border-dark-grey hover:bg-black/100 p-3 rounded-full items-center mb-5'>
            <img src={profile_img} className='h-14 w-14 rounded-full'/>
            <div>
                <h1 className='text-grey text-xl line-clamp-2'>{name}</h1>
                <p className='text-grey'>@{username}</p>
            </div>
            </Link>
        </div>
    )
}

export default UserCard
