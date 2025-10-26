import { createContext, useState,useContext } from "react";

export const AuthContext=createContext()

export const useAuthContext=()=>{
    return useContext(AuthContext)
}

export const AuthContextProvider=({children})=>{
    const [authUser,setAuthUser]=useState(JSON.parse(sessionStorage.getItem("user")) || null)
    // console.log(authUser)
    return(
        <AuthContext.Provider value={{authUser,setAuthUser}}>
            {children}
        </AuthContext.Provider>
    )
}