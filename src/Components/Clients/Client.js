import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
//import Avatar from "@mui/material/Avatar";
import Avatar from "react-avatar";

const Client = ({ open, name }) => {
  return (
    <>
      <ListItemButton
        key={name}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <>{name.charAt(0)}</>
        </Avatar> */}
        <Avatar
          size="50"
          round="10px"
          color={Avatar.getRandomColor("sitebase")}
          name={name}
          sx={{ mx: 4 }}
        />
        <ListItemText primary={name} sx={{ opacity: open ? 1 : 0, mx: 2 }} />
      </ListItemButton>
    </>
  );
};

export default Client;
