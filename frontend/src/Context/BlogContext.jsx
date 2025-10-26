// import { createContext,useState,useContext } from "react"

// const BlogStructure={
//     title:"",
//     banner:"",
//     content:"",
//     author:{personal_info:{}},
//     tags:[],
//     des:[]
// }

// export const BlogContext=createContext()

// export const useBlogContext=()=>{
//     return useContext(BlogContext)
// }

// export const BlogContextProvider=({children})=>{
//     const [blog,setBlog]=useState(BlogStructure)
//     return(
//         <BlogContext.Provider value={{blog,setBlog}}>
//             {children}
//         </BlogContext.Provider>
//     )
// }