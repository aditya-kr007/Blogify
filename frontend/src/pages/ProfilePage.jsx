import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AnimationWrapper from '../common/PageAnimation'
import Loader from '../components/Loader'
import { useAuthContext } from '../context/AuthContext'
import AboutUser from '../components/AboutUser'
import FilterPagination from '../common/FliterPagination'
import Inpage_Navigation from '../components/Inpage_Navigation'
import NloBlogData from '../components/NloBlogData'
import LoadMoreDataBtn from '../components/LoadMore'
import BlogPostCard from '../components/BlogPostCard'
import ErrorPage from './404.page'
import toast from 'react-hot-toast'
export const profileDataStructure = {
    personal_info: {
        name: '',
        username: '',
        profile_img: '',
        bio: ''
    },
    account_info: {
        total_posts: 0,
        total_reads: 0
    },
    social_links: {},
    joinedAt: ""
}

const ProfilePage = () => {
    const { id: profileId } = useParams()
    const [profile, setProfile] = useState(profileDataStructure)
    const [blogs, setBlogs] = useState(null);
    const [profileLoaded,setProfileLoaded]=useState("")
  

    const { authUser } = useAuthContext()
    let [loading, setLoading] = useState(true)
    const username=authUser?.username
    const { personal_info: { username: profile_username, name, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile


    const fetchUserProfile = () => {
        if(authUser){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-profile', { username: profileId })
            .then(({ data: user }) => {
                setProfile(user)
                setProfileLoaded(profileId)
                getBlog({ user_id: user._id })
            })
            .catch(err => {
                console.log(err)
            })
            .finally(
                setLoading(false)
            )
        }
        else{
            (setLoading(false))
            toast.error("Please Login to search")
        }
        

    }
    
    const getBlog = ({ page = 1, user_id }) => {
        user_id = user_id || blogs.user_id
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/search-blog', { author: user_id, page })
            .then(async ({ data }) => {
                
                let formattedData = await FilterPagination({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blog-count",
                    data_to_send: { author: user_id },
                })
                
                formattedData.user_id = user_id
                setBlogs(formattedData)
                
            })
    }


    useEffect(() => {
        if(profileId!=profileLoaded){
            setBlogs(null)
        }
        if(blogs==null){
        resetState()
        fetchUserProfile()
        }
        
    }, [profileId,blogs])


    const resetState=()=>{
        
        setProfile(profileDataStructure)
        setBlogs(null)
        setLoading(true)
    }
    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> : 
                profile_username.length?
                <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                    <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:sticky md:top-[100px] md:py-10'>
                        <img className='w-48 h-48 rounded-full md:w-32 md:h-32' src={profile_img} />
                        <h1 className='text-2xl font-medium'>
                            @{profile_username}
                        </h1>
                        <p className='text-xl capitalize'>{name}</p>
                        <p className='text-xl'><span className='font-mono'>{total_posts.toLocaleString()}-</span>Blogs <span className='font-mono'>{total_reads.toLocaleString()}-
                        </span>Reads</p>
                        <div className='flex gap-4'>
                            {
                                profileId == username ? <Link to={'/settings/edit-profile'} className='btn-light rounded-md'>
                                    Edit Profile
                                </Link> : ""
                            }

                        </div>
                        <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} className={"max-md:hidden"} />
                    </div>
                    <div className='max-md:mt-full w-full'>
                            <Inpage_Navigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
                                <>
                                    {
                                        blogs == null ? <Loader /> :
                                            blogs.results.length ?
                                                blogs.results.map((blog, i) => {
                                                    return (
                                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }}>
                                                            <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                                        </AnimationWrapper>
                                                    )
                                                })
                                                : <NloBlogData message={"No Blogs Found"} />
                                    }
                                    <LoadMoreDataBtn state={blogs} fetchData={getBlog}/>
                                </>
                                <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                            </Inpage_Navigation>
                        
                    </div>
                </section>
                :<ErrorPage/>
            }
        </AnimationWrapper>
    )
}

export default ProfilePage
