import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Button,
  TableCell,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import summaryicon from "../../src/assets/svg/summaryicon.svg";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import { useNavigate, useLocation } from "react-router-dom";
import viewsummarybutton from "../../src/assets/svg/viewsummarybutton.svg";
import TemporaryDrawer from "./drawer";
import axios from "axios";
import showToast from "../common/toast/Toastmessage";
import fourgroupWhitelinesicon from "../../src/assets/svg/fourgroup-whitelinesicon.svg";
import downloadicon from "../../src/assets/svg/downloadicon.svg";
import { useSelector } from "react-redux";

const AppointmentHistory = ({
  accessToken,
  selectedStatus,
  apiData,
  setApiData,
  propPrescriptionData,
  commonNote,
}) => {
  console.log(apiData);
  const theme = useTheme();
  const [drawerContent, setDrawerContent] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const apntId = useSelector((state) => state.patient.appointmentId);

  const navigate = useNavigate();
  const openDrawer = (content) => {
    setDrawerOpen(true);
    setDrawerContent(content);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerContent(null);
  };

  const handleAcceptClick = async (appointmentId) => {
    try {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      });

      const response = await axiosInstance.put(
        `http://localhost:8000/user/accept/${apntId}`
      );

      console.log(`response after clicking accept is ${response.data.data}`);
      showToast("Accepted", "success");
      navigate("/dashboard");
    } catch (error) {
      console.log(`error during accept: ${error.message}`);
    }
  };

  //handle decline click
  const handleDeclineClick = async (appointmentId) => {
    try {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      });

      const response = await axiosInstance.put(
        `http://localhost:8000/user/decline/${appointmentId}`
      );
      console.log(`response after declining is ${response}`);
      showToast("Declined", "success");
      navigate("/dashboard");
    } catch (error) {
      console.log(`error during declining ${error.message}`);
    }
  };
  const renderDrawerContent = () => {
    if (drawerContent === "AppointmentDetails") {
      return (
        <div>
          {/* <Typography
            variant="bold14"
            sx={{ color: theme.palette.primary.main }}
          >
            Doctor Prescription
          </Typography>

          <Table style={{ border: "none", marginTop: "20px" }}>
            <TableRow>
              <TableCell>First Name: {apiData?.firstName}</TableCell>
              <TableCell>Last Name: {apiData?.lastName}</TableCell>
              <TableCell>Email: {apiData?.email}</TableCell>
            </TableRow>
          </Table> */}
          <TemporaryDrawer
            anchor="right"
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
          >
            <div style={{ padding: "32px" }}>
              {tableData.map((row, index) => (
                <div key={index}>
                  <Typography
                    variant="bold14"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    {" "}
                    Appointmen Details
                  </Typography>

                  {/* Table 1: Medicine Name and Medicine Type */}
                  <Table style={{ border: "none", marginTop: "20px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none" }}>
                          <Typography variant="semibold14">Name</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none" }}>
                          {row.PatientName}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {/* Table 2: No of Tablets and Timing */}
                  <Table style={{ border: "none", marginTop: "20px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none" }}>
                          <Typography
                            variant="semibold14"
                            style={{
                              color: "theme.pallete.primary.main",
                            }}
                          >
                            Date & Day
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none" }}>
                          {row.Date}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  {/* Table 3: Frequency */}
                  <Table style={{ border: "none", marginTop: "20px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ borderBottom: "none" }}>
                          <Typography variant="semibold14">Issue</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ border: "none" }}>
                          {row.Issue}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
              <Table style={{ border: "none", marginTop: "20px" }}>
                <TableHead>
                  <TableRow>
                    {/* <TableCell style={{ borderBottom: "none" }}>
                      <Typography variant="semibold14">
                        Uploaded Documents
                      </Typography>
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow></TableRow>
                </TableBody>
              </Table>
              <div style={{ marginTop: "20px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: theme.palette.primary.main,
                  }}
                >
                  Doctor Note
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    fontSize: "14px",
                    color: "theme.palette.text.primary",
                  }}
                >
                  {commonNote}
                </Typography>
              </div>
            </div>
          </TemporaryDrawer>
        </div>
      );
    } else if (drawerContent === "DoctorPrescription") {
      return (
        <div>
          {/* <Typography
            variant="bold14"
            sx={{ color: theme.palette.primary.main }}
          >
            Appointment Details
          </Typography>
          <Table style={{ border: "none", marginTop: "20px" }}>
            <TableRow>
              <TableCell>First Name: {apiData?.firstName}</TableCell>
              <TableCell>Last Name: {apiData?.lastName}</TableCell>
              <TableCell>Email: {apiData?.email}</TableCell>
            </TableRow>
          </Table> */}
          <TemporaryDrawer
            anchor="right"
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
          >
            <div style={{ padding: "32px" }}>
              {Array.isArray(propPrescriptionData) &&
                propPrescriptionData.map((prescription, index) => (
                  <div key={index}>
                    <Typography
                      variant="bold14"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {" "}
                      Doctor Prescription
                    </Typography>

                    {/* Table 1: Medicine Name and Medicine Type */}
                    <Table style={{ border: "none", marginTop: "20px" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ borderBottom: "none" }}>
                            <Typography variant="semibold14">
                              Medicine Name
                            </Typography>
                          </TableCell>
                          <TableCell style={{ borderBottom: "none" }}>
                            <Typography
                              variant="semibold14"
                              style={{
                                color: "theme.pallete.primary.main",
                              }}
                            >
                              Medicine Type
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ borderBottom: "none" }}>
                            {prescription && prescription.medicineName}
                          </TableCell>
                          <TableCell style={{ borderBottom: "none" }}>
                            {prescription.medicineType}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {/* Table 2: No of Tablets and Timing */}
                    <Table style={{ border: "none", marginTop: "20px" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ borderBottom: "none" }}>
                            <Typography
                              variant="semibold14"
                              style={{
                                color: "theme.pallete.primary.main",
                              }}
                            >
                              No. of Tablets
                            </Typography>
                          </TableCell>
                          <TableCell style={{ borderBottom: "none" }}>
                            <Typography
                              variant="semibold14"
                              style={{
                                color: "theme.pallete.primary.main",
                              }}
                            >
                              Timing
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ borderBottom: "none" }}>
                            {prescription.numberOfTablets}
                          </TableCell>
                          <TableCell style={{ borderBottom: "none" }}>
                            {prescription.timing && (
                              <>
                                {prescription.timing.afterFood && "After Food "}
                                {prescription.timing.beforeFood &&
                                  "Before Food "}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {/* Table 3: Frequency */}
                    <Table style={{ border: "none", marginTop: "20px" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ borderBottom: "none" }}>
                            <Typography variant="semibold14">
                              Frequency
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ border: "none" }}>
                            {prescription.frequency && (
                              <>
                                {prescription.frequency.daily && "Daily "}
                                {prescription.frequency.weekly && "Weekly "}
                                {prescription.frequency.monthly && "Monthly "}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              <div style={{ marginTop: "20px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: theme.palette.primary.main,
                  }}
                >
                  Doctor Note
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    fontSize: "14px",
                    color: "theme.palette.text.primary",
                  }}
                >
                  Take the medicines as guided.
                </Typography>
              </div>
            </div>
          </TemporaryDrawer>
        </div>
      );
    }
    return null;
  };

  const tableData = [
    {
      PatientName: apiData?.firstName + " " + apiData?.lastName,
      PatientAge: apiData?.age, // Replace with the correct property name
      Date: "2024-01-24",
      Time: "10:00 AM",
      Issue: apiData?.medicalHistory,
      Status: selectedStatus,
      Prescription: "Some prescription",
    },

    // Add more dummy data as needed
  ];
  console.log("apiData.appointmentId", apiData);
  const renderActions = (status) => {
    if (status === "Request") {
      return (
        <>
          <Button
            onClick={() => handleAcceptClick(apiData.appointmentId)}
            style={{
              backgroundColor: theme.palette.primary.main,
              marginRight: "12px",
            }}
          >
            <Typography variant="medium14" color="#ffffff">
              Accept
            </Typography>
          </Button>
          <Button
            onClick={() => handleDeclineClick(apiData.appointmentId)}
            sx={{ border: `1px solid ${theme.palette.primary.main}` }}
          >
            <Typography variant="medium14">Decline</Typography>
          </Button>
        </>
      );
    } else if (status === "Scheduled" || status === "Past Appointments") {
      return null;
    }

    return (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          backgroundColor:
            status === "Past Appointments" ? "#FFECD9" : "transparent",
          whiteSpace: "nowrap",
        }}
      >
        {status}
      </Stack>
    );
  };

  const columns = [
    <TableCell key="patientName">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        Patient Name
      </Typography>
    </TableCell>,
    <TableCell key="patientAge">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        Patient Age
      </Typography>
    </TableCell>,
    <TableCell key="date">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        Date
      </Typography>
    </TableCell>,
    <TableCell key="time">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        Time
      </Typography>
    </TableCell>,
    <TableCell key="issue">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        Issue
      </Typography>
    </TableCell>,
    <TableCell key="status">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        Status
      </Typography>
    </TableCell>,
    tableData[0]?.Status !== "Scheduled" && (
      <TableCell key="Prescription">
        <Typography variant="semibold14" color={theme.palette.primary.main}>
          Prescription
        </Typography>
      </TableCell>
    ),
    <TableCell key="action">
      <Typography variant="semibold14" color={theme.palette.primary.main}>
        {tableData[0]?.Status === "Scheduled" ||
        tableData[0]?.Status === "Past Appointments"
          ? "Summary"
          : "Action"}
      </Typography>
    </TableCell>,
  ];

  return (
    <TableContainer
      sx={{
        width: "96%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginLeft: "32px",
        marginTop: "50px",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="semibold24"
        gutterBottom
        sx={{ marginBottom: "24px" }}
      >
        Appointment History
      </Typography>
      <Box
        sx={{
          width: "100%",
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableRow>{columns}</TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td,&:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {row.PatientName}
                </TableCell>
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {row.PatientAge}
                </TableCell>
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {row.Date}
                </TableCell>
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {row.Time}
                </TableCell>
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {row.Issue}
                </TableCell>
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  <div
                    style={{
                      backgroundColor:
                        row.Status === "Request" ? "#FFECD9" : "transparent",
                      width: 106,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {row.Status}
                  </div>
                </TableCell>
                {row.Status == "Scheduled" && (
                  <TableCell
                    key="Prescription"
                    sx={{ typography: theme.typography.medium14 }}
                  >
                    <img
                      onClick={() => openDrawer("DoctorPrescription")}
                      src={summaryicon}
                      alt="summaryicon"
                    />
                  </TableCell>
                )}
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {row.Status === "Request" && (
                    <img
                      onClick={() => openDrawer("AppointmentDetails")}
                      src={viewsummarybutton}
                      alt="viewsummarybutton"
                    />
                  )}
                </TableCell>
                <TableCell sx={{ typography: theme.typography.medium14 }}>
                  {renderActions(row.Status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TemporaryDrawer
        anchor="right"
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <div style={{ padding: "32px" }}>{renderDrawerContent()}</div>
      </TemporaryDrawer>
    </TableContainer>
  );
};

export default AppointmentHistory;
