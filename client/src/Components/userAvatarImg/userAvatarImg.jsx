import './userAvatarImg.css'

const UserAvatarImgComponent = ({ img, userName, lg }) => {
    return (
        <div className={`userImg ${lg ? 'lg' : ''}`}>
            <span className="rounded-circle">
                {typeof img === "string" && img.trim() !== "" ? (
                    <img src={img} alt="User Avatar" />
                ) : (
                    <span>{userName?.charAt(0)}</span>
                )}
            </span>
        </div>
    );
};

export default UserAvatarImgComponent;
