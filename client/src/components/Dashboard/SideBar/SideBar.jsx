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
    let data = [];
    for(user in Object.entries(localStorage)) {
      data.push({ username: user, status: user.status });
    }

    return (
      <>
        { data.forEach((user) => {
          <div className="side-bar-item">
            <label className="side-bar-name" onclick={() => setUser(user.username)}>{user.username}</label>
            <label className="side-bar-status">{user.status}</label>
            {user.status === "pending" && 
              <div className="side-bar-pending">
                <button className="side-bar-accept" onclick={() => setError(acceptChat(user.username))}/>
              </div>
            }
            <button className="side-bar-delete" onclick={() => deleteChatH(user.username)}></button>
          </div>
        })}
      </>
    );
};

export default sideBar;