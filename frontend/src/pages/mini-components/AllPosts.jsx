import React, { useEffect, useState } from 'react'
import SuggestedUsers from './SuggestedUsers'
import UsersStory from './UsersStory'
import { Bookmark, Ellipsis, Heart, MessageCircle, Trash } from 'lucide-react'
import { PiShareFatLight } from 'react-icons/pi'
import { FaHeart } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from 'react-redux'
import { addComment, bookmark, deletePosts, followAndUnFollow, getAllPosts, getRefreshPostSlice, likeOrDislike, removeComment } from '../../redux/slices/postSlice'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../../components/ui/dialog"

const AllPosts = () => {

    const { posts, loading, refresh } = useSelector((state) => state.post)
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [comment, setComment] = useState("")

    useEffect(() => {
        dispatch(getAllPosts())
    }, [refresh])

    const deletePostHandler = (id) => {
        dispatch(deletePosts(id))
        dispatch(getAllPosts())
    }

    const likeORDislikeHandler = (id) => {
        dispatch(likeOrDislike(id))
        dispatch(getAllPosts())
        dispatch(getRefreshPostSlice())
    }

    const addCommentHandler = (id) => {
        dispatch(addComment(id, { comment }))
        dispatch(getAllPosts())
        dispatch(getRefreshPostSlice())
        setComment("")
    }

    const removeCommentHandler = (id) => {
        dispatch(removeComment(id))
        dispatch(getAllPosts())
        dispatch(getRefreshPostSlice())
    }

    const bookmarkHandler = (id) => {
        dispatch(bookmark(id))
    }

    const followORUnFollowHandler = (id) => {
        dispatch(followAndUnFollow(id))
    }

    return (
        <div className='flex'>
            <div className='w-full flex flex-col gap-4 items-center'>
                <UsersStory />

                {
                    loading ? (
                        <div className='h-screen w-full flex justify-center items-center'>
                            <ClipLoader
                                color="#FA499E"
                                loading={loading}
                                size={80}
                            />
                        </div>
                    ) : (
                        posts && posts.length > 0 ? (
                            posts?.map((post) => {
                                return (
                                    <div className='flex flex-col w-full gap-2 p-4 w-[80%] md:w-[50%] mb-12' key={post._id}>
                                        <div className='flex items-center justify-between w-full'>
                                            <div className='flex gap-2 items-center'>
                                                <img className='rounded-full w-[30px] h-[30px]' src={post.createdBy && post.createdBy.profilePic && post.createdBy.profilePic.url ? post.createdBy.profilePic.url : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="profileImage" />
                                                <p className='text-xs font-semibold'>{post.userName} . <span className='text-[0.6rem] text-gray-600'>{post.createdAt.toString().slice(0, 10)}</span></p>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Ellipsis className='cursor-pointer' />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-fit text-xs text-center cursor-pointer">
                                                    {post?.createdBy?._id === user?._id ?
                                                        (<p className='font-bold hover:bg-gray-200 p-1 duration-200' onClick={() => deletePostHandler(post._id)}>Delete</p>)
                                                        :
                                                        (<p className='font-bold hover:bg-gray-200 p-1 duration-200' onClick={() => followORUnFollowHandler(post?.createdBy?._id)}>{user?.following?.includes(post?.createdBy?._id) ? "Following" : "Follow"}</p>)}
                                                </DropdownMenuContent>

                                            </DropdownMenu>


                                        </div>
                                        <div>
                                            <a href={post?.postImage && post?.postImage?.url} className='cursor-pointer' target="_blank"><img className='w-full h-auto' src={post.postImage && post.postImage.url} /></a>
                                        </div>
                                        <div className='flex justify-between'>
                                            <div className='flex gap-3 items-center'>
                                                {
                                                    post?.likes && post?.likes?.includes(user?._id) ? (
                                                        <FaHeart className='text-[red] cursor-pointer' size="20" onClick={() => likeORDislikeHandler(post._id)} />
                                                    ) :
                                                        (
                                                            <Heart size="20" className='cursor-pointer' onClick={() => likeORDislikeHandler(post._id)} />
                                                        )
                                                }
                                                <Dialog className="w-full">
                                                    <DialogTrigger asChild>
                                                        <MessageCircle size="20" className='cursor-pointer' />
                                                    </DialogTrigger>
                                                    <DialogContent className="w-full h-screen">
                                                        <div className='relative grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-center pt-4'>
                                                            <div className='w-full hidden md:flex flex-col justify-between h-full'>
                                                                <a href={post?.postImage && post?.postImage?.url} className='cursor-pointer' target="_blank"><img className='w-full h-full' src={post?.postImage && post?.postImage?.url} /></a>
                                                                {
                                                                    post?.likes && post?.likes?.includes(user?._id) ? (
                                                                        <FaHeart className='text-[red] cursor-pointer' size="20" onClick={() => likeORDislikeHandler(post._id)} />
                                                                    ) :
                                                                        (
                                                                            <Heart size="20" className='cursor-pointer' onClick={() => likeORDislikeHandler(post._id)} />
                                                                        )
                                                                }
                                                            </div>
                                                            <div className='flex flex-col items-start gap-4'>
                                                                {
                                                                    post?.comments.length > 0 ?
                                                                        post?.comments?.map((curVal) => {
                                                                            return (
                                                                                <div className='flex w-full items-center gap-2 relative' key={curVal._id}>
                                                                                    <img className='rounded-full w-[30px] h-[30px]' src={curVal.createdBy && curVal.createdBy.profilePic && curVal.createdBy.profilePic.url ? curVal.createdBy.profilePic.url : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="profileImage" />
                                                                                    <p className='text-xs font-semibold'>{curVal.userName}  <span className='text-[0.7rem] text-gray-700'>{curVal.comment}</span></p>
                                                                                    <div className='right-0 absolute'>
                                                                                        {user?._id == curVal?.createdBy?._id && <Trash size="10" onClick={() => removeCommentHandler(curVal._id)} className='cursor-pointer hover:text-[red] duration-200' />}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                        :
                                                                        <div>
                                                                            <p className='text-xs font-semibold'>No comments found!</p>
                                                                        </div>

                                                                }
                                                                <div className='bottom-0 absolute w-full md:w-fit flex gap-2 justify-center items-center'>
                                                                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a comment...' className='w-full p-1 border-t text-xs border-slate-400 outline-none' />
                                                                    {
                                                                        comment && (
                                                                            <a className='text-xs text-[#0095F6] cursor-pointer font-semibold' onClick={() => addCommentHandler(post._id)}>Post</a>
                                                                        )
                                                                    }
                                                                </div>

                                                            </div>
                                                        </div>

                                                    </DialogContent>
                                                </Dialog>
                                                <PiShareFatLight size="20" className='cursor-pointer' />
                                            </div>
                                            <div>
                                                {
                                                    user && user?.bookmarks && user?.bookmarks?.includes(post?._id)
                                                        ? (<FaBookmark size="20" className='cursor-pointer' onClick={() => bookmarkHandler(post?._id)} />)
                                                        :
                                                        (<Bookmark size="20" className='cursor-pointer' onClick={() => bookmarkHandler(post?._id)} />)
                                                }
                                            </div>
                                        </div>
                                        {post.likes && post.likes.length > 0 && (<div className='flex gap-1 items-center'>
                                            <p className='text-xs font-bold'>{post.likes.length}</p>
                                            <p className='text-xs font-bold'>{post.likes.length == 1 ? "Like" : "Likes"}</p>
                                        </div>)}
                                        <div className='flex gap-2 items-center'>
                                            <p className='font-semibold text-[0.8rem]'>{post.userName}</p>
                                            <p className='text-xs'>{post.caption}</p>
                                        </div>
                                        <div className='flex gap-2 items-center justify-center'>
                                            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className='w-full outline-none border-b border-slate-400 pb-1 text-xs' placeholder="Add a comment..." />
                                            {
                                                comment && (
                                                    <a className='text-xs text-[#0095F6] cursor-pointer font-semibold' onClick={() => addCommentHandler(post._id)}>Post</a>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="capitalize h-screen text-center w-full text-lg font-semibold text-[#FA499E]">Posts not found</div>
                        )
                    )
                }

            </div>
            <div className='hidden lg:flex w-[40%] h-screen border-l flex-col pl-6 pr-2 pt-6 pb-6'>
                <h2 className='font-semibold text-gray-500 text-xs'>Suggested for you</h2>
                <SuggestedUsers />
            </div>
        </div>
    )
}

export default AllPosts
