import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const postSlice = createSlice({
    name: "post",
    initialState: {
        loading: false,
        posts: [],
        myPosts: [],
        savedPosts: [],
        message: null,
        refresh: false
    },
    reducers: {
        //create post
        requestForCreatePost(state, action) {
            state.loading = true
            state.posts = state.posts
        },
        successForPost(state, action) {
            state.loading = false
            state.posts = action.payload.post
            state.message = action.payload.message
        },
        failedForCreatePost(state, action) {
            state.loading = false
            state.posts = state.posts
        },

        //get all posts
        requestForGetAllPosts(state, action) {
            // state.loading = true
            state.posts = state.posts
        },
        successForGetAllPosts(state, action) {
            state.loading = false
            state.posts = action.payload
        },
        failedForGetAllPosts(state, action) {
            state.loading = false
            state.posts = state.posts
        },

        //get my posts
        requestForGetMyPosts(state, action) {
            // state.loading = true
            state.myPosts = []
        },
        successForGetMyPosts(state, action) {
            state.loading = false
            state.myPosts = action.payload
        },
        failedForGetMyPosts(state, action) {
            state.loading = false
            state.myPosts = state.myPosts
        },

        //get saved posts
        requestForGetSavedPosts(state, action) {
            // state.loading = true
            state.savedPosts = []
        },
        successForGetSavedPosts(state, action) {
            state.loading = false
            state.savedPosts = action.payload
        },
        failedForGetSavedPosts(state, action) {
            state.loading = false
            state.savedPosts = []
        },

        //delete post
        requestForDeletePost(state, action) {
            state.loading = true
        },
        successForDeletePost(state, action) {
            state.loading = false
            state.message = action.payload
        },
        failedForDeletePost(state, action) {
            state.loading = false
            state.posts = state.posts
        },

        //refresh
        refreshPostSlice(state, action) {
            state.refresh = !state.refresh
        },

        //clear message
        resetPostSliceMessages(state, action) {
            state.message = null
        }
    }
});

export const createPost = (postData) => async (dispatch) => {
    dispatch(postSlice.actions.requestForCreatePost())

    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.post("http://localhost:4000/api/v1/post/addNewPost", postData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })

        dispatch(postSlice.actions.successForPost(data))
        dispatch(postSlice.actions.refreshPostSlice())

    } catch (err) {
        dispatch(postSlice.actions.failedForCreatePost())
        toast.error(err.response.data.message)
    }
};

export const getAllPosts = () => async (dispatch) => {
    dispatch(postSlice.actions.requestForGetAllPosts())

    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.get("http://localhost:4000/api/v1/post/getAllPosts", {
            withCredentials: true
        })

        dispatch(postSlice.actions.successForGetAllPosts(data.posts))

    } catch (err) {
        dispatch(postSlice.actions.failedForGetAllPosts())
        toast.error(err.response.data.message)
    }
};

export const getMyPosts = () => async (dispatch) => {
    dispatch(postSlice.actions.requestForGetMyPosts())

    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.get("http://localhost:4000/api/v1/post/getMyPosts", {
            withCredentials: true
        })

        dispatch(postSlice.actions.successForGetMyPosts(data.posts))

    } catch (err) {
        dispatch(postSlice.actions.failedForGetMyPosts())
        toast.error(err.response.data.message)
    }
};

export const getSavedPosts = () => async (dispatch) => {
    dispatch(postSlice.actions.requestForGetSavedPosts())

    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.get("http://localhost:4000/api/v1/user/getMyBookmarks", {
            withCredentials: true
        })

        dispatch(postSlice.actions.successForGetSavedPosts(data.userDetails))

    } catch (err) {
        dispatch(postSlice.actions.failedForGetSavedPosts())
        toast.error(err.response.data.message)
    }
};

export const deletePosts = (id) => async (dispatch) => {
    dispatch(postSlice.actions.requestForDeletePost())

    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.delete(`http://localhost:4000/api/v1/post/deletePost/${id}`, {
            withCredentials: true
        })

        dispatch(postSlice.actions.refreshPostSlice())
        dispatch(postSlice.actions.successForDeletePost(data.message))

    } catch (err) {
        dispatch(postSlice.actions.failedForDeletePost())
        toast.error(err.response.data.message)
    }
};

export const likeOrDislike = (id) => async () => {
    try {

        const { data } = await axios.put(`http://localhost:4000/api/v1/post/likeOrDislike/${id}`, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        toast.success(data.message)

    } catch (err) {
        toast.error(err.response.data.message)
    }
};

export const addComment = (id, commentData) => async (dispatch) => {
    try {

        const { data } = await axios.post(`http://localhost:4000/api/v1/post/addNewComment/${id}`, commentData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        toast.success(data.message)

    } catch (err) {
        toast.error(err.response.data.message)
    }
};

export const removeComment = (id) => async (dispatch) => {
    try {

        const { data } = await axios.delete(`http://localhost:4000/api/v1/post/removeComment/${id}`, {
            withCredentials: true
        })

        toast.success(data.message)

    } catch (err) {
        toast.error(err.response.data.message)
    }
};

export const bookmark = (id) => async (dispatch) => {
    try {

        const { data } = await axios.put(`http://localhost:4000/api/v1/post/bookmark/${id}`, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        dispatch(postSlice.actions.refreshPostSlice())
        toast.success(data.message)

    } catch (err) {
        toast.error(err.response.data.message)
    }
}

export const followAndUnFollow = (id) => async (dispatch) => {
    try {

        const { data } = await axios.put(`http://localhost:4000/api/v1/user/followOrUnfollow/${id}`, {
            withCredentials: true
        })

        toast.success(data.message)
        dispatch(postSlice.actions.refreshPostSlice())

    } catch (err) {
        toast.error(err.response.data.message)
    }
}

export const getRefreshPostSlice = () => async (dispatch) => {
    dispatch(postSlice.actions.refreshPostSlice())
};

export const resetPostSlice = () => (dispatch) => {
    dispatch(postSlice.actions.resetPostSliceMessages())
};

export default postSlice.reducer