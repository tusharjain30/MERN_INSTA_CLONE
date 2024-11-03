import React from 'react'

const UsersStory = () => {

    const usersStory = [
        {
            id: 1,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
        {
            id: 2,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
        {
            id: 3,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
        {
            id: 4,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
        {
            id: 5,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
        {
            id: 6,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
        {
            id: 7,
            username: "Tushar Jain",
            image: "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
        },
    ]

    return (
        <div className='flex gap-3 items-center justify-center m-2'>
            {
                usersStory.map((curVal) => {
                    return (
                        <div className='flex flex-col items-center cursor-pointer' key={curVal.id}>
                            <img src={curVal.image} className='w-[60px] border-2 border-[#FA499E] rounded-full' />
                            <p className='text-[0.6rem]'>{curVal.username.slice(0, 6) + "..."}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default UsersStory
