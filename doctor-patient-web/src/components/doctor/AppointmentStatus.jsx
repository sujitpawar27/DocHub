import React from "react";
import { Box, Typography, Tab, Tabs } from "@mui/material";

const AppointmentStatus = ({ selectedTab, handleTabClick }) => {
  const tabStyles = {
    marginRight: "20px",
    marginTop: "20px",
    marginLeft: "20px",
    textDecoration: "none",
    "&:hover": {
      cursor: "pointer",
    },
  };

  return (
    <Box className="main-container">
      <Box className="second-container" sx={{ overflowX: "auto" }}>
        <Tabs
          value={selectedTab}
          onChange={(event, newValue) => handleTabClick(newValue)}
          textColor="primary"
        >
          <Tab
            label={
              <Typography
                variant="semibold16"
                sx={{
                  textTransform: "none",
                  color:
                    selectedTab === "Request"
                      ? "rgba(0, 0, 0, 0.8)"
                      : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Request
              </Typography>
            }
            value="Request"
            sx={{
              ...tabStyles,
              ...(selectedTab === "Request" && {
                textDecorationThickness: "2px",
              }),
            }}
          />
          <Tab
            label={
              <Typography
                variant="semibold16"
                sx={{
                  textTransform: "none",
                  color:
                    selectedTab === "Scheduled"
                      ? "rgba(0, 0, 0, 0.8)"
                      : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Scheduled
              </Typography>
            }
            value="Scheduled"
            sx={{
              ...tabStyles,
              ...(selectedTab === "Scheduled" && {
                textDecorationThickness: "2px",
              }),
            }}
          />
          <Tab
            label={
              <Typography
                variant="semibold16"
                sx={{
                  textTransform: "none",
                  color:
                    selectedTab === "Past Appointments"
                      ? "rgba(0, 0, 0, 0.8)"
                      : "rgba(0, 0, 0, 0.6)",
                }}
              >
                Past Appointments
              </Typography>
            }
            value="Past Appointments"
            sx={{
              ...tabStyles,
              ...(selectedTab === "Past Appointments" && {
                textDecorationThickness: "2px",
              }),
            }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default AppointmentStatus;
