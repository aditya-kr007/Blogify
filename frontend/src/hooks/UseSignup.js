import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { storeInSession } from "../common/session";

const useSignup=()=> {
    const[loading,setLoading]=useState(false)
    const Signup=async({email,password,name})=>{
    let data2
        if(!email || !password || !name){
            toast.error("All fields are required")
            return false
        } 
        if (name.length < 3){
            toast.error("Name must be 3 letters long")
            return false;
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
            const res=await fetch(import.meta.env.VITE_SERVER_DOMAIN+"/api/auth/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password,
                    name
                })
            })
            const data= await res.json()
            storeInSession("user",JSON.stringify(data))
            data2=JSON.stringify(data)
            if(data.error){
                throw new Error(data.error)
            }
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.message)
        }
        finally{
            setLoading(false)
        }
    return data2
    }
    return {loading,Signup}
}


const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export default useSignup
