import React, { useEffect } from 'react'
import Signup from '../components/Signup'
import Signin from '../components/Signin'
import AnimationWrapper from '../common/PageAnimation'
import { useAuthContext } from '../context/AuthContext'
const UserAuthForm = ({type}) => {
    // const {authUser,setAuthUser}=useAuthContext()
    // console.log(authUser.token)
    return (
        <AnimationWrapper keyValue={type}>
            {
                type =='signup'?<Signup/>:<Signin/>

            }
            </AnimationWrapper>
        
    )
}

export default UserAuthForm
