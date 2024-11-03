import { Heart, MessageCircle } from 'lucide-react'
import React from 'react'
import { FaHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const MyPosts = () => {
  const { user, otherUserProfile } = useSelector(state => state.user)

  return (
    <>
      <div className={`w-full ${otherUserProfile?.posts?.length > 0 ? "grid grid-cols-3 gap-4" : ""} items-center justify-center p-8 mb-4`}>
        {
          otherUserProfile?.posts?.length > 0 ? (
            otherUserProfile?.posts?.map((curVal) => {
              return (
                <div className='relative group cursor-pointer' key={curVal._id}>
                  <img key={curVal._id} src={curVal?.postImage?.url} className='h-[120px] md:h-[230px] w-full cursor-pointer' />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white gap-6'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        {
                          curVal?.likes?.includes(user?._id) ?
                            (
                              <FaHeart className='text-[red] cursor-pointer' size="20" />
                            ) :
                            (
                              <Heart size="20" className='cursor-pointer' onClick={() => likeORDislikeHandler(post._id)} />
                            )
                        }

                        <span className='text-sm'>{curVal.likes.length} Likes</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle size="20" />
                      </button>
                    </div>
                  </div>
                </div>

              )
            })
          ) : (
            <div className='flex flex-col justify-center items-center gap-1 w-full mt-[6rem]'>
              <h1 className='font-extrabold text-2xl'>Share Photos</h1>
              <h1 className='text-xs'>When you share photos, they will appear on your profile.</h1>
            </div>
          )
        }

      </div>
    </>
  )
}

export default MyPosts
