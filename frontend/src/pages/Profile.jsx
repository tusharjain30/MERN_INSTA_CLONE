import React, { useRef, useState } from 'react'
import MyPosts from './mini-components/MyPosts'
import Saved from './mini-components/Saved'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../components/ui/dialog"
import { editProfile } from '../redux/slices/userSlice'
import LoadingBtn from './mini-components/LoadingBtn'

const Profile = () => {

  const dispatch = useDispatch()
  const [active, setActive] = useState("MyPosts")
  const { user, loading } = useSelector(state => state.user)

  const [userName, setUserName] = useState(user?.userName)
  const [bio, setBio] = useState(user?.bio)
  const [gender, setGender] = useState(user?.gender)
  const [profilePic, setProfilePic] = useState(user?.profilePic?.url)
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePic?.url)
  const profilePicRef = useRef()

  const selectProfileHandler = (e) => {
    e.preventDefault()
    profilePicRef.current.click()
  };

  const uploadProfileHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setProfilePic(file)
      setProfilePicPreview(reader.result)
    }
  };

  const updateProfileHandler = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('userName', userName)
    formData.append('bio', bio)
    formData.append('gender', gender)
    formData.append('profilePic', profilePic)

    dispatch(editProfile(formData))
  };

  return (
    <div className='w-full'>
      <div className='flex lg:justify-center p-8 justify-between lg:gap-[14rem] items-center mt-8 mb-8 w-full lg:w-[80%] lg:ml-6 lg:mr-6 border-b pb-16'>
        <div>
          <img src={user?.profilePic?.url ? user?.profilePic?.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"} onClick={selectProfileHandler} className='rounded-full w-[95px] h-[95px] sm:w-[120px] sm:h-[120px] cursor-pointer' alt="profile" />
        </div>
        <div className='flex flex-col gap-6 items-start justify-center'>
          <div className='flex gap-6 items-center'>
            <p>{user?.userName}</p>
            <Dialog>
              <DialogTrigger asChild>
                <button className='bg-[#DBDBDB] hover:bg-gray-300 pt-1 pb-1 pl-2 pr-2 rounded-md text-xs font-semibold duration-200'>Edit profile</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">

                <div className='bg-[#EFEFEF] flex justify-between items-center p-4 mt-4 rounded-lg'>
                  <div className='flex gap-4 items-center'>
                    <div>
                      <img src={profilePicPreview ? profilePicPreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s"} onClick={selectProfileHandler} className='rounded-full w-[60px] h-[60px] cursor-pointer' alt="profile" />
                    </div>
                    <div className='flex flex-col items-start'>
                      <h4 className='text-sm font-semibold'>{user?.userName}</h4>
                      <p className='text-xs text-gray-500'>{user?.bio}</p>
                    </div>
                  </div>
                  <div>
                    <input type="file" className='hidden' ref={profilePicRef} onChange={uploadProfileHandler} />
                    <button className='bg-[#0095F6] hover:bg-[#004ECD] duration-200 text-white pl-2 pr-2 pt-1 pb-1 text-xs rounded-lg cursor-pointer' onClick={selectProfileHandler}>Change photo</button>
                  </div>
                </div>
                <div className='w-full'>
                  <h4 className='font-semibold text-sm'>Username</h4>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className='text-xs w-full px-2 py-1 mt-2 rounded-lg outline-none border border-gray-600' />
                </div>
                <div className='w-full'>
                  <h4 className='font-semibold text-sm'>Bio</h4>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className='text-xs w-full px-2 py-1 mt-2 rounded-lg outline-none border border-gray-600' rows={5}></textarea>
                </div>
                <div className='w-full'>
                  <h4 className='font-semibold text-sm'>Gender</h4>
                  <select className='text-xs w-full px-2 py-1 mt-2 rounded-lg outline-none border border-gray-600' value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className='flex justify-end'>
                  {
                    loading
                      ?
                      <LoadingBtn content={"Updating..."} />
                      :
                      <button className='bg-[#0095F6] hover:bg-[#004ECD] duration-200 text-white pl-4 pr-4 pt-2 pb-2 text-xs rounded-lg cursor-pointer' onClick={updateProfileHandler}>Submit</button>
                  }
                </div>
              </DialogContent>
            </Dialog>

            <button className='bg-[#DBDBDB] hover:bg-gray-300 pt-1 pb-1 pl-2 pr-2 rounded-md text-xs font-semibold duration-200'>View archive</button>
          </div>
          <div className='flex gap-6 items-center'>
            <p className='text-sm font-semibold'>{user?.posts?.length} posts</p>
            <p className='text-sm font-semibold'>{user?.followers?.length} followers</p>
            <p className='text-sm font-semibold'>{user?.following?.length} following</p>
          </div>
          <div className='flex flex-col gap-1 items-start'>
            <p className='font-semibold text-sm'>{user?.bio ? user?.bio : ""}</p>
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
  )
}

export default Profile
