import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'
import FilterPagination from '../common/FliterPagination'
import Loader from '../components/Loader'
import NloBlogData from '../components/NloBlogData'
import AnimationWrapper from '../common/PageAnimation'
import NotificationsCard from '../components/NotificationsCard'
import LoadMoreDataBtn from '../components/LoadMore'


const Notificaion = () => {
    const [filter, setFilter] = useState("all")
    let filters = ["all", "like", "comment", "reply"]

    const [notifications, setNotifications] = useState(null)
    const { authUser, setAuthUser } = useAuthContext()
    const fetchNotification = ({ page, deletedDocsCount }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/notifications", { page, filter, deletedDocsCount }, {
            headers: {
                "Authorization": `Bearer ${authUser?.token}`
            }
        })
            .then(async ({ data: { notifications: data } }) => {
                if(authUser?.new_notification){
                    setAuthUser({...authUser,new_notification:false})
                }
                let formattedData = await FilterPagination({
                    state: notifications,
                    data,
                    page,
                    countRoute: "/all-notificationCount",
                    data_to_send: { filter },
                    user: authUser?.token
                })
                setNotifications(formattedData)

            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        if (authUser?.token)
            fetchNotification({ page: 1, deletedDocsCount: 0 })
    }, [filter])
    const handleFilter = (e) => {
        setFilter(e.target.innerHTML)
        setNotifications(null)
    }
    return (
        <div>
            <h1 className='max-md:hidden text-2xl'>Recent Notifications</h1>
            <div className='my-8 flex gap-3 md:gap-10'>
                {
                    filters.map((filterName, i) => {
                        return (
                            <button onClick={handleFilter} key={i} className={'py-2 ' + (filter == filterName ? "whitespace-nowrap bg-dark-grey/50 text-white rounded-full md:py-3 md:px-6 py-2 px-3 text-xl capitalize hover:bg-opacity-90" : "btn-light")}>
                                {filterName}
                            </button>
                        )
                    })
                }
            </div>
            {
                notifications == null ? <Loader /> :
                    <>
                        {
                            !notifications.results.length ? <NloBlogData message={"No New Notification"} />
                                :
                                notifications.results.map((notification,index)=>{
                                    
                                    return(
                                        <AnimationWrapper key={index} transition={{ duration: 1, delay: index *0.08 }}>
                                            <NotificationsCard data={notification} index={index} notificaionState={{notifications,setNotifications}}/>
                                        </AnimationWrapper>
                                    )
                                })

                        }
                        <LoadMoreDataBtn state={notifications} fetchData={fetchNotification} additionalParams={{deletedDocsCount:notifications.deletedDocsCount}}/>
                    </>
            }
        </div>
    )
}

export default Notificaion
