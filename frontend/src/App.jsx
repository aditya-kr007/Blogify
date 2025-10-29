import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from "./context/AuthContext";
import Editor from "./pages/Editor";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ErrorPage from "./pages/404.page";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import SideNavBar from "./components/SideNavBar";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Notificaion from "./pages/Notificaion";
import ManageBlogs from "./pages/ManageBlogs";

const App = () => {
    let { authUser } = useAuthContext()
    return (
        <>
            <Routes>
                <Route path='/editor' element={<Editor />} />
                <Route path="/editor/:blog_id" element={<Editor />} />
                <Route path="/" element={<Navbar />}>
                    <Route index element={<HomePage />} />

                    <Route path="dashboard" element={<SideNavBar />}>
                        <Route path="blogs" element={<ManageBlogs />} />
                        <Route path="notifications" element={<Notificaion />} />

                    </Route>
                    <Route path="settings" element={<SideNavBar />}>
                        <Route path="edit-profile" element={<EditProfile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>
                    
                    <Route path="signup" element={authUser ? <Navigate to={'/'} /> : <UserAuthForm type="signup" />} />
                    <Route path="signin" element={authUser ? <Navigate to={'/'} /> : <UserAuthForm type="signin" />} />
                    <Route path="search/:query" element={<SearchPage />} />
                    <Route path="user/:id" element={<ProfilePage />} />
                    <Route path="blog/:blog_id" element={<BlogPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>
            <Toaster />
        </>

    )
}

export default App;