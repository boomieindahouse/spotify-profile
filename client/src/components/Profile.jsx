import PropTypes from 'prop-types';

const Profile = ({ data }) => {
    return (
        <div className="profile">
            <h1>This is User Profile</h1>
            <h1>{data.display_name}</h1>
            <img src={data.images[0]?.url} alt={data.display_name} />
            <p>Email: {data.email}</p>
        </div>
    );
};

// ตรวจสอบประเภทของ props
Profile.propTypes = {
    data: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string.isRequired,
            })
        ),
        email: PropTypes.string.isRequired,
    }).isRequired,
};

export default Profile;
