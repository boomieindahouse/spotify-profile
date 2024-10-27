import axios from 'axios';

const Sidebar = () => {
    const handleLogout = async () => {
        try {
            // เรียกใช้ API สำหรับ logout
            await axios.post('http://localhost:3000/logout');
            localStorage.removeItem('spotify_access_token'); // ลบ access token
            window.location.href = '/'; // เปลี่ยนเส้นทางไปที่หน้า Login
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            {/* ส่วนอื่น ๆ ของ Sidebar */}
        </div>
    );
};

export default Sidebar;
