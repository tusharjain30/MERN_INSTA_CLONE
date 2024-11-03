import React, { useEffect, useState } from 'react'
import MyPosts from './MyPosts'
import Saved from './Saved'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getOtherUserProfileData } from '../../../redux/slices/userSlice'
import { ClipLoader } from 'react-spinners'
import { followAndUnFollow, getRefreshPostSlice } from '../../../redux/slices/postSlice'

const OtherUserProfile = () => {

   
    const [active, setActive] = useState("MyPosts")
    const { loading, otherUserProfile, user } = useSelector(state => state.user)
    const { refresh } = useSelector(state => state.post)
    const { id } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOtherUserProfileData(id))
    }, [id, refresh])

    const followORUnFollowHandler = (userId) => {
        dispatch(followAndUnFollow(userId))
        dispatch(getOtherUserProfileData(id))
        dispatch(getRefreshPostSlice())
    }

    return (
        <>
            {loading ?
                (
                    <div className='h-screen w-full flex justify-center items-center'>
                        <ClipLoader
                            color="#FA499E"
                            loading={loading}
                            size={80}
                        />
                    </div>
                )
                :
                (
                    <div className='w-full'>
                        <div className='flex lg:justify-center p-8 justify-between lg:gap-[14rem] items-center mt-8 mb-8 w-full lg:w-[80%] lg:ml-6 lg:mr-6 border-b pb-16'>
                            <div>
                                <img src={otherUserProfile && otherUserProfile?.profilePic ? otherUserProfile?.profilePic?.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"} className='rounded-full w-[95px] h-[95px] sm:w-[120px] sm:h-[120px] cursor-pointer' alt="profile" />
                            </div>
                            <div className='flex flex-col gap-6 items-start justify-center'>
                                <div className='flex gap-6 items-center'>
                                    <p>{otherUserProfile?.userName}</p>
                                    <button className={`${otherUserProfile?.followers?.includes(user._id) ? "bg-[#DBDBDB] hover:bg-gray-300 duration-200 text-black" : "bg-[#0095F6] hover:bg-[#004ECD] text-white duration-200"} pt-1 pb-1 pl-2 pr-2 rounded-md text-xs font-semibold duration-200`} onClick={() => followORUnFollowHandler(otherUserProfile._id)}>{otherUserProfile?.followers?.includes(user._id) ? "Following" : "Follow"}</button>
                                    <button className='bg-[#DBDBDB] hover:bg-gray-300 pt-1 pb-1 pl-2 pr-2 rounded-md text-xs font-semibold duration-200'>View archive</button>
                                </div>
                                <div className='flex gap-6 items-center'>
                                    <p className='text-sm font-semibold'>{otherUserProfile?.posts?.length} posts</p>
                                    <p className='text-sm font-semibold'>{otherUserProfile?.followers?.length} followers</p>
                                    <p className='text-sm font-semibold'>{otherUserProfile?.following?.length} following</p>
                                </div>
                                <div className='flex flex-col gap-1 items-start'>
                                    <p className='font-semibold text-sm'>{otherUserProfile?.bio ? otherUserProfile?.bio : ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex justify-center items-center'>
                            <div className='flex justify-center gap-12 items-center w-[40%]'>
                                <p className={`uppercase text-xs cursor-pointer ${active == "MyPosts" ? "font-bold" : ""}`} onClick={() => setActive("MyPosts")}>Posts</p>
                                <p className={`uppercase text-xs cursor-pointer ${active == "Saved" ? "font-bold" : ""}`} onClick={() => setActive("Saved")}>Saved</p>
                                <p className={`uppercase text-xs cursor-pointer ${active == "Tagged" ? "font-bold" : ""}`}>Tagged</p>
                            </div>
                        </div>
                        {
                            (() => {
                                switch (active) {
                                    case "Saved": {
                                        return <Saved />
                                    }
                                    default: {
                                        return <MyPosts />
                                    }
                                }
                            })()
                        }
                    </div>
                )}
        </>
    )
}

export default OtherUserProfile
