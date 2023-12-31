import './Sidebar.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { MdSlowMotionVideo } from 'react-icons/md';
import { BsPlusCircle, BsChatLeft } from 'react-icons/bs'
import { AiOutlineHeart, AiOutlineHome, AiOutlineMessage } from 'react-icons/ai'
import profile from '../../../assets/image/profile.png'
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.user);
    const [user, setUser] = useState([]);

    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));

    // Fetch user data from the server using Axios
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://social-chat-q1i6.onrender.com/user");
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Handle click on user profile link
    const handleUserProfile = async (e, user) => {
        e.preventDefault();
        if (data) {
            try {
                localStorage.setItem('userData', JSON.stringify(user));
                // Redirect to the profile page
                navigate('/profile/post');
            } catch (error) {
                console.log('fail', error);
            }
        }
        else {
            toast.warning("User not loging")
        }

    }

    return (
        <div className="sidebar">
            <div className="user__profile" onClick={((e) => { handleUserProfile(e, data) })}>
                <img src={data ? data.avatar : profile} />
                <h4>{data && data.avatar ? data.username : "Alston"}</h4>
            </div>
            <div className="logo-wrapper"></div>
            <ul className="sidebar-menu">
                <li>
                    <a href="#" className="nav-link"
                        onClick={(() => { window.location.reload() })}
                    >
                        <span className="icon">
                            <AiOutlineHome />
                        </span>
                        <p>Home</p>
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <BsChatLeft />
                        </span>
                        <p>Chat</p>
                    </a>
                </li>
                <li>
                    <Link to="/reels" className="nav-link">
                        <span className="icon">
                            <MdSlowMotionVideo />
                        </span>
                        <p>Reels</p>
                    </Link>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineMessage />
                        </span>
                        <p>Messages</p>
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <AiOutlineHeart />
                        </span>
                        <p>Notifications</p>
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link">
                        <span className="icon">
                            <BsPlusCircle />
                        </span>
                        <p>Setting</p>
                    </a>
                </li>
            </ul>

            <ul className="sidebar-menu bottom">
                <li>
                    <a href="#" className="nav-link">
                        <p>More</p>

                    </a>
                </li>
            </ul>
            <hr style={{ width: "90%" }} />
            <div className="sidebarFriend">
                <h3>Friends</h3>
                {user.map((data, index) => (
                    <li className='sidebar__User' key={index} onClick={((e) => { handleUserProfile(e, data) })} >
                        <img src={data.avatar ? data.avatar : profile} />
                        <span className="sidebarFrindName">{data.username}</span>
                    </li>
                ))}
            </div>

        </div >
    );
}
