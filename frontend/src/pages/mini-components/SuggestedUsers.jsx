import { Link } from 'react-router-dom'
import { followAndUnFollow } from '../../redux/slices/postSlice'
import { useDispatch, useSelector } from 'react-redux'

const SuggesstedUsers = () => {

    const { suggestedUsers, user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const followORUnFollowHandler = (id) => {
        dispatch(followAndUnFollow(id))
    }

    return (
        <div className='flex flex-col mt-4 mb-4 w-full gap-4 relative'>
            {
                suggestedUsers && suggestedUsers.length > 0 ? (
                    suggestedUsers.map((suggestedUser) => {
                        return (
                            <div className='flex items-center gap-24' key={suggestedUser._id}>
                                <Link to={`/profile/${suggestedUser._id}`}>
                                    <div className='flex gap-2 items-center'>
                                        <img className='rounded-full w-[40px] border cursor-pointer' src={suggestedUser.profilePic && suggestedUser.profilePic.url ? suggestedUser.profilePic.url : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} />
                                        <div>
                                            <p className='text-[0.8rem] font-semibold cursor-pointer'>{suggestedUser.userName}</p>
                                            {
                                                suggestedUser.bio && (
                                                    <p className='text-[0.7rem] cursor-pointer'>{suggestedUser.bio}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </Link>
                                <div className='absolute right-0'>
                                    <a className='text-[#0095F6] text-xs font-semibold cursor-pointer' onClick={() => followORUnFollowHandler(suggestedUser._id)}>{suggestedUser?.followers?.includes(user._id) ? "Following" : "Follow"}</a>
                                </div>
                            </div>

                        )
                    })
                ) : (
                    <h1>Users not found</h1>
                )
            }

        </div>
    )
}

export default SuggesstedUsers
