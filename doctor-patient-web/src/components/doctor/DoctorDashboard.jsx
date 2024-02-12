import React from "react";
import { Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <Grid container sx={{ overflow: "hidden" }}>
      <Grid item xs={12} md={3} lg={2} sx={{ height: "100%" }}>
        <Sidebar />
      </Grid>

      <Grid item xs={12} md={9} lg={10}>
        <Grid container direction="column" sx={{ overflow: "hidden" }}>
          <Grid item>
            <Navbar />
          </Grid>
          <Grid item>
            <Outlet />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
