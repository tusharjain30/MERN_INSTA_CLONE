import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../redux/slices/userSlice'
import LoadingBtn from '../mini-components/LoadingBtn'

const Auth = () => {

    const dispatch = useDispatch()
    const {loading, user, isAuthenticated} = useSelector((state) => state.user)
    const navigateTo = useNavigate()

    const [isLogin, setIsLogin] = useState(true)
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler = (e) => {
        e.preventDefault()

        if(isLogin){
            dispatch(login({email, password}))
        }
        else{
            dispatch(register({userName, email, password}))
        }
    };

    useEffect(() => {
        if(isAuthenticated){
            navigateTo('/')
        }
    }, [isAuthenticated, user])

    return (
        <div className='w-full h-screen flex justify-center items-center' style={{ backgroundImage: "linear-gradient(#7642C9, #CE2A7E, #FB7E1F)" }}>
            <div className='w-full m-8 lg:m-0 lg:w-[30%] border flex flex-col items-center p-4 gap-4 bg-white rounded-md'>
                <h1 className='text-2xl font-semibold'>Instagram</h1>
                <div className='flex flex-col'>
                    <p className='text-gray-600 text-center text-sm'>{isLogin ? "Sign in" : "Sign up"} to see photos and videos</p>
                    <p className='text-gray-600 text-center text-sm'>from your friends.</p>
                </div>
                {
                    !isLogin ? (
                        <div className='w-full'>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter Username" className='text-sm w-full outline-none border border-gray-400 p-1' />
                        </div>
                    ) : ""
                }

                <div className='w-full'>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" className='text-sm w-full outline-none border border-gray-400 p-1' />
                </div>
                <div className='w-full'>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className='text-sm w-full outline-none border border-gray-400 p-1' />
                </div>
                <div className='w-full'>
                {
                    loading ? (
                        <LoadingBtn content={"Loading..."} width={"w-full"}/>
                    ) : (
                        <button type='submit' onClick={submitHandler} className='bg-[#0198FE] hover:bg-[#0194F7] duration-200 text-sm text-white p-1 w-full'>{isLogin ? "Sign in" : "Sign up"}</button>
                    )
                }
                </div>
                <div className='w-full text-center'>
                    <p className='text-sm'>{isLogin ? "Don't have an account?" : "Have an account?"} <span className='text-[#0198FE] cursor-pointer' onClick={() => setIsLogin(!isLogin)}>{!isLogin ? "Sign in" : "Sign up"}</span></p>
                </div>
            </div>
        </div>
    )
}

export default Auth
