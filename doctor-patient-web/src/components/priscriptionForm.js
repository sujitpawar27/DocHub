import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import plusicon from "../assets/svg/plusicon.svg";
import PriscriptionTable from "./priscriptionTable";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updatePatientStatus } from "../store/slices/patientDataSlice";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import showToast from "../common/toast/Toastmessage";

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 93%;
  gap: 30px;
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotesTitle = styled(Typography)`
  color: black;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 30px;
`;

const MarkAsCompletedButton = styled((props) => (
  <Typography variant="semibold16" {...props} />
))(({ theme }) => ({
  width: "198px",
  height: "50px",
  padding: "13px 26px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  // Add any other styles or overrides based on your requirements
}));

const NotesSection = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;
`;

const AddNotesTitle = styled(Typography)`
  color: #333; // Adjust color as needed
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 21px;
`;

// Repeat the same process for the rest of your components
const PriscriptionContainer = styled(Box)`
  // 100%
  height: 205px;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
  justify-content: space-between;
  align-items: flex-start;
  display: inline-flex;
  margin-top: 50px;
`;

const MedicineContainer = styled(Box)`
  width: 225px;
  flex-direction: column;
  gap: 5px;
  display: inline-flex;
`;

const StyledTextField = styled(TextField)`
  flex: 1 0 0;
`;

const FrequencyContainer = styled(Box)`
  flex-direction: column;
  gap: 6px;
  display: inline-flex;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

const DoseTimingContainer = styled(Box)`
  width: 124px;
  flex-direction: column;
  gap: 5px;
  display: inline-flex;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

const AddButton = styled(Button)`
  width: 160px;
  height: 50px;
  padding: 12px 26px;
  margin-left: 84.5%;

  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const PlusIcon = styled(Box)`
  width: 5px;
  height: 5px;
  left: 0;
  top: 0;
  background-color: white;
`;

