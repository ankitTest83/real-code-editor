import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, Stack } from "@mui/material";
import Client from "../Components/Clients/Client";
import Editor from "../Components/Editor/Editor";
import { initSocket } from "../socket";
import socketAction from "../socketAction";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const EditorPage = () => {
  const params = useParams();
  const { roomId } = params;
  const socketRef = React.useRef(null);
  const codeRef = React.useRef(null);
  const reactNavigator = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [clients, setClients] = React.useState([]);
  const [currentUserId, setCurrentUserId] = React.useState(null);
  const [joinedUserSocketId, setJoinedUserSocketId] = React.useState(null);
  const whoIsWriteCode = React.useRef(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const init = async () => {
    socketRef.current = await initSocket();
    // console.log("params ", params);
    const obj = {
      roomId,
      userName: location.state?.userName,
    };

    // console.log("location state", location.state);

    socketRef.current.on("connect_error ", (error) => handleErrors(error));
    socketRef.current.on("connect_failed ", (error) => handleErrors(error));

    // console.log("socketRef.current ");
    socketRef.current.emit(socketAction.JOIN, obj);

    // listen to the joined clients
    socketRef.current.on(socketAction.JOINED, (data) => {
      // console.log("JOINED new clients data ", data);
      if (data.userName !== obj.userName) {
        toast.success(`${data.userName} has joined the room`);
      }
      setJoinedUserSocketId(data.soketId);

      const clientsArr = data.clients.map((client) => {
        return {
          ...client,
          typerId: whoIsWriteCode.current?.socketId,
        };
      });

      setClients([...clientsArr]);
      localStorage.setItem("allConectedClients", JSON.stringify(clientsArr));

      // console.log("SYNC_CODE ", codeRef.current);
      // console.log("all clients list ==> ", [...clientsArr]);
      socketRef.current.emit(socketAction.SYNC_CODE, {
        code: codeRef.current,
        socketId: data.soketId,
      });
    });

    // listen to the disconnected clients
    socketRef.current.on(socketAction.DISCONNECTED, (data) => {
      // console.log("DISCONNECTED new clients data ", data);
      if (data.userName !== obj.userName) {
        toast.success(`${data.userName} has left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== data.socketId);
        });
      }
    });
  };

  const handleErrors = (error) => {
    // console.log("error", error);
    toast.error("socket connection failed");
    reactNavigator(`/`);
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied to clipboard");
    } catch (err) {
      toast.error("Could not copy room id ");
    }
  };

  const leavRoom = () => {
    localStorage.removeItem("allConectedClients");
    reactNavigator(`/`);
  };

  React.useEffect(() => {
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(socketAction.JOINED);
      socketRef.current.off(socketAction.DISCONNECTED);
    };
  }, []); // eslint-disable-line

  const getJoinedClients = async () => {
    const allClients = localStorage.getItem("allConectedClients");
    return JSON.parse(allClients);
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Code Sync
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography>{location.state?.userName}</Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ ml: 3.5 }}>
          <Typography variant="p" noWrap component="div">
            Connected Users
          </Typography>
          {clients &&
            clients.map(({ userName, socketId, isTiyping }, index) => (
              <Client
                key={socketId}
                socketId={socketId}
                //whoIsWriteCode={whoIsWriteCode?.current?.socketId}
                open={open}
                name={userName}
                isTiyping={isTiyping}
              />
            ))}
        </List>
        <Divider />

        <Stack
          sx={{ height: "100%", m: 3 }}
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        ></Stack>
        <Button
          sx={{ my: 1, mx: 2 }}
          variant="contained"
          color="success"
          onClick={copyRoomId}
        >
          Copy room id
        </Button>
        <Button
          sx={{ my: 1, mx: 2 }}
          variant="contained"
          color="error"
          onClick={leavRoom}
        >
          Leav room
        </Button>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          currentClientSocketId={joinedUserSocketId}
          onCodeChange={async ({ socketId, code, currentClientSocketId }) => {
            // console.log("code is ", code);
            codeRef.current = code;
            if (socketId) {
              const conectedClients = await getJoinedClients();
              // init();
              // console.log("show clients ", conectedClients);
              // console.log("socketIs is ", socketId);

              // socketRef.current.emit(socketAction.TYPING, {
              //   socketId: socketId,
              //   roomId: roomId,
              // });

              // socketRef.current.on(socketAction.TYPING, ({ socketId }) => {
              //   // console.log("CODE_CHANGE TYPING *****", socketId);
              //   // editorRef.current.setValue(code);
              //   // onCodeChange({ socketId, code, currentClientSocketId });
              // });

              const clients_Arr =
                (await conectedClients) &&
                conectedClients.map((item) => {
                  if (item.socketId === socketId) {
                    return {
                      ...item,
                      isTiyping: true,
                      whoIsTyping: item.userName,
                    };
                  } else {
                    return { ...item };
                  }
                });

              // console.log("clients_Arr", clients_Arr);
              //setClients([...clients_Arr]);
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default EditorPage;
