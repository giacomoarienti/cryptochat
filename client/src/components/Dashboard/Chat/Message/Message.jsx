import {backend} from "../../../../api/info";

import "./Message.css";
import FileSvg from "../../../../images/file.svg";

function Message({type, content, from}) {
    return (
        <div className={`${from === "me" ? "sent" : "recived"}-message`}>
            {type === "message" ? (
                <div className="message-content">
                    <label className="message-text">{content}</label>
                </div>
            ) : (
                <div className="file-content">
                    <img src={FileSvg} className="file-image" alt="File"/>
                    <a className="file-download" href={backend + "/api/files/" + content}>Download</a>
                </div>
            )}
        </div>
    );
};

export default Message;