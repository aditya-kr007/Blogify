import React from 'react'

const Img=({url,caption})=>{
    return (
        <div>
            <img src={url} alt={caption} className='w-full rounded-md'/>
            <p style={{fontSize:"18px"}} className='w-full text-xl text-dark-grey text-center md:mb-10'>{caption}</p>
        </div>
    )
}

const Quote=({quote,caption})=>{
    return <div className=' border-l-4 border-grey mb-3 mt-5 pl-4'>
        <p className='text-2xl leading-10 md:text-2xl'>{quote}</p>
        <p style={{fontSize:"18px"}} className='w-full md:mb-12 text-dark-grey'>{caption}</p>
    </div>
}

const List=({style,items})=>{
    return(
        <ol className={`pl-5 ${style=="unordered"?"list-disc":"list-decimal"}`}>
            {items.map((item,index)=>{
                return <li key={index} dangerouslySetInnerHTML={{__html:item}} className='my-4 text-2xl'></li>
            })}
        </ol>
    )
}
const BlogContent = ({block}) => {
    let {type,data}=block
    if(type=="paragraph"){
        return <p className='text-2xl md:text-xs mt-2 mb-2' dangerouslySetInnerHTML={{__html:data.text}}></p>
    }
    if(type=="header"){
        if(data.level==2){
            return <h3 className='text-3xl  font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h3>
        }
        else if(data.level==3){
            return <h2 className='text-4xl  font-bold' dangerouslySetInnerHTML={{__html:data.text}}></h2>
        }
    }

    if(type=="quote"){
        return <Quote quote={data.text} caption={data.caption} />
    }
    if(type=="list"){
        return <List style={data.style} items={data.items}/>
    }
    if(type=="image"){
        return <Img url={data.file.url} caption={data.caption}/>
    }
    
    return(
        <h1>this is the block</h1>
    )
    
    
}

export default BlogContent
