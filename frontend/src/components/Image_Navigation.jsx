import React, { useEffect, useRef, useState } from 'react'

export let activeTabLineRef
export let activeTabRef
function Inpage_Navigation({ routes, defaultHidden=[""], defaultActiveIndex = 0, children }) {
    let [inPageNavIndex, setInPageIndex] = useState(defaultActiveIndex)
    activeTabLineRef = useRef()
    activeTabRef = useRef()
    const [isResizeEventAdded,setIsResizeEventAdded]=useState(false)
    const [width,setWith]=useState(window.innerWidth)
    const ChangePageState = (btn, i) => {
        //offsetWidth is a HTML property of button which returns the width of the button and offsetLeft returns hwo far the button is from left these can be used to style the hr
        let { offsetWidth, offsetLeft } = btn

        activeTabLineRef.current.style.width = offsetWidth + "px"
        activeTabLineRef.current.style.left = offsetLeft + "px"
        setInPageIndex(i)

    }
    useEffect(() => {
        if(width>774 && inPageNavIndex!=defaultActiveIndex){
            ChangePageState(activeTabRef.current, defaultActiveIndex)

        }
        if(!isResizeEventAdded){
            window.addEventListener("resize",()=>{
                if(!isResizeEventAdded)
                    setIsResizeEventAdded(true)
                else{
                    setWith(window.innerWidth)
                }
                
            })
        }
    }, [width])
    return (
        <div>
            <>
                <div className='relative mb-4 border-b border-dark-grey flex-nowrap overflow-x-auto'>
                    {
                        routes.map((route, i) => {
                            return (<button ref={i == defaultActiveIndex ? activeTabRef : null}
                                onClick={(e) => { ChangePageState(e.target, i) }} key={i} className={"px-4 py-5 capitalize md:text-xl " + (inPageNavIndex == i ? "text-white " : "text-dark-grey " ) + ( defaultHidden.includes(route) ? " md:hidden ": " ")}>
                                {route}
                            </button>)
                        })
                    }
                    <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300' />
                </div>
                {Array.isArray(children)?children[inPageNavIndex]:children}
            </>
        </div>
    )
}

export default Inpage_Navigation
