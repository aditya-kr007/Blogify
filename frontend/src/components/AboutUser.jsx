import React from 'react'
import { Link } from 'react-router-dom'
import { FaYoutube } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { GetFullDay } from '../common/date';


const AboutUser = ({bio,social_links:{youtube,instagram,twitter,github,facebook,linkedin},joinedAt,className}) => {
    
    return (
        <div className={"md:w-[90%] md:mt-7 "+ className}>
            <p className='text-xl leading-7 text-dark-grey mb-4'>{bio.length?bio:"Nothing To Read Here"}</p>
            <div className='flex gap-x-7 flex-wrap gap-y-2 items-center mb-4 text-dark-grey'>
            {
                youtube?<Link to={youtube} target='_blank'>
                <FaYoutube  className='text-3xl hover:text-white'/></Link>:""
            }
            {
                instagram?<Link to={instagram} target='_blank'>
                <FaInstagram  className='text-3xl hover:text-white'/></Link>:""
            }
            {
                twitter?<Link to={twitter} target='_blank'>
                <FaXTwitter  className='text-3xl hover:text-white'/></Link>:""
            }
            {
                github?<Link to={github} target='_blank'>
                <FaGithub  className='text-3xl hover:text-white'/></Link>:""
            }
            {
                facebook?<Link to={facebook} target='_blank'>
                <FaFacebook  className='text-3xl hover:text-white'/></Link>:""
            }
            {
                linkedin?<Link to={linkedin} target='_blank'>
                <FaLinkedin  className='text-3xl hover:text-white'/></Link>:""
            }
            

            </div>
            <p className=' text-dark-grey'>Joined At <span className='font-sans'>{GetFullDay(joinedAt)}</span></p>
        </div>
    )
}

export default AboutUser
