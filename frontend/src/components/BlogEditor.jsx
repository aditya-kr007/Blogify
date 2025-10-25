import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../imgs/logo.svg'
import AnimationWrapper from '../common/PageAnimation'
import defaultBanner from '../imgs/BlogBanner.png'
import { postImage } from '../api'
import toast from 'react-hot-toast'
import { EditorContext } from '../pages/Editor'
import EditorJs from '@editorjs/editorjs'
import { tools } from './Tools'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

function BlogEditor() {
    const { blog_id } = useParams()
    const [imagePreview, setImagePreview] = useState(""); // <- To 
    const [imageFile, setImageFile] = useState({});
    const { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditor } = useContext(EditorContext)
    // const [imageUrl, setImageUrl] = useState(null);
    let navigate = useNavigate()

    const { authUser: { token } } = useContext(AuthContext)

    useEffect(() => {
        const x = window.location.pathname
        if(x==="/editor"){
            if(!textEditor.isReady){
                setTextEditor(new EditorJs({
                    holder: "textEditor",
                    data: content,
                    tools: tools,
                    placeholder: "Let's write a story"
                })
                )
            }
        }

        else{
            setTextEditor(new EditorJs({
                holder: "textEditor",
                data: content?content[0]:content,
                tools: tools,
                placeholder: "Let's write a story"
            })
            )
        }
        




    }, [blog])


    const handleImagePreview = (e) => {	// <- This will let you preview the uploaded image
        const file = e.target.files[0];
        setImageFile(file);

        if (file) {
            const reader = new FileReader();

            reader.addEventListener("load", e => {
                setImagePreview(e.target.result);
            });

            reader.readAsDataURL(file);
        }

    };

    const handleSubmit = async () => {	// <- This will send the selected image to our api
        let loadingToast = toast.loading("Uploading..")
        try {
            const res = await postImage({ image: imageFile });
            toast.dismiss(loadingToast)
            toast.success("Uploaded")
            setBlog({ ...blog, banner: res.data.file.url })
            // console.log(res.data.data.imageUrl);
            // setImageUrl(res.data.data.imageUrl);
        }
        catch (err) {
            toast.dismiss(loadingToast)
            // toast.error("Can't upload an empty file")
            console.log(err)
        }
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) => {
        // console.log(e.target.value)
        let input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + "px"
        setBlog({ ...blog, title: input.value })
    }

    const handlePublishEvent = () => {

        if (!banner.length) {
            return toast.error("Please Upload A Blog Image")

        }
        if (!title.length) {
            return toast.error("Please Enter A Title")
        }


        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    setEditor("publish")
                }
                else {
                    return toast.error("Please Enter Some Content to publish Your Blog")
                }
            })
        }

    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return
        }
        if (!title.length) {
            return toast.error(" Blog Title is required before saving as a draft")
        }
        let DraftToast = toast.loading("Saving Draft")
        e.target.classList.add('disable')
        if (textEditor.isReady) {
            textEditor.save().then(content => {
                axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/create-blog', {
                    title,
                    tags,
                    banner,
                    content,
                    id: blog_id,
                    draft: true,
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .then(() => {
                        e.target.classList.remove("disabled")
                        toast.dismiss(DraftToast)
                        toast.success("Saved as Draft")
                        setTimeout(() => {
                            navigate("/dashboard/blogs?tab=draft")
                        }, 500)
                    })
                    .catch(err => {
                        console.log(err)
                        e.target.classList.remove("disabled")
                        toast.dismiss(DraftToast)
                        return toast.error(err.response.data.error)
                    })
            })
        }

    }

    return (
        <>
            <nav className='navbar bg-neutral-700  bg-opacity-5'>
                <Link className='flex-none' to={'/'}>
                    <img src={logo} alt='logo' className='w-12 h-12' />
                </Link>
                <p className="max-md:hidden text-dark-grey line-clamp-1 text-3xl w-full ">
                    {title.length ? title : "New Blog"}
                </p>
                <div className='flex gap-4  ml-auto'>
                    <button onClick={handlePublishEvent} className='btn-dark border border-dark-grey '>
                        Publish
                    </button>
                    <button onClick={handleSaveDraft} className='btn-light '>
                        Save as Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper

            >
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video bg-dark-grey border-grey mt-3 rounded-2xl hover:opacity-80'>
                            <label htmlFor='uploadBanner'>
                                <img className='rounded-2xl z-20' src={imagePreview ? imagePreview : defaultBanner} />
                                <input id="uploadBanner" type="file" accept='.png, .jpg, .jpeg' hidden onChange={(e) => handleImagePreview(e)} />
                            </label>
                        </div>
                        <div className='flex justify-end mt-4'>
                            <button type="submit" className='btn-light' onClick={handleSubmit}>
                                Upload
                            </button>
                        </div>

                        <textarea
                            defaultValue={title}
                            placeholder='Blog Title'
                            className='textarea textarea-ghost pl-0 text-4xl  font-medium  w-full h-20 outline-none overflow-hidden resize-none mt-10 leading-tight placeholder:opacity-40 ' onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        >

                        </textarea>
                        <hr className='w-full opacity-10 my-3' />
                        <div id='textEditor'>

                        </div>
                    </div>
                </section>

            </AnimationWrapper>
        </>

    )
}

export default BlogEditor