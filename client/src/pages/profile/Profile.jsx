
import './Profile.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { MdOutlineDataSaverOn } from 'react-icons/md';
import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addtopost, addtoreel, savePost, setLoading } from '../../store/Store';
import Follow from './followpage/Follow';
import profile from '../../assets/image/profile.png';
import Navbar from "../../components/navbar/Navbar";

export default function Profile() {
    // Redux state and dispatch
    const posts = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    // State variables for user profile data and interactions
    const [avatar, setAvatar] = useState("");
    const [user, setUser] = useState({});
    const [toggle, setToggle] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [buttonType, setButtonType] = useState("");

    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Fetch user data and posts from the server on component mount
    useEffect(() => {
        if (userData) {
            axios.post('https://social-chat-q1i6.onrender.com/getbyID', { Id: userData._id })
                .then(response => {
                    const { data, user } = response.data;
                    setUser(user)
                    dispatch(addtopost(data));
                    dispatch(addtoreel(data));
                    dispatch(savePost(data));
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);

    // Profile update function for changing avatar
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('img', avatar);
        formData.append('user', userData._id);
        try {
            dispatch(setLoading(true));
            const response = await axios.post('https://social-chat-q1i6.onrender.com/updatepost', formData);
            if (response.data) {
                const updatedUser = response.data.user; // New user data received from the server
                setUser(updatedUser); // Update the user state with the new user data
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                if (updatedUser.email === data.email) {
                    console.log(updatedUser)
                    localStorage.setItem('Data', JSON.stringify(updatedUser));
                }
                dispatch(setLoading(false));
            }
        } catch (error) {
            console.log('fail', error);
        }
    };

    // Function to handle follow/unfollow actions
    const handleFollow = async (e, id, localId) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://social-chat-q1i6.onrender.com/user/followers', {
                userId: id,
                localUser: localId,
            });
            if (response.data) {
                const updatedUserData = { ...userData, followers: response.data.user.followers };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
                setUser(updatedUserData);
            }
        } catch (error) {
            console.log('fail', error);
        }
    };

    // Function to handle follower/following button clicks and get followers/following data
    const handleChange = (newToggle) => {
        setToggle(newToggle);
    };

    const handleButtonClick = async (buttonName) => {
        setToggle(true);
        setButtonType(buttonName);
        try {
            const response = await axios.post('https://social-chat-q1i6.onrender.com/user/getfollowers', {
                buttonName: buttonName,
                userId: user._id,
            });
            const followers = response.data.followers;
            setFollowers(followers);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className='subContainer'>
                    <div className="user">
                        <div className="img_profile">
                            <img src={user?.avatar || profile} className="img-circle img-fluid" alt="Profile" />
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="file"
                                    encType="multipart/form-data"
                                    onChange={e => setAvatar(e.target.files[0])}
                                    id="file"
                                />
                                <button><MdOutlineDataSaverOn /></button>
                            </form>
                        </div>
                        <div className="user_data">
                            <h2>{user ? user.username : "Alston"}
                                <button
                                    type="button"
                                    style={{ display: userData && userData._id === data._id ? "none" : "block" }}
                                    onClick={(e) => { handleFollow(e, userData._id, data._id) }}
                                >
                                    {userData?.followers && userData.followers.includes(data._id) ? "Unfollow" : "Follow"}
                                </button>
                            </h2>
                            <p>Bio</p>
                            <ul className='userfollow_detail1'>
                                <li><strong>{posts.length}</strong> posts</li>
                                <li onClick={() => { handleButtonClick("Followers") }}><strong>{user?.followers?.length || ""}</strong> followers</li>
                                <li onClick={() => { handleButtonClick("Following") }}><strong>{user?.following?.length || ""}</strong> following</li>
                            </ul>
                        </div>
                    </div>
                    <hr className='followUpLine' />
                    <div className='userfollow_detail2'>
                        <span>
                            <p className='follow_count'>{posts.length}</p>
                            <p>posts</p>
                        </span>
                        <span>
                            <p className='follow_count' onClick={() => { handleButtonClick("Followers") }}>{user?.followers?.length || ""}</p>
                            <p>followers</p>
                        </span>
                        <span>
                            <p className='follow_count' onClick={() => { handleButtonClick("Following") }}>{user?.following?.length || ""}</p>
                            <p>following</p>
                        </span>
                    </div>
                    <hr />
                    <div className='row_data'>
                        <span><Link to="/profile/post">Post</Link></span>
                        <span><Link to="/profile/reel">Reel</Link></span>
                        <span><Link to="/profile/save">Saved</Link></span>
                        <span><Link to="/profile/tag">Tagged</Link></span>
                    </div>
                    <Outlet />
                    <Follow
                        user={followers}
                        toggle={toggle}
                        buttonType={buttonType}
                        handleChange={handleChange}
                        handleFollow={handleFollow}
                    />
                </div>
            </div>
        </div>
    );
}
