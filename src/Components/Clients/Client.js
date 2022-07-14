import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
//import Avatar from "@mui/material/Avatar";
import Avatar from "react-avatar";

const Client = ({
  open,
  name,
  socketId,
  whoIsWriteCode,
  isTiyping,
  whoIsTyping,
}) => {
  return (
    <>
      <ListItemButton
        key={name}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <>{name.charAt(0)}</>
        </Avatar> */}
        <Avatar
          size="40"
          round="10px"
          color={Avatar.getRandomColor("sitebase")}
          name={"name"}
        />

        <ListItemText
          primary={`${name} ${isTiyping ? "Typing" : ""}`}
          sx={{ opacity: open ? 1 : 0, mx: 1 }}
        />
      </ListItemButton>
    </>
  );
};

export default Client;
