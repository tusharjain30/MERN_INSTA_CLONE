import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlices = createSlice({
    name: "user",
    initialState: {
        loading: false,
        isAuthenticated: false,
        user: {},
        suggestedUsers: [],
        otherUserProfile: []
    },
    reducers: {
        //register
        requestForRegister(state, action) {
            state.loading = true
            state.isAuthenticated = false
            state.user = {}
        },
        successForRegister(state, action) {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
        },
        failedForRegister(state, action) {
            state.loading = false
            state.isAuthenticated = false
            state.user = {}
        },

        //login
        requestForLogin(state, action) {
            state.loading = true
            state.isAuthenticated = false
            state.user = {}
        },
        successForLogin(state, action) {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
        },
        failedForLogin(state, action) {
            state.loading = false
            state.isAuthenticated = false
            state.user = {}
        },

        //logout
        requestForLogout(state, action) {
            state.loading = true
            state.isAuthenticated = state.isAuthenticated
            state.user = state.user
        },
        successForLogout(state, action) {
            state.loading = false
            state.isAuthenticated = false
            state.user = {}
        },
        failedForLogout(state, action) {
            state.loading = false
            state.isAuthenticated = state.isAuthenticated
            state.user = state.user
        },

        //get suggested users
        requestForSuggestedUser(state, action) {
            state.loading = true
            state.suggestedUsers = state.suggestedUsers
        },
        successForSuggestedUser(state, action) {
            state.loading = false
            state.suggestedUsers = action.payload
        },
        FailedForSuggestedUser(state, action) {
            state.loading = false
            state.suggestedUsers = []
        },

        //getUser
        getUserSuccess(state, action) {
            state.loading = state.loading,
            state.isAuthenticated = true
            state.user = action.payload.user
        },
        getUserFailed(state, action) {
            state.loading = state.loading,
            state.isAuthenticated = false
            state.user = {}
        },

        //get other user profile
        getOtherUserProfileRequest(state, action) {
            state.loading = true
            state.otherUserProfile = []
        },
        getOtherUserProfileSuccess(state, action) {
            state.loading = false
            state.otherUserProfile = action.payload
        },
        getOtherUserProfileFailed(state, action) {
            state.loading = false
            state.otherUserProfile = []
        },

        //edit profile
        requestForEditProfile(state, action) {
            state.loading = true
            state.user = state.user
            state.isAuthenticated = state.isAuthenticated
        },
        successForEditProfile(state, action) {
            state.loading = false
            state.user = action.payload
            state.isAuthenticated = state.isAuthenticated
        },
        failedForEditProfile(state, action) {
            state.loading = false
            state.user = state.user
            state.isAuthenticated = state.isAuthenticated
        },
    }
});

export const register = (registerData) => async (dispatch) => {
    dispatch(userSlices.actions.requestForRegister())
    try {

        axios.defaults.withCredentials = true
        const { data } = await axios.post("http://localhost:4000/api/v1/user/register", registerData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        dispatch(userSlices.actions.successForRegister(data.user))
        toast.success(data.message)

    } catch (err) {
        dispatch(userSlices.actions.failedForRegister())
        toast.error(err.response.data.message);
    }
};

export const login = (loginData) => async (dispatch) => {
    dispatch(userSlices.actions.requestForLogin())
    try {

        axios.defaults.withCredentials = true
        const { data } = await axios.post("http://localhost:4000/api/v1/user/login", loginData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        dispatch(userSlices.actions.successForLogin(data.user))
        toast.success(data.message)

    } catch (err) {
        dispatch(userSlices.actions.failedForLogin())
        toast.error(err.response.data.message);
    }
};

export const logout = () => async (dispatch) => {
    dispatch(userSlices.actions.requestForLogout())
    try {
        axios.defaults.withCredentials = true

        const { data } = await axios.get("http://localhost:4000/api/v1/user/logout", {
            withCredentials: true
        })

        dispatch(userSlices.actions.successForLogout())
        toast.success(data.message)

    } catch (err) {
        dispatch(userSlices.actions.failedForLogout())
        toast.error(err.response.data.message)
    }
}

export const getAllSuggestedUsers = () => async (dispatch) => {
    dispatch(userSlices.actions.requestForSuggestedUser())
    try {

        const { data } = await axios.get("http://localhost:4000/api/v1/user/suggestedUsers", {
            withCredentials: true
        })

        dispatch(userSlices.actions.successForSuggestedUser(data.users))

    } catch (err) {
        dispatch(userSlices.actions.FailedForSuggestedUser())
    }
}

export const getUser = () => async (dispatch) => {
    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.get("http://localhost:4000/api/v1/user/getProfile", {
            withCredentials: true
        })

        dispatch(userSlices.actions.getUserSuccess(data))

    } catch (err) {
        dispatch(userSlices.actions.getUserFailed())
        console.log(err.response.data.message)
    }
};

export const getOtherUserProfileData = (id) => async (dispatch) => {
    dispatch(userSlices.actions.getOtherUserProfileRequest())
    try {
        axios.defaults.withCredentials = true
        const { data } = await axios.get(`http://localhost:4000/api/v1/user/getOtherUserProfile/${id}`, {
            withCredentials: true
        })

        dispatch(userSlices.actions.getOtherUserProfileSuccess(data.otherUserProfileData))

    } catch (err) {
        dispatch(userSlices.actions.getOtherUserProfileFailed())
        console.log(err.response.data.message)
    }
};

export const editProfile = (updatedData) => async(dispatch) => {
    dispatch(userSlices.actions.requestForEditProfile())
    try{
        axios.defaults.withCredentials = true
        const {data} = await axios.put("http://localhost:4000/api/v1/user/editProfile", updatedData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })

        dispatch(userSlices.actions.successForEditProfile(data.updatedProfile))
        toast.success(data.message)

    }catch(err){
        dispatch(userSlices.actions.failedForEditProfile())
        toast.error(err.response.data.message)
    }
};

export default userSlices.reducer;