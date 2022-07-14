import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Code Sync
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = React.useState("");
  const [userName, setUserName] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const room_Id = data.get("roomId");
    const user_Name = data.get("userName");

    if (!room_Id || !user_Name) {
      toast.error("room id and user name are required.");
      return;
    }

    const obj = {
      roomId: data.get("roomId"),
      userName: data.get("userName"),
    };
    navigate(`/editor/${room_Id}`, { state: obj });
  };

  const createNewRoom = () => {
    const id = uuidv4();
    setRoomId(id);
    console.log("createNewRoom", id);
    toast.success(`Created a new room`);
  };

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            //backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundImage:
              "url(https://img.freepik.com/free-vector/laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_39422-971.jpg?t=st=1657701085~exp=1657701685~hmac=cc17fa979e1ea3e78b5fad3082667e6f127938393c5b117594c87fd21c72d75d&w=740)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography component="h1" variant="h5">
              Code Sync
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="roomId"
                label="RoomId"
                name="roomId"
                autoComplete="roomId"
                autoFocus
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="userName"
                label="UserName"
                type="userName"
                id="userName"
                autoComplete="current-userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Join
              </Button>
              <Grid container>
                <Grid item>
                  <span variant="body2">
                    {"if your don't have an invite then create "}
                  </span>
                  <Link
                    onClick={() => createNewRoom()}
                    href="#"
                    sx={{ color: "yellow" }}
                    //variant="body2"
                  >
                    New room
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
