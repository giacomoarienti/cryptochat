function sideBar({username}) {
    return (
        <div className="side-bar-item">
            <label className="side-bar-name">{username}</label>
        </div>
    );
};

export default sideBar;