import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = (event) => {
    event.preventDefault();
    console.log("event.currentTarget", event.currentTarget);
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    const obj = {
      roomId,
      username,
    };
    navigate(`/editor/${roomId}`, { state: obj });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <>
      <div className="homePageWrapper ">
        <div className="formWrapper">
          <div className="logo-header">
            <img
              className="homePageLogo"
              src="/new-logo.svg"
              alt="code-sync-logo"
            />
            <h4>Live code editor</h4>
          </div>

          {/* <a href="https://dryicons.com/free-icons/code"> Icon by Dryicons </a> */}
          <h4 className="mainLabel">Paste invitation ROOM ID here</h4>

          <form>
            <div className="inputGroup">
              <input
                type="text"
                className="inputBox"
                placeholder="ROOM ID"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                name="roomId"
                onKeyUp={handleInputEnter}
              />
              <input
                type="text"
                name="userName"
                className="inputBox"
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyUp={handleInputEnter}
              />
              <button type="submit" className="btn joinBtn" onClick={joinRoom}>
                Join
              </button>
              <span className="createInfo">
                If you don't have an invite then create &nbsp;
                <a onClick={createNewRoom} href="" className="createNewBtn">
                  new room
                </a>
              </span>
            </div>
          </form>
        </div>
        <footer>
          <h4>
            Built with 💛 &nbsp; by &nbsp;
            <a href="https://ankitbharvad.com">Ankit Bharvad</a>
          </h4>
        </footer>
      </div>
    </>
  );
};

export default Home;
