import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import axios from 'axios'
import Loader from '../components/Loader'
import AnimationWrapper from '../common/PageAnimation'
import 'boxicons'
import toast from 'react-hot-toast'
import { postImage } from '../api'

const EditProfile = () => {
    const { authUser, setAuthUser } = useAuthContext()
    const [loading, setLoading] = useState(false)
    const bioLimit = 200
    const profileImgRef = useRef()

    const editProfileForm = useRef()
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null)

    const handleImagePreview = (e) => {
        let img = e.target.files[0]
        profileImgRef.current.src = URL.createObjectURL(img)
        setUpdatedProfileImg(img)
    }

    const handleImageUpload = async (e) => {
        if (updatedProfileImg) {
            let loadingToast = toast.loading("Uploading...")
            e.target.setAttribute('disabled', true)
            try {
                const res = await postImage({ image: updatedProfileImg })
                const URL = res.data.file.url;
                if (URL) {
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/update-profile-img', { url: URL }, {
                        headers: {
                            "Authorization": `Bearer ${authUser?.token}`
                        }
                    })
                        .then(({ data }) => {

                            let newUserAuth = { ...authUser, profile_img: data.profile_img }
                            sessionStorage.setItem("user", JSON.stringify(newUserAuth))
                            setAuthUser(newUserAuth)
                            setUpdatedProfileImg(null)
                        })
                        .catch(({ response }) => {
                            toast.dismiss(loadingToast)
                            e.target.removeAttribute("disabled")
                            toast.error(response.data.error)
                        })
                }
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                toast.success("Uploaded")
            } catch (error) {
                toast.dismiss(loadingToast)
                console.log(error)
            }
        }
    }

    const profileDataStructure = {
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
        social_links: {
            youtube: "",
            instagram: "",
            facebook: "",
            twitter: "",
            github: "",
            linkedin: "",
        },
        joinedAt: ""
    }
    const [profile, setProfile] = useState(profileDataStructure)

    let { personal_info: { profile_img, username, name, bio, email }, social_links } = profile
    useEffect(() => {

        if (authUser?.token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/get-profile", {
                username: authUser?.username
            }, {
                headers: {
                    "Authorization": `Bearer ${authUser.token}`
                }
            })
                .then(({ data }) => {
                    setProfile(data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [authUser.token])
    const [charactersLeft, setCharacterLeft] = useState(bioLimit)
    const handleCharLeft = (e) => {
        setCharacterLeft(bioLimit - e.target.value.length)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(editProfileForm.current)
        let formData = {}
        for (let [key, value] of form.entries()) {
            formData[key] = value
        }

        let username2
        if(formData.username!=username && formData.username.length>3){
            username2=formData.username
        }
        else{
            username2=username
        }
        const youtube = social_links.youtube ? social_links.youtube : formData.youtube
        const facebook = social_links.facebook ? social_links.facebook : formData.facebook
        const twitter = social_links.twitter ? social_links.twitter : formData.twitter
        const linkedin = social_links.linkedin ? social_links.linkedin : formData.linkedin
        const instagram = social_links.instagram ? social_links.instagram : formData.instagram
        const github = social_links.github ? social_links.github : formData.github


        if (username.length < 3) {
            return toast.error("Username Should Be At least 3 Characters")
        }
        if (bio.length > bioLimit) {
            return toast.error("Bio Should Be Less Than 200 Characters")
        }

        let loadingToast = toast.loading("Updating...")
        e.target.setAttribute("disabled", true)
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/update-profile', { username:username2, bio, social_links: { youtube, facebook, twitter, linkedin, instagram, github } }, {
            headers: {
                "Authorization": `Bearer ${authUser?.token}`
            }
        })
            .then(({ data }) => {
                if (authUser?.username != data.username) {
                    let newUserAuth = { ...authUser, username: data.username }
                    sessionStorage.setItem("user", JSON.stringify(newUserAuth))
                    setAuthUser(newUserAuth)
                }
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                toast.success("Profile Updated")
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                return toast.error(response.data.error)
            })

    }

    return (
        <AnimationWrapper>
            {
                loading ?
                    <Loader />
                    :
                    <form ref={editProfileForm}>
                        <h1 className='max-md:hidden text-2xl'>
                            Edit Profile
                        </h1>
                        <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                            <div className='max-lg:center mb-5'>
                                <label htmlFor='uploadImg' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                    <div className='w-full h-full absolute overflow-hidden top-0 left-0 flex items-center justify-center text-xl text-white  bg-black/70 opacity-0 hover:opacity-100 cursor-pointer'>
                                        Upload Image
                                    </div>
                                    <img ref={profileImgRef} src={profile_img} />
                                </label>
                                <input onChange={(e) => handleImagePreview(e)} type='file' id='uploadImg' hidden accept='.jpeg, .jpg, .png' />
                                <button onClick={handleImageUpload} className='btn-light mt-5 max-lg:center lg:w-full'>
                                    Upload
                                </button>
                            </div>
                            <div className='w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                    <div className='relative w-[100%] mb-6'>
                                        <label className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="text-white w-6 h-6 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                            <input value={name} style={{ fontSize: "16px" }} type="text" name="name" disabled={true} id="name" className="grow text-white" />
                                        </label>
                                    </div>
                                    <div className='relative w-[100%] mb-6'>
                                        <label className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="text-white w-6 h-6 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                            <input value={email} style={{ fontSize: "16px" }} type="text" name="name" disabled={true} id="name" className="grow text-white" />
                                        </label>
                                    </div>

                                </div>

                                <div className='relative w-[100%] mb-6'>
                                    <label htmlFor='username' className="input input-bordered flex items-center gap-2 rounded-full py-8 px-6">
                                        <svg fill="#fff" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1a11,11,0,0,0,0,22,1,1,0,0,0,0-2,9,9,0,1,1,9-9v2.857a1.857,1.857,0,0,1-3.714,0V7.714a1,1,0,1,0-2,0v.179A5.234,5.234,0,0,0,12,6.714a5.286,5.286,0,1,0,3.465,9.245A3.847,3.847,0,0,0,23,14.857V12A11.013,11.013,0,0,0,12,1Zm0,14.286A3.286,3.286,0,1,1,15.286,12,3.29,3.29,0,0,1,12,15.286Z" /></svg>
                                        <input style={{ fontSize: "16px" }} type="text" name="username" placeholder={username} id="username" className="grow" />
                                    </label>
                                </div>
                                <textarea onChange={handleCharLeft} name='bio' maxLength={bioLimit} defaultValue={bio} className='input-box h-64 lg:h-40 resize-none text-xl leading-7 mt-5 pl-5 bg-grey/5  placeholder:text-grey/60 placeholder:text-xl text-grey/60
                                ' placeholder='Bio...'>

                                </textarea>
                                <p className='text-grey/80 mb-8'><span className='font-mono'>{charactersLeft}</span> Characters Left</p>
                                
                                <div className='md:grid md:grid-cols-2 gap-x-6'>
                                    {
                                        Object.keys(social_links).map((key, i) => {
                                            let link = social_links[key]
                                            
                                            return (
                                                <div>
                                                    <label className="input my-2 input-bordered flex items-center gap-2">
                                                        <box-icon name={`${key}`} type='logo' color='#ffffff' ></box-icon>
                                                        <input key={i}
                                                            name={key} type="text" className="grow" placeholder={link} />
                                                    </label>

                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <button onClick={handleSubmit} type='submit' className='btn-light w-auto mt-5 px-10'>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile
