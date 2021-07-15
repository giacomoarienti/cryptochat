import {acceptChatRequest, deleteChat} from "../../../api/chat";

function acceptChat(username) {
  let data = localStorage.getItem(username);
  if(data !== null) {
    return acceptChatRequest(username, data.ecdh);
  }
}

function deleteChatH(username) {
  let data = localStorage.getItem(username);
  if(data !== null) {
    deleteChat(username, data.status, data.secret);
  }
}

function sideBar({setUser, setError}) {
    const data = [];
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
      const username = localStorage.key(i);
      const status = JSON.parse(localStorage.getItem(username)).status;
      
      data.push({ username: username, status: status });
    }

    return (
      <>
        { data.map((user, i) => (
          <div className="side-bar-item" key={i}>
            <label className="side-bar-name" onClick={() => setUser(user.username)}>{user.username}</label>
            <label className="side-bar-status">{user.status}</label>
            {user.status === "pending_in" && 
              <div className="side-bar-pending-in">
                <button className="side-bar-accept" onClick={() => setError(acceptChat(user.username))}/>
              </div>
            }
            <button className="side-bar-delete" onClick={() => deleteChatH(user.username)}></button>
          </div>
        ))}
      </>
    );
};

export default sideBar;