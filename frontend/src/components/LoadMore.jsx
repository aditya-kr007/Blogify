import React from 'react'

const LoadMoreDataBtn = ({state,fetchData,additionalParams}) => {
    if(state!=null && state.totalDocs>state.results.length)
        return(
    <button className='dark-grey p-2 px-3 w-full justify-center hover:bg-grey border text-xl border-dark-grey hover:text-black rounded-full flex items-center gap-2' onClick={()=>fetchData({...additionalParams, page:state.page+1})}>Load More</button>)
}

export default LoadMoreDataBtn
