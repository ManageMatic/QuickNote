import { useEffect, useState, useRef } from 'react';
import md5 from 'md5';
import './styles/UserAvatar.css';
import { useNavigate } from 'react-router-dom';

const UserAvatar = (props) => {
    const host = 'http://localhost:5000';
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [avatar, setAvatar] = useState(localStorage.getItem('customAvatar') || null);

    const modalRef = useRef(null);
    const avatarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            let res = await fetch(`${host}/api/auth/getuser`, {
                method: 'POST',
                credentials: 'include',
            });

            if (res.status === 401 || res.status === 403) {
                const ref = await fetch(`${host}/api/auth/refresh-token`, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (ref.ok) {
                    res = await fetch(`${host}/api/auth/getuser`, {
                        method: 'POST',
                        credentials: 'include',
                    });
                }
            }

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        };

        fetchUser();
    }, []);

    // ✅ Handle outside clicks
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                modalOpen &&
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                !avatarRef.current.contains(e.target)
            ) {
                setModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [modalOpen]);

    const toggleModal = () => setModalOpen((prev) => !prev);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result;
                setAvatar(base64Image);
                localStorage.setItem('customAvatar', base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogOut = async () => {
        try {
            const response = await fetch(`${host}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
            if (response.ok) {
                props.showAlert("Logged out successfully", "success");
                navigate('/login');
            } else {
                props.showAlert("Failed to log out", "danger");
            }
        } catch (error) {
            props.showAlert("An error occurred while logging out", "danger");
        }
    }


    const displayImage =
        avatar || (user?.email ? `https://www.gravatar.com/avatar/${md5(user.email.trim().toLowerCase())}?d=identicon` : '');

    return (
        <>
            <div
                className="user-avatar d-flex align-items-center gap-2"
                ref={avatarRef}
                onClick={toggleModal}
            >
                <img src={displayImage} alt="Avatar" className="avatar-img" />
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={modalRef}>
                        <label htmlFor="avatar-upload">
                            <img
                                src={displayImage}
                                alt="Preview"
                                className="avatar-img mb-2"
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <p className="mb-1"><strong>Name: </strong>{user?.name}</p>
                        <p className="mb-3"><strong>Email: </strong>{user?.email}</p>
                        <button className="btn nav-logout-btn mx-1" onClick={handleLogOut}>Logout</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
