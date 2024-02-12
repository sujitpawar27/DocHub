import React from "react";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import notification from "../../assets/svg/notification.svg";
import { useTheme } from "@emotion/react";
import backbutton from "../../assets/svg/backbutton.svg";
import { useLocation } from "react-router-dom";

function Navbar() {
  const profileImage = useSelector((state) => state.userData.profileUrl);
  const firstName = useSelector((state) => state.userData.firstName);
  const lastName = useSelector((state) => state.userData.lastName);
  const userEmail = useSelector((state) => state.userData.userEmail);

  const location = useLocation();
  const handleBackButtonClick = () => {
    window.history.back();
  };

  const shouldRenderBackButton = location.pathname !== "/dashboard";

  return (
    <AppBar
      position="static"
      style={{
        height: "80px",
        background: "#fff",
        border: "1px solid #e0e0e0",
        display: "flex",
      }}
    >
      <Toolbar>
        {shouldRenderBackButton && (
          <img
            src={backbutton}
            alt="Back"
            style={{
              width: "40px",
              height: "40px",
              marginRight: "16px",
              cursor: "pointer", // Add cursor pointer for better UX
            }}
            onClick={handleBackButtonClick} // Call handleBackButtonClick on click
          />
        )}
        <Typography variant="semibold24" sx={{ flexGrow: 1, marginLeft: 2 }}>
          {shouldRenderBackButton ? "Patient Details" : "Appointments"}
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={notification}
            alt="notification"
            className="notif-icon"
            width="40px"
            height="40px"
            style={{ marginRight: "16px" }}
          />
          <Avatar alt="Prem Danav" src={profileImage} />
          <div style={{ marginLeft: "16px", marginTop: "7px" }}>
            <Typography variant="semibold16">
              {firstName + " " + lastName}
            </Typography>
            <br></br>
            <Typography variant="regular12">{userEmail}</Typography>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
