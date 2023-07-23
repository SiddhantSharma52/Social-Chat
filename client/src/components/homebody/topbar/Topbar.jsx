import { useState, useEffect } from 'react';
import './Topbar.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import Logo from '../../../assets/image/logo.png'
import profile from '../../../assets/image/profile.png'

const Topbar = () => {
    // State variables
    const [toggle, setToggle] = useState(false); // For the dropdown toggle
    const [user, setUser] = useState([]);// To store the user data fetched from the server
    const [searchValue, setSearchValue] = useState("");// To hold the value of the search input
    const [searchItem, setSearchItem] = useState([]); // To store the search results

    // Get user data from local storage
    const data = JSON.parse(localStorage.getItem('Data'));

    // Fetch user list from the server on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("https://social-chat-q1i6.onrender.com/user");
                const userData = response.data.data;
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    // Function to sign out the user
    const userSignout = async () => {
        try {
            // toast.warn('Loading');
            const response = await axios.post('https://social-chat-q1i6.onrender.com/user/signout');
            if (response.data) {
                localStorage.clear();// Clear user data from local storage
                toast.success(response.data.message);// Show success message using toast
                window.location.reload();// Refresh the page after sign out
                // Remove session cookies
                document.cookie = 'connect.sidhu; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            }

        } catch (error) {
            console.log('fail', error);
        }
    }

    // Set local storage data for profile show
    const handleLinkClick = () => {
        localStorage.setItem('userData', JSON.stringify(data));
    };
    // Handle searching user
    const handleSerach = (e) => {
        e.preventDefault();
        setSearchValue(e.target.value);
        const userInput = e.target.value.toLowerCase();
        // Filter the items array based on the user's input
        const matchingItems = user.filter(item =>
            item.username.toLowerCase().includes(userInput) ||
            item.email.toLowerCase().includes(userInput)
        );
        setSearchItem(matchingItems);
    }

    return (
        <nav >
            <div className="topnavbar">
                <div className="topnavbar__left">
                    <Link className="topnavbar__brand">
                        <img src={Logo} alt="SS Logo" className="logo-img" style={{ width: '50px' }} />
                    </Link>
                    <ul className="topnavbar__nav">
                        <li className="topnavbar__nav-item">
                            <Link to='/' className="topnavbar__nav-link">Home</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link to='/about' className="topnavbar__nav-link">About</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link className="topnavbar__nav-link">Vision</Link>
                        </li>
                        <li className="topnavbar__nav-item">
                            <Link to="/contact" className="topnavbar__nav-link">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="topnavbar__right">
                    <form className="topnavbar__form">
                        <div className="search-wrapper">
                            <input className="form-control" type="text" placeholder="Search" value={searchValue} onChange={((e) => { handleSerach(e) })} />
                            <button type="submit" className="search-button">
                                <BsSearch />
                            </button>
                            <div style={{ display: searchValue == "" ? "none" : "block" }} className='search_box'>
                                {searchItem.map((user, index) => (
                                    <div className="searchUserData">
                                        <img src={user.avatar} alt="prfile" />
                                        <p>{user.username}</p>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </form>
                    <div className="dropdown nav-item">
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" onClick={((e) => { setToggle(!toggle) })}>
                            <img src={data && data.avatar ? data.avatar : profile} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />

                        </button>
                        <ul className="dropdown-menu" style={{ display: toggle ? "flex" : "none" }}>
                            <li><Link className="dropdown-item" to="/form/signup">Register</Link></li>
                            <li><Link className="dropdown-item" to="/form/signin">Sign in</Link></li>
                            <li><Link className="dropdown-item" to="/profile/post" onClick={handleLinkClick} >Profile</Link></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><Link className="dropdown-item" onClick={userSignout}>Logout</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Topbar;