const AddButtonText = styled(Typography)`
  color: white;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
`;
const TimingContainer = styled(Box)`
  /* Add your custom styles for TimingContainer */
  flex-direction: column;
  gap: 6px;
  display: inline-flex;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

const PriscriptionForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [medicineName, setMedicineName] = useState("");
  const [numberOfTablets, setNumberOfTablets] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [daily, setDaily] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [afterFood, setAfterFood] = useState(false);
  const [beforeFood, setBeforeFood] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [notes, setNotes] = useState("");
  const [markCompletedButtonDisabled, setMarkCompletedButtonDisabled] =
    useState(true);

  const appointmentId = useSelector((state) => state.patient.appointmentId);
  const accessToken = useSelector((state) => state.user.accesstoken);

  const isAddButtonDisabled = () => {
    return (
      !medicineName ||
      !numberOfTablets ||
      !medicineType ||
      !(daily || weekly || monthly) ||
      !(breakfast || lunch || dinner) ||
      !(afterFood || beforeFood) ||
      !notes
    );
  };

  const handleMarkAsCompletedButtonClick = async () => {
    setLoading(true);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      console.log(`appointmentId ${appointmentId}`);
      const response = await axios.post(
        "http://localhost:8000/user/doctor/add-prescription",
        {
          appointmentId,
          items: prescriptionData,
        },
        { headers }
      );
      dispatch(updatePatientStatus());

      console.log(updatePatientStatus());

      console.log("prescription added successfully");
      console.log("response", response);
      showToast("Appointment completed successfully", "success");
      navigate("/dashboard");
    } catch (error) {
      console.log(`error is ${error}`);
    } finally {
      setLoading(false); // Set loading to false when API request completes
    }
  };

  const handleButtonClick = () => {
    if (isAddButtonDisabled()) {
      return;
    }

    const newPrescription = {
      notes,
      medicineName,
      numberOfTablets,
      medicineType,
      frequency: {
        daily,
        weekly,
        monthly,
      },
      dose: {
        breakfast,
        lunch,
        dinner,
      },
      timing: {
        afterFood,
        beforeFood,
      },
    };

    setPrescriptionData((prevData) => [...prevData, newPrescription]);
    console.log(`prescription data is ${prescriptionData}`);
    setShowTable(true);
    setMarkCompletedButtonDisabled(false); // Enable Mark as completed button
  };

  useEffect(() => {
    console.log("Prescription data updated:", prescriptionData);
  }, [prescriptionData]);

  return (
    <div>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "93%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          {/* Replace the "Loading..." text with CircularProgress */}
          <CircularProgress color="primary" />
        </div>
      )}

      <Container style={{ marginTop: "38px", marginLeft: "38px" }}>
        <Header>
          <Typography variant="semibold18" color={theme.palette.grey[900]}>
            Prescriptions & Notes
          </Typography>
          <MarkAsCompletedButton
            sx={{
              backgroundColor: theme.palette.primary.main,
              opacity: markCompletedButtonDisabled ? 0.5 : 1,
              "&:hover, &:active": {
                backgroundColor: theme.palette.primary.main,
                opacity: markCompletedButtonDisabled ? 0.5 : 1,
                cursor: "pointer",
              },
            }}
            onClick={handleMarkAsCompletedButtonClick}
            disabled={isAddButtonDisabled()}
          >
            <Typography
              variant="medium16"
              sx={{
                color: theme.palette.grey[100],
                whiteSpace: "nowrap",
              }}
            >
              Mark as completed
            </Typography>
          </MarkAsCompletedButton>
        </Header>
        <NotesSection>
          <AddNotesTitle variant="semibold14">Add Notes</AddNotesTitle>

          <TextField
            placeholder="Enter Note"
            multiline
            rows={5}
            maxRows={10}
            sx={{
              width: "100%",
              height: "104px",
              typography: theme.typography.regular14,
              "&:focus, &:active": {
                borderColor: `${theme.palette.grey[900]} !important`,
                color: theme.palette.grey[900],
              },
            }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </NotesSection>

        <PriscriptionContainer sx={{ columnGap: "34.8px" }}>
          <MedicineContainer>
            <Typography
              variant="semibold14"
              sx={{ color: "grey.800", marginBottom: "5px" }}
            >
              Medicine Name
            </Typography>
            <div style={{ marginTop: "11px" }}>
              <StyledTextField
                variant="outlined"
                size="small"
                placeholder="Enter medicine name"
                sx={{
                  // width: "180px",
                  // height: "50px",
                  paddingleft: "16px",
                  paddingtop: "13px",
                  paddingbottom: "13px",
                  paddingright: "16px",
                  width: "193px",
                  height: "24px",
                }}
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
              />{" "}
            </div>
          </MedicineContainer>

          <MedicineContainer>
            <Typography
              variant="semibold14"
              sx={{ color: "grey.800", marginBottom: "5px" }}
            >
              Number of Tablets
            </Typography>
            <div style={{ marginTop: "11px" }}>
              <StyledTextField
                variant="outlined"
                size="small"
                placeholder="Enter no of tablets"
                sx={{
                  width: "180px",
                  height: "50px",
                  paddingtop: "13px",
                  paddingleft: "16px",
                  paddingright: "16px",
                  paddingbottom: "13px",
                }}
                value={numberOfTablets}
                onChange={(e) => {
                  const input = e.target.value;

                  const onlyNumbers = input.replace(/[^0-9]/g, "");

                  setNumberOfTablets(onlyNumbers);
                }}
                inputProps={{
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
              />
            </div>
          </MedicineContainer>

          <MedicineContainer>
            <Typography
              variant="semibold14"
              sx={{
                color: "grey.800",
                marginBottom: "5px",
                width: "115px",
                height: "21px",
              }}
            >
              Medicine Type
              <div style={{ marginTop: "24px" }}>
                <RadioGroup
                  row
                  name="medicine-type"
                  value={medicineType}
                  onChange={(event) => setMedicineType(event.target.value)}
                >
                  <FormControlLabel
                    value="Tablet"
                    control={
                      <Radio
                        color="primary"
                        sx={{ color: theme.palette.grey[100] }}
                      />
                    }
                    label={
                      <Typography
                        variant="medium14"
                        color={theme.palette.grey[500]}
                      >
                        Tablet
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="Syrup"
                    control={
                      <Radio
                        color="primary"
                        sx={{ color: theme.palette.grey[100] }}
                      />
                    }
                    label={
                      <Typography
                        variant="medium14"
                        color={theme.palette.grey[500]}
                      >
                        Syrup
                      </Typography>
                    }
                  />
                </RadioGroup>
              </div>
            </Typography>
          </MedicineContainer>

          <FrequencyContainer>
            <Typography
              variant="semibold14"
              sx={{
                color: "grey.800",
                width: "78px",
                height: "21px",
                paddingLeft: "0px",
              }}
            >
              Frequency
            </Typography>
            <div style={{ marginTop: "14px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={daily}
                    onChange={(e) => setDaily(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14"
                    color={theme.palette.grey[500]}
                  >
                    Daily
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={weekly}
                    onChange={(e) => setWeekly(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14"
                    color={theme.palette.grey[500]}
                  >
                    Weekly
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={monthly}
                    onChange={(e) => setMonthly(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14" // Use your specific variant here
                    color={theme.palette.grey[500]}
                  >
                    Monthly
                  </Typography>
                }
              />
            </div>
          </FrequencyContainer>

          <DoseTimingContainer>
            <Typography
              variant="semibold14"
              color="grey.800"
              paddingLeft={"0px"}
              width={"38px"}
            >
              Dose
            </Typography>
            <div style={{ marginTop: "15px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={breakfast}
                    onChange={(e) => setBreakfast(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14" // Use your specific variant here
                    color={theme.palette.grey[500]}
                  >
                    Breakfast
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={lunch}
                    onChange={(e) => setLunch(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14" // Use your specific variant here
                    color={theme.palette.grey[500]}
                  >
                    Lunch
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dinner}
                    onChange={(e) => setDinner(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14" // Use your specific variant here
                    color={theme.palette.grey[500]}
                  >
                    Dinner
                  </Typography>
                }
              />
            </div>
          </DoseTimingContainer>

          <TimingContainer>
            <Typography variant="semibold14" color="grey.800" width={"53px"}>
              Timing
            </Typography>
            <div style={{ marginTop: "15px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={afterFood}
                    onChange={(e) => setAfterFood(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14" // Use your specific variant here
                    color={theme.palette.grey[500]}
                    sx={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    After Food
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={beforeFood}
                    onChange={(e) => setBeforeFood(e.target.checked)}
                    sx={{ color: theme.palette.grey[400] }}
                  />
                }
                label={
                  <Typography
                    variant="medium14" // Use your specific variant here
                    color={theme.palette.grey[500]}
                    sx={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Before Food
                  </Typography>
                }
              />
            </div>
          </TimingContainer>
        </PriscriptionContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "8px",
          }}
        >
          <AddButton
            sx={{
              marginBottom: "2%",
              backgroundColor: theme.palette.primary.main,
              opacity: isAddButtonDisabled() ? 0.5 : 1,
              "&:hover, &:active": {
                backgroundColor: theme.palette.primary.main,
                opacity: isAddButtonDisabled() ? 0.5 : 1,
              },
            }}
            onClick={handleButtonClick}
            disabled={isAddButtonDisabled()}
          >
            <img
              src={plusicon}
              alt="plusicon"
              style={{ color: theme.palette.grey[100] }}
            />
            <AddButtonText>Add</AddButtonText>
          </AddButton>
        </div>
      </Container>

      {showTable && <PriscriptionTable prescriptionData={prescriptionData} />}

      {/* Display the prescription table */}
    </div>
  );
};
export default PriscriptionForm;
