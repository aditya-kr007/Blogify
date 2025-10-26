import toast from "react-hot-toast"
import { useAuthContext } from "../Context/AuthContext"
import { useState } from "react"
const useChangePassword = () => {
    const [loading, setLoading] = useState(false)
    const {authUser,setAuthUser}=useAuthContext()
    const changePassword=async({currentPassword,newPassword})=>{

        if(!newPassword||!currentPassword){
            toast.error("All fields are required")
            return false
        }
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

        if (!passwordRegex.test(newPassword)){
            toast.error("Password should be 6 letters long containing alpha-numeric")
            return false
        } 
        try {
            const res=await fetch(import.meta.env.VITE_SERVER_DOMAIN+'/api/auth/change-password',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${authUser?.token}`
                },
                body:JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })
            const data= await res.json()
            toast.success("password Changed Successfully")
        } catch (error) {
            toast.error(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {loading,changePassword}
}

export default useChangePassword
