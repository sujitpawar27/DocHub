import React from "react";
import { Drawer, Box, Typography, Button, Avatar } from "@mui/material";
import FileImage from "../../assets/svg/FileList.svg";
import LogoutImage from "../../assets/svg/LogoutArrow.svg";
import { height, styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { clearAuthUserData } from "../../store/slices/userAuthSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    borderRight: "1px solid #e0e0e0",
    boxShadow: "1px",
    width: "280px", // Adjusted width for Sidebar
    [theme.breakpoints.down("md")]: {
      width: "220px", // Adjusted width for smaller screens
    },
    [theme.breakpoints.down("sm")]: {
      width: "180px", // Adjusted width for even smaller screens
    },
    [theme.breakpoints.up("lg")]: {
      width: "320px", // Adjusted width for larger screens
    },
  },
}));

const Sidebar = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.userData.userEmail);
  const navigate = useNavigate();

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <Box sx={{ marginTop: "20px", marginBottom: "10%", marginLeft: "20%" }}>
        <Typography variant="semibold24" className="sidebar-text">
          MBDocHub
        </Typography>
      </Box>

      <Button
        startIcon={<img src={FileImage} alt="File Icon" />}
        variant="appointmentButton"
        sx={{
          height: "50px",
          marginLeft: "20px", // Adjusted margin
          width: "80%",
        }}
      >
        Appointment
      </Button>

      <Box
        className="logout"
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "auto",
          marginLeft: "20px", // Adjusted margin
        }}
      >
        <Button
          onClick={() => {
            const response = axios.post("http://localhost:8000/auth/logout", {
              userEmail,
            });
            console.log("user logged out successfully " + response);
            dispatch(clearAuthUserData());
            navigate("/");
          }}
          sx={{ paddingBottom: "16%" }}
        >
          <Avatar alt="logout btn" src={LogoutImage} />
          <Typography variant="semibold18">Logout</Typography>
        </Button>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
