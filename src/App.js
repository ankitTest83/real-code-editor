import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import EditorPage from "./Pages/EditorPage";
import {
  ThemeProvider,
  createTheme,
  Paper,
  CircularProgress,
} from "@mui/material";

import {
  deepPurple,
  teal,
  pink,
  deepOrange,
  lightBlue,
  cyan,
} from "@mui/material/colors";
import { Toaster } from "react-hot-toast";

function App() {
  const [mode, setMode] = React.useState("dark");

  const Theme = createTheme({
    palette: {
      mode: mode,
      primary: deepPurple,
      secondary: teal,
      error: pink,
      warning: deepOrange,
      success: cyan,
      info: lightBlue,
    },
    typography: {
      fontFamily: "Poppins",
    },
  });
  return (
    <>
      <ThemeProvider theme={Theme}>
        <Paper style={{ minHeight: "100vh" }}>
          <div>
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  duration: 3000,
                  theme: {
                    primary: "green",
                    secondary: "black",
                  },
                },
              }}
            ></Toaster>
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor/:roomId" element={<EditorPage />} />
            </Routes>
          </BrowserRouter>
        </Paper>
      </ThemeProvider>
    </>
  );
}

export default App;
