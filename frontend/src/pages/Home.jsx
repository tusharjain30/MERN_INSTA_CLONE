import { BadgePlus, CircleUserRound, Clapperboard, Compass, Heart, House, LogOut, MessageCircleMore, Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import AllPosts from './mini-components/AllPosts';
import Profile from './Profile';
import { Button } from "../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/userSlice';
import { createPost, getAllPosts, resetPostSlice } from '../redux/slices/postSlice';
import LoadingBtn from './mini-components/LoadingBtn';
import { toast } from 'react-toastify';

const Home = () => {

    const [active, setActive] = useState("Home")
    const { isAuthenticated } = useSelector(state => state.user)
    const { loading, message } = useSelector(state => state.post)
    const navigateTo = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.user)
    const [caption, setCaption] = useState("")
    const [postImage, setPostImage] = useState("")
    const [postImagePreview, setPostImagePreview] = useState("")
    const selectImageRef = useRef()

    useEffect(() => {
        if (!isAuthenticated) {
            navigateTo("/auth")
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch(resetPostSlice())
            dispatch(getAllPosts())
        }
    }, [dispatch, message])

    const logoutHandler = (e) => {
        e.preventDefault()
        dispatch(logout())
    }

    const selectImageHandler = (e) => {
        e.preventDefault()
        selectImageRef.current.click()
    }

    const postImageHandler = (e) => {
        const file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setPostImage(file)
            setPostImagePreview(reader.result)
        }
    }

    const submitPostImageHandler = () => {
        console.log(caption)
        dispatch(createPost({ postImage, caption }))
        setPostImagePreview("")
        setPostImage("")
        setCaption("")
    }

    return (
        <div className='relative'>
            <div className='w-full flex gap-2 relative'>
                <div className='w-[20%] h-screen xl:border-r flex flex-col pl-6 pr-2 pt-6 pb-6 justify-between hidden md:flex'>
                    <div className='flex flex-col justify-center items-start gap-5 fixed pl-6 left-0'>
                        <h1 className='cursor-pointer text-xl font-bold' onClick={() => setActive("Home")}>Instagram</h1>
                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Home" ? "font-bold" : ""}`} onClick={() => setActive("Home")}><House size="20" />Home</p>
                        <Sheet>
                            <SheetTrigger asChild>
                                <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Search" ? "font-bold" : ""}`} onClick={() => setActive("Search")}><Search size="20" />Search</p>
                            </SheetTrigger>
                            <SheetContent className="flex flex-col gap-8">
                                <SheetHeader>
                                    <SheetTitle>Search</SheetTitle>
                                </SheetHeader>
                                <SheetDescription className="w-full">
                                    <input type="text" placeholder='Search' className="w-full p-2 rounded-md outline-none bg-[#EFEFEF]" />
                                </SheetDescription>
                                <SheetFooter>
                                    <SheetClose asChild>

                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Explore" ? "font-bold" : ""}`} onClick={() => setActive("Explore")}><Compass size="20" />Explore</p>
                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Reels" ? "font-bold" : ""}`} onClick={() => setActive("Reels")}><Clapperboard size="20" />Reels</p>
                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Messages" ? "font-bold" : ""}`} onClick={() => setActive("Messages")}><MessageCircleMore size="20" />Messages</p>
                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Notifications" ? "font-bold" : ""}`} onClick={() => setActive("Notifications")}><Heart size="20" />Notifications</p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Create" ? "font-bold" : ""}`} onClick={() => setActive("Create")}><BadgePlus size="20" />Create</p>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-center">Create new post</DialogTitle>
                                    <div className='flex gap-4 items-center pt-4'>
                                        <div>
                                            <img className='rounded-full w-[40px] h-[40px]' alt="profile" src={user && user.profilePic && user.profilePic.url ? user.profilePic.url : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} />
                                        </div>
                                        <div>
                                            <p className='text-sm font-semibold'>{user && user.userName}</p>
                                            <p className='text-xs text-gray-700'>{user && user.bio}</p>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className='w-full'>
                                    <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder='Write a caption...' className='w-full text-sm p-1 border outline-none'></textarea>
                                </div>
                                {postImagePreview && (<div className='w-full flex justify-center items-center'>
                                    <img className='w-[220px] h-[220px] rounded-sm' src={postImagePreview} />
                                </div>)}
                                <div className='w-full flex justify-center items-center'>
                                    <input type="file" onChange={postImageHandler} className='hidden' ref={selectImageRef} />
                                    <Button type="submit" className="bg-[#037AC8] text-xs" onClick={selectImageHandler}>Select from Computer</Button>
                                </div>
                                {postImagePreview && <DialogFooter className="w-full">
                                    {
                                        loading ? (
                                            <LoadingBtn content={"Posting..."} width={"w-full"} />
                                        ) : (
                                            <Button type="submit" className="text-xs w-full" onClick={submitPostImageHandler}>Post</Button>
                                        )
                                    }
                                </DialogFooter>}
                            </DialogContent>
                        </Dialog>

                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Profile" ? "font-bold" : ""}`} onClick={() => setActive("Profile")}><CircleUserRound size="20" />Profile</p>
                        <p className={`flex gap-2 cursor-pointer items-center hover:bg-[#F1F1F1] duration-200 w-full p-2 text-sm hover:rounded-md ${active == "Logout" ? "font-bold" : ""}`} onClick={logoutHandler}><LogOut size="20" />Logout</p>
                    </div>
                </div>
                {
                    (() => {
                        switch (active) {
                            case "Profile": {
                                return <Profile />
                            }
                            default: {
                                return <AllPosts />
                            }
                        }
                    })()
                }

            </div>
            <div className='w-full md:hidden flex bg-white items-center justify-center fixed bottom-0'>
                <div className='flex border-t justify-center items-center gap-8 pt-4 pb-4 w-full'>
                    <House size="20" onClick={() => setActive("Home")} className='cursor-pointer' />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Search size="20" className='cursor-pointer' />
                        </SheetTrigger>
                        <SheetContent className="flex flex-col gap-8">
                            <SheetHeader>
                                <SheetTitle>Search</SheetTitle>
                            </SheetHeader>
                            <SheetDescription className="w-full">
                                <input type="text" placeholder='Search' className="w-full p-2 rounded-md outline-none bg-[#EFEFEF]" />
                            </SheetDescription>
                            <SheetFooter>
                                <SheetClose asChild>

                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                    <Compass size="20" />
                    <MessageCircleMore size="20" />
                    <Heart size="20" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <BadgePlus size="20" onClick={() => setActive("Create")} className='cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-center">Create new post</DialogTitle>
                                <div className='flex gap-4 items-center pt-4'>
                                    <div>
                                        <img className='rounded-full w-[40px] h-[40px]' alt="profile" src={user && user.profilePic && user.profilePic.url ? user.profilePic.url : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} />
                                    </div>
                                    <div className='flex flex-col items-start'>
                                        <p className='text-sm font-semibold'>{user && user.userName}</p>
                                        <p className='text-xs text-gray-700'>{user && user.bio}</p>
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className='w-full'>
                                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder='Write a caption...' className='w-full text-sm p-1 border outline-none'></textarea>
                            </div>
                            {postImagePreview && (<div className='w-full flex justify-center items-center'>
                                <img className='w-[220px] h-[220px] rounded-sm' src={postImagePreview} />
                            </div>)}
                            <div className='w-full flex justify-center items-center'>
                                <input type="file" onChange={postImageHandler} className='hidden' ref={selectImageRef} />
                                <Button type="submit" className="bg-[#037AC8] text-xs" onClick={selectImageHandler}>Select from Computer</Button>
                            </div>
                            {postImagePreview && <DialogFooter className="w-full">
                                {
                                    loading ? (
                                        <LoadingBtn content={"Posting..."} width={"w-full"} />
                                    ) : (
                                        <Button type="submit" className="text-xs w-full" onClick={submitPostImageHandler}>Post</Button>
                                    )
                                }
                            </DialogFooter>}
                        </DialogContent>
                    </Dialog>
                    <CircleUserRound size="20" onClick={() => setActive("Profile")} className='cursor-pointer' />
                    <LogOut size="20" onClick={logoutHandler} className='cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

export default Home
