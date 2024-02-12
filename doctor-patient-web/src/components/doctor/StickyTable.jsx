import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  Avatar,
  Stack,
  Box,
  TablePagination,
} from "@mui/material";
import { sosPrimary } from "../../constants/theme/color";
import { grey } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppointmentStatus from "./AppointmentStatus";
import Searchbar from "./Searchbar";
import { useDispatch } from "react-redux";
import { setPatientData } from "../../store/slices/patientDataSlice";
import remove from "../../assets/svg/remove.svg";
import showToast from "../../common/toast/Toastmessage";
import { green } from "@mui/material/colors";
import { ACCEPTS, DECLINE, SHOW_PATIENTS } from "../../apiUrl/apiUrl";
import plusicon from "../../assets/svg/plusicon.svg";
import { useTheme } from "@mui/material/styles";

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  left: 0,
  background: "white",
  borderRight: "1px solid #fff",
}));

const StickyTable = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Request");
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const accessToken = useSelector((state) => state.user.accesstoken);
  const doctorId = useSelector((state) => state.userData.id);

  //fetch data
  const fetchData = useCallback(
    async (status, page) => {
      try {
        const axiosInstance = axios.create();
        axiosInstance.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${accessToken}`;
          return config;
        });

        const response = await axiosInstance.get(SHOW_PATIENTS, {
          params: {
            doctorId: doctorId,
            status: status,
            page: page,
            pageSize: 10,
          },
        });
        console.log("API Data:", response.data);

        const rowsData = response.data.data.appointments.map((item, index) => ({
          srNo: index + 1,
          patientName: `${item.patientDetails.firstName} ${item.patientDetails.lastName}`,
          gender: item.patientDetails.gender,
          age: `${item.patientDetails.age} years`,
          date: new Date(item.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-"),
          time: item.time,
          picUrl: item.patientProfileUrl,
          issue: item.patientDetails.medicalHistory,
          appointmentId: item._id,
        }));
        console.log("Rows Data:", rowsData);

        setRows(rowsData);

        const filteredData = rowsData.filter((row) =>
          row.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRows(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [accessToken, doctorId, searchTerm]
  );

  //fetch cancelled and completed data
  const fetchCompletedAndCancelledData = useCallback(async () => {
    try {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      });

      const completedResponse = await axiosInstance.get(SHOW_PATIENTS, {
        params: {
          doctorId: doctorId,
          status: "completed",
          page: 1, // You can adjust the page if pagination is used
          pageSize: 10,
        },
      });

      const cancelledResponse = await axiosInstance.get(SHOW_PATIENTS, {
        params: {
          doctorId: doctorId,
          status: "cancelled",
          page: 1, // You can adjust the page if pagination is used
          pageSize: 10,
        },
      });

      const completedRowsData = completedResponse.data.data.appointments.map(
        (item, index) => ({
          srNo: index + 1,
          patientName: `${item.patientDetails.firstName} ${item.patientDetails.lastName}`,
          gender: item.patientDetails.gender,
          age: `${item.patientDetails.age} years`,
          date: new Date(item.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-"),
          time: item.time,
          picUrl: item.patientProfileUrl,
          issue: item.patientDetails.medicalHistory,
          appointmentId: item._id,
          status: "Completed",
        })
      );

      const cancelledRowsData = cancelledResponse.data.data.appointments.map(
        (item, index) => ({
          srNo: index + 1,
          patientName: `${item.patientDetails.firstName} ${item.patientDetails.lastName}`,
          gender: item.patientDetails.gender,
          age: `${item.patientDetails.age} years`,
          date: new Date(item.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-"),
          time: item.time,
          picUrl: item.patientProfileUrl,
          issue: item.patientDetails.medicalHistory,
          appointmentId: item._id,
          status: "Cancelled",
        })
      );

      const mergedRowsData = [...completedRowsData, ...cancelledRowsData];

      setRows(mergedRowsData);

      const filteredData = mergedRowsData.filter((row) =>
        row.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRows(filteredData);
    } catch (error) {
      console.error("Error fetching completed and cancelled data:", error);
    }
  }, [accessToken, doctorId, searchTerm]);

  useEffect(() => {
    if (selectedTab === "Request") {
      fetchData("pending");
    } else if (selectedTab === "Scheduled") {
      fetchData("confirmed");
    } else if (selectedTab === "Past Appointments") {
      //fetchData("completed");
      // fetchData("cancelled");
      fetchCompletedAndCancelledData();
    }
  }, [selectedTab, fetchData, fetchCompletedAndCancelledData]);

  //handling accept click
  const handleAcceptClick = async (appointmentId) => {
    try {
      const axiosInstance = axios.create();
      axiosInstance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      });

      const response = await axiosInstance.put(`${ACCEPTS}/${appointmentId}`);

      console.log(`response after clicking accept is ${response.data.data}`);
      showToast("Accepted", "success");
      setRows((prevRows) =>
        prevRows.filter((row) => row.appointmentId !== appointmentId)
      );
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

      const response = await axiosInstance.put(`${DECLINE}/${appointmentId}`);
      console.log(`response after declining is ${response}`);
      showToast("Declined", "success");
      setRows((prevRows) =>
        prevRows.filter((row) => row.appointmentId !== appointmentId)
      );
    } catch (error) {
      console.log(`error during declining ${error.message}`);
    }
  };

  const displayedRows = searchTerm ? filteredRows : rows;

  return (
    <div
      style={{
        marginTop: "10px",
        marginLeft: "18 px",
        marginRight: "0%",
        width: "108%",
      }}
    >
      <AppointmentStatus
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
      />
      <Stack sx={{ marginTop: "15px", marginBottom: "15px" }} id="searchbar">
        <Searchbar onSearch={handleSearch} />
      </Stack>

      <div style={{ marginRight: "12%", marginLeft: "1.5%" }}>
        <TableContainer sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* sr no */}
                <StickyTableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: `3px solid ${grey[100]}`,
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{ color: sosPrimary[500] }}
                  >
                    Sr No
                  </Typography>
                </StickyTableCell>

                {/* Patient Name */}
                <TableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: "1px solid #fff",
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{
                      color: sosPrimary[500],
                      borderRight: "1px solid #fff",
                    }}
                  >
                    Patient Name
                  </Typography>
                </TableCell>

                {/* Gender */}
                <TableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: "1px solid #fff",
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{ color: sosPrimary[500] }}
                  >
                    Gender
                  </Typography>
                </TableCell>

                {/* age */}
                <TableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: "1px solid #fff",
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{ color: sosPrimary[500] }}
                  >
                    Patient Age
                  </Typography>
                </TableCell>

                {/* date */}
                <TableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: "1px solid #fff",
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{ color: sosPrimary[500] }}
                  >
                    Date
                  </Typography>
                </TableCell>

                {/* time */}
                <TableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: "1px solid #fff",
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{ color: sosPrimary[500] }}
                  >
                    Time
                  </Typography>
                </TableCell>

                {/* issue */}
                <TableCell
                  sx={{
                    backgroundColor: sosPrimary[100],
                    borderRight: "1px solid #fff",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Typography
                    variant="semibold14"
                    sx={{ color: sosPrimary[500] }}
                  >
                    Issue
                  </Typography>
                </TableCell>

                {/*conditional rendering*/}
                {selectedTab === "Request" && (
                  <StickyTableCell
                    sx={{
                      backgroundColor: sosPrimary[100],
                      position: "sticky",
                      borderLeft: "3px solid #fff",
                    }}
                  >
                    <Typography
                      variant="semibold14"
                      sx={{ color: sosPrimary[500] }}
                    >
                      Action
                    </Typography>
                  </StickyTableCell>
                )}

                {selectedTab === "Scheduled" && (
                  <StickyTableCell
                    sx={{
                      backgroundColor: sosPrimary[100],
                      borderLeft: "3px solid #fff",
                      position: "sticky",
                    }}
                  >
                    <Typography
                      variant="semibold14"
                      sx={{ color: sosPrimary[500] }}
                    >
                      Action
                    </Typography>
                  </StickyTableCell>
                )}

                {selectedTab === "Past Appointments" && (
                  <StickyTableCell
                    sx={{
                      backgroundColor: sosPrimary[100],
                      borderLeft: "3px solid #fff",
                      position: "sticky",
                    }}
                  >
                    <Typography
                      variant="semibold14"
                      sx={{ color: sosPrimary[500] }}
                    >
                      Status
                    </Typography>
                  </StickyTableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedRows.map((row, index) => (
                <TableRow key={index}>
                  <StickyTableCell
                    sx={{
                      border: `1px solid ${grey[200]}`,
                      borderRight: `3px solid ${grey[200]}`,
                    }}
                  >
                    <Typography variant="medium14">{index + 1}</Typography>
                  </StickyTableCell>

                  <TableCell
                    sx={{
                      border: `1px solid ${grey[200]}`,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      onClick={() => {
                        // add appointmentid and status here and dispatch
                        const appointmentId = row.appointmentId;
                        const selectedStatus = selectedTab;
                        const patientUrl = row.picUrl;
                        dispatch(
                          setPatientData({
                            selectedStatus,
                            appointmentId,
                            patientUrl,
                          })
                        );
                        navigate(`/dashboard/patientprofile`);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          alt="Patient profile"
                          src={row.picUrl}
                          sx={{ margin: 0, marginRight: 1 }}
                        />
                        <Typography
                          variant="medium14"
                          sx={{ margin: 0, whiteSpace: "pre-wrap" }}
                        >
                          {row.patientName}
                        </Typography>
                      </Box>
                    </div>
                  </TableCell>
                  <TableCell sx={{ border: `1px solid ${grey[200]}` }}>
                    <Typography variant="medium14">{row.gender}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: `1px solid ${grey[200]}` }}>
                    <Typography variant="medium14">{row.age}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: `1px solid ${grey[200]}` }}>
                    <Typography variant="medium14">{row.date}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: `1px solid ${grey[200]}` }}>
                    <Typography variant="medium14">{row.time}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: `1px solid ${grey[200]}` }}>
                    <Typography variant="medium14">{row.issue}</Typography>
                  </TableCell>
                  {selectedTab === "Request" && (
                    <StickyTableCell
                      sx={{
                        border: `1px solid ${grey[200]}`,
                        borderLeft: `4px solid ${grey[200]}`,
                      }}
                    >
                      <Button
                        variant="acceptButton"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleAcceptClick(row.appointmentId)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="declineButton"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleDeclineClick(row.appointmentId)}
                      >
                        Decline
                      </Button>
                    </StickyTableCell>
                  )}

                  {selectedTab === "Scheduled" && (
                    <StickyTableCell
                      sx={{
                        border: `1px solid ${grey[200]}`,
                        borderLeft: `4px solid ${grey[200]}`,
                      }}
                    >
                      <Button
                        variant="acceptButton"
                        sx={{ padding: "12px" }}
                        onClick={() => {
                          const appointmentId = row.appointmentId;
                          dispatch(
                            setPatientData({
                              appointmentId,
                            })
                          );
                          navigate("/dashboard/priscriptionform");
                        }}
                      >
                        <img
                          src={plusicon}
                          alt="plusicon"
                          style={{ color: theme.palette.grey[100] }}
                          className="px-0"
                        />
                        <Typography sx={{ paddingRight: "10%" }}>
                          Notes
                        </Typography>
                      </Button>
                      <Button>
                        <img src={remove} alt="removebutton" />
                      </Button>
                    </StickyTableCell>
                  )}

                  {selectedTab === "Past Appointments" && (
                    <StickyTableCell
                      sx={{
                        border: `1px solid ${grey[200]}`,
                        borderLeft: `4px solid ${grey[200]}`,
                      }}
                    >
                      {row.status === "Completed" ? (
                        <Button
                          variant="acceptButton"
                          sx={{
                            marginRight: 1,
                            backgroundColor: "#D4F4E2",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "#D4F4E2",
                              cursor: "auto",
                            },
                          }}
                        >
                          Completed
                        </Button>
                      ) : row.status === "Cancelled" ? (
                        <Button
                          variant="declineButton"
                          sx={{
                            marginRight: 1,
                            backgroundColor: "#F8D7DA",
                            color: "black",
                            border: "none",
                            borderRadius: "1px solid ",
                            "&:hover": {
                              backgroundColor: "#F8D7DA",
                              cursor: "auto",
                            },
                          }}
                        >
                          Cancelled
                        </Button>
                      ) : null}
                    </StickyTableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default StickyTable;
