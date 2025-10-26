import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { storeInSession } from "../common/session";

const useSignin=()=> {
    const[loading,setLoading]=useState(false)
    const Signin=async({email,password})=>{
    let data2
        if(!email || !password){
            toast.error("All fields are required")
            return false
        } 
        if (!email.length){
            toast.error("Email is required")
            return false
        }
        if (!emailRegex.test(email)){ 
            toast.error("Email is invalid")
            return false
        }
        if (!passwordRegex.test(password)){
            toast.error("Password should be 6 letters long containing alpha-numeric")
            return false
        } 
        setLoading(true)
        try {
            const res=await fetch(import.meta.env.VITE_SERVER_DOMAIN+"/api/auth/signin",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })
            })
            const data= await res.json()
            storeInSession("user",JSON.stringify(data))
            data2=JSON.stringify(data)
            if(data.error){
                throw new Error(data.error)
            }
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.message)
        }
        finally{
            setLoading(false)
        }
        return data2
    }
    return {loading,Signin}
}
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
export default useSignin
