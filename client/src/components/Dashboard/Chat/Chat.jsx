import Message from "./Message/Message";

import "./Chat.css";

function Chat({username, chat}) {
  return (
      <div className={`chat-${username}`}>
        {chat.forEach((c) => {
          <Message type={c.type} content={c.content} from={c.from} />;
        })}
      </div>
  );
}

export default Chat;
