import { useContext } from "react";
import { AuthContext } from "./auth.context";
import{login,register,logout,getMe} from "./services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)

    const {user,setUser,loading,setLoading} = context

    const loginHandle = async (data) => {
        setLoading(true)
        const response = await login(data)
        setUser(response.user)
        setLoading(false)
    }

    const registerHandle = async (data) => {
        setLoading(true)
        const response = await register(data)
        setUser(response.user)
        setLoading(false)
    }

    const logoutHandle = async () => {
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }

    return {user,loading,loginHandle,registerHandle,logoutHandle}
}