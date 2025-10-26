import React from 'react'
import { useContext } from 'react';
import { RxCross2 } from "react-icons/rx";
import { EditorContext } from '../pages/Editor';

function Tags({ tag,tagIndex }) {
    let {blog,blog:{tags},setBlog}=useContext(EditorContext)

    const handleTagDelete=()=>{
        tags=tags.filter(t=>t!=tag)
        setBlog({...blog,tags})
    }
    const handleTagEdit=(e)=>{
        if(e.keyCode==13 || e.keyCode==118){
            e.preventDefault()
            let currentTag=e.target.innerText
            tags[tagIndex]=currentTag
            setBlog({...blog,tags})
            e.target.setAttribute("contentEditable",false)

        }
    }

    const addEditable=(e)=>{
        e.target.setAttribute("contentEditable",true)
        e.target.focus()
    }
    return (
        <div className='relative p-2 mt-2 mr-2 px-5 bg-grey rounded-full inline-block hover:bg-opacity-10 pr-10'>
            <p onKeyDown={handleTagEdit} className='outline-none text-black' onClick={addEditable}>{tag}</p>
            <button className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-2/3
            ' onClick={handleTagDelete}>
            <RxCross2 className='text-sm pointer-events-none text-black'/>
            </button>
        </div>
    )
}

export default Tags
