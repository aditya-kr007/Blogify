import toast from "react-hot-toast"
import { authWithGoogle } from "../common/firebase"

const useGoogleAuth=()=>{
    const googleAuth=async(token)=>{
        try {
        // console.log(token)
        const res=await fetch(import.meta.env.VITE_SERVER_DOMAIN+"/api/auth/google-auth",{
            method:'POST',
            headers:{
                
                "Content-Type":"application/json"
            },
            body:JSON.stringify({token})
        })
        const data=await res.json()
        
        sessionStorage.setItem("user",JSON.stringify(data))
        if(data.error){
            throw new Error(data.error)
        }
        return data

        } catch (error) {
            toast.error(error.message)
        }
    }
    return {googleAuth}
}

export default useGoogleAuth