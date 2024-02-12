import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Paper,
  TableCell,
  TablePagination,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import summaryicon from "../assets/svg/summaryicon.svg";
import deleteicon from "../assets/svg/deleteicon.svg";
import editicon from "../assets/svg/editicon.svg";
import TemporaryDrawer from "./drawer";

const PriscriptionTable = ({ prescriptionData: propPrescriptionData }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Common note for all prescriptions
  const doctorNote = propPrescriptionData[0]?.notes || "No note available";
  console.log(doctorNote);
  console.log("Prescription Data:", propPrescriptionData);
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          width: "93%",
          // height: "104px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          borderRadius: "5px",
          marginLeft: "32px",
          marginTop: "50px",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableRow>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Sr. No
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="medium14" // Use your specific variant here
                  color={theme.palette.primary.main}
                >
                  Medicine Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Number of Tablets
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Medicine Type
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Frequency
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Dose
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Time
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="semibold14"
                  sx={{
                    color: theme.palette.primary.main,
                    paddingLeft: "35px",
                  }}
                >
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(propPrescriptionData) &&
              propPrescriptionData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((prescription, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {prescription && prescription.medicineName}
                    </TableCell>
                    <TableCell>
                      {prescription && prescription.numberOfTablets}
                    </TableCell>
                    <TableCell>
                      {prescription && prescription.medicineType}
                    </TableCell>
                    <TableCell>
                      {prescription && prescription.frequency && (
                        <>
                          {prescription.frequency.daily && "Daily "}
                          {prescription.frequency.weekly && "Weekly "}
                          {prescription.frequency.monthly && "Monthly "}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {prescription && prescription.dose && (
                        <>
                          {prescription.dose.breakfast && "Breakfast "}
                          {prescription.dose.lunch && "Lunch "}
                          {prescription.dose.dinner && "Dinner "}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {prescription && prescription.timing && (
                        <>
                          {prescription.timing.afterFood && "After Food "}
                          {prescription.timing.beforeFood && "Before Food "}
                        </>
                      )}
                    </TableCell>
                    <>
                      <TableCell>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <img src={editicon} alt="editicon" />
                          <img src={deleteicon} alt="deleteicon" />
                          <img
                            onClick={openDrawer}
                            src={summaryicon}
                            alt="summaryicon"
                          />
                        </div>
                      </TableCell>

                      {/* Call the TemporaryDrawer component and pass the array of prescriptions */}
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
                                <Table
                                  style={{ border: "none", marginTop: "20px" }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
                                        <Typography variant="semibold14">
                                          Medicine Name
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
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
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
                                        {prescription &&
                                          prescription.medicineName}
                                      </TableCell>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
                                        {prescription.medicineType}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>

                                {/* Table 2: No of Tablets and Timing */}
                                <Table
                                  style={{ border: "none", marginTop: "20px" }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
                                        <Typography
                                          variant="semibold14"
                                          style={{
                                            color: "theme.pallete.primary.main",
                                          }}
                                        >
                                          No. of Tablets
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
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
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
                                        {prescription.numberOfTablets}
                                      </TableCell>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
                                        {prescription.timing && (
                                          <>
                                            {prescription.timing.afterFood &&
                                              "After Food "}
                                            {prescription.timing.beforeFood &&
                                              "Before Food "}
                                          </>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>

                                {/* Table 3: Frequency */}
                                <Table
                                  style={{ border: "none", marginTop: "20px" }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        style={{ borderBottom: "none" }}
                                      >
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
                                            {prescription.frequency.daily &&
                                              "Daily "}
                                            {prescription.frequency.weekly &&
                                              "Weekly "}
                                            {prescription.frequency.monthly &&
                                              "Monthly "}
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
                              {doctorNote}
                            </Typography>
                          </div>
                        </div>
                      </TemporaryDrawer>
                    </>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[]} // Empty array to hide the rows per page selector
          component="div"
          count={propPrescriptionData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default PriscriptionTable;
