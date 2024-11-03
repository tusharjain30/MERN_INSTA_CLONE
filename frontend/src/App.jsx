import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/auth/Auth'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSuggestedUsers, getUser } from './redux/slices/userSlice';
import { getAllPosts, getMyPosts, getSavedPosts } from './redux/slices/postSlice';
import OtherUserProfile from './pages/mini-components/otherUserProfile/OtherUserProfile';

const App = () => {

  const dispatch = useDispatch()
  const {refresh} = useSelector((state) => state.post)
  const {isAuthenticated} = useSelector((state) => state.user)

  useEffect(() => {
     dispatch(getUser())
     dispatch(getAllPosts())
     dispatch(getMyPosts())
     dispatch(getSavedPosts())
     dispatch(getAllSuggestedUsers())
    }, [refresh, isAuthenticated])

  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/auth"} element={<Auth />} />
        <Route path={"/profile/:id"} element={<OtherUserProfile />} />
      </Routes>
      <ToastContainer position='top-right'/>
    </Router>
  )
}

export default App
