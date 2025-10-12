import { useState,useEffect } from "react";
import { useSelector } from "react-redux";

export const useAuth = () =>{
    const [isHydrated, setIsHydrated]=useState(false)
    const auth = useSelector((state)=>state.auth)

    useEffect(()=>{
        const checkHydration = async () => {
            try {
                const persistedAuth = localStorage.getItem('persist : root')
                if(persistedAuth){
                    const persedAuth = JSON.parse(persistedAuth)
                    const authState = JSON.parse(persedAuth)

                    if(authState && authState.userData){
                        setIsHydrated(true)
                        return;
                    }
                }
                setIsHydrated(true)
            }
            catch (error){
               setIsHydrated(true)
            }
            
        }
        checkHydration();
    },[])

    return {
        isHydrated,
        isLoggedIn: auth?.isLoggedIn,
        userId: auth?.userData?._id,
        userData: auth?.userData,
        accessToken: auth?.accessToken
    }
}