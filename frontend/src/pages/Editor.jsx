import { Navigate, useLocation, useParams } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { createContext, useEffect, useState } from "react"
import BlogEditor from "../components/BlogEditor"
import PublishForm from "../components/PublishForm"
import Loader from "../components/Loader"
import axios from "axios"


export const EditorContext=createContext()

const Editor=()=>{

    const blog_id=useParams()
    const BlogStructure={
        title:"",
        banner:"",
        content: [{
            time:"",
            blocks:[
            ]
        },
    ],
        author:{personal_info:{}},
        tags:[],
        des:[]
    }

    const {authUser:{token},setAuthUser}=useAuthContext()
    const [editor,setEditor]=useState("editor")
    const [blog,setBlog]=useState(BlogStructure)
    const [textEditor,setTextEditor]=useState({isReady:false})
    const [loading,setLoading]=useState(false)

    const id=blog_id["blog_id"]
    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/get-blog', { blog_id:id, draft:true,mode:"edit" })
            .then(({ data: { blog } }) => {
                setBlog(blog)

            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(()=>{        
        const x=window.location.pathname
        if((x.split('/')[2])!=null){
            fetchBlog()
        }
        

    },[])
return(
    <EditorContext.Provider value={{blog,setBlog,editor,setEditor, textEditor,setTextEditor}}>
        {
        token===null?<Navigate to={'/signup'}/>
        
        :editor==="editor"?<BlogEditor/>:<PublishForm/>
        }
    </EditorContext.Provider>
)
}

export default Editor