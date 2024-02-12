import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Stack, styled } from "@mui/system";
import fourgroupWhitelinesicon from "../../src/assets/svg/fourgroup-whitelinesicon.svg";
import downloadicon from "../../src/assets/svg/downloadicon.svg";
import AppointmentHistory from "./appointmentHistory";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled(Paper)({
  width: "96%",
  height: "560px",
  padding: "15px",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
  gap: "3",
  inlineFlex: "nowrap",
  marginLeft: "25px",
});

const Header = styled(Grid)({
  // width: "1060px",
  height: "98px",
  padding: "2.5px",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "6px",
  inlineFlex: "nowrap",
});

const AvatarContainer = styled(Grid)({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "6px",
});

const AvatarImage = styled(Avatar)({
  width: "90px",
  height: "90px",
  borderRadius: "50%",
});

const UserInfoContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  gap: "3px",
  inlineFlex: "nowrap",
});

// const UserName = styled(Typography)({
//   color: "#000",
//   fontSize: "22px",
//   fontWeight: "600",
//   fontFamily: "Montserrat",
//   lineHeight: "30px",
// });
const UserName = styled("div")(({ theme }) => ({
  ...theme.typography.semibold22,
}));

const UserEmail = styled(Typography)({
  color: "#808080",
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Montserrat",
  lineHeight: "tight",
});

const SectionTitle = styled(Grid)({
  padding: "2.5px",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "2.5",
  inlineFlex: "nowrap",
  marginTop: "26px",
});

const SectionTitleText = styled(Typography)({
  color: "#666",
  fontSize: "18px",
  fontWeight: "600",
  fontFamily: "Montserrat",
  lineHeight: "30px",
});

const DetailsContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
  gap: "8",
  flex: "1",
  width: "100%",
});

const DetailsContent = styled(Grid)({
  // width: "1060px",
  height: "84px",
  padding: "2.5px",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "88px",
  inlineFlex: "nowrap",
});

const DetailBlock = styled(Grid)({
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
  gap: "8px",
  inlineFlex: "nowrap",
  marginTop: "33px",
});

const DetailTitle = styled((props) => (
  <Typography variant="semibold16" {...props} />
))(({ theme }) => ({
  // color: theme.palette.primary.main,
}));

const DetailValue = styled((props) => (
  <Typography variant="medium16" {...props} />
))(({ theme }) => ({
  color: theme.palette.grey[600],
}));

const FilesContainer = styled(Grid)({
  alignSelf: "stretch",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
  gap: "2",
  flex: "1",
});

const FilesSectionTitle = styled(Grid)({
  padding: "2.5px",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "2.5",
  inlineFlex: "nowrap",
});

const FilesSectionTitleText = styled(Typography)({
  color: "#666",
  fontSize: "18px",
  fontWeight: "600",
  fontFamily: "Montserrat",
  lineHeight: "30px",
});

const FilesContent = styled(Grid)({
  padding: "2.5px",
  paddingTop: "15px",
  paddingBottom: "15px",
  display: "flex",
  justifyContent: "start",
  alignItems: "start",
  gap: "4px",
  inlineFlex: "nowrap",
});

const FileItem = styled(Paper)({
  padding: "2.5px",
  paddingTop: "15px",
  paddingBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  gap: "42px",
});

const FileName = styled(Typography)({
  color: "#000",
  fontSize: "14px",
  fontWeight: "500",
  fontFamily: "Montserrat",
  lineHeight: "tight",
});

const PatientProfile = () => {
  const { patientId } = useParams();
  const [apiData, setApiData] = useState(null);
  const appointmentId = useSelector((state) => state.patient.appointmentId);
  const selectedStatus = useSelector((state) => state.patient.selectedStatus);
  const patientUrl = useSelector((state) => state.patient.patientUrl);
  const accessToken = useSelector((state) => state.user.accesstoken);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/doctor/patient-details/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setApiData({ ...response.data, appointmentId });
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, [patientId]);

  return (
    <div
      style={{
        marginTop: "38px",
        marginLeft: "50px",
        display: "flex",
        flexDirection: "column",
        // width: "100%",
      }}
    >
      <Container>
        <Header>
          <AvatarContainer>
            <AvatarImage src={`${patientUrl}`} />
            <UserInfoContainer>
              <UserName>
                {apiData?.firstName + " " + apiData?.lastName}
              </UserName>
            </UserInfoContainer>
          </AvatarContainer>
        </Header>
        <DetailsContainer>
          <SectionTitle>
            <SectionTitleText>Patients Details</SectionTitleText>
          </SectionTitle>
          <DetailsContent>
            <DetailBlock>
              <DetailTitle>Date of Birth</DetailTitle>
              <DetailValue>{apiData?.dob}</DetailValue>
            </DetailBlock>
            <DetailBlock>
              <DetailTitle>Gender</DetailTitle>
              <DetailValue>Male</DetailValue>
              {/* <DetailValue>{apiData?.value}</DetailValue> */}
            </DetailBlock>
            <DetailBlock>
              <DetailTitle>Blood Group</DetailTitle>
              {/* <DetailValue>A+</DetailValue> */}
              <DetailValue>A+</DetailValue>
            </DetailBlock>
            <DetailBlock>
              <DetailTitle>Medical History</DetailTitle>
              <DetailValue>{apiData?.medicalHistory}</DetailValue>
            </DetailBlock>
            <DetailBlock>
              <DetailTitle>Contact Number</DetailTitle>
              <DetailValue>7038852922</DetailValue>
            </DetailBlock>
          </DetailsContent>
          <Stack marginTop={"38px"}>
            <DetailsContent>
              <DetailBlock>
                <DetailTitle>Address</DetailTitle>
                <DetailValue>
                  Venice Boulevard, Los Angeles, California
                </DetailValue>
                <DetailValue>{apiData?.address}</DetailValue>
              </DetailBlock>
            </DetailsContent>
          </Stack>
        </DetailsContainer>
        <FilesContainer>
          <Stack marginTop={"37px"}>
            <FilesSectionTitle>
              <FilesSectionTitleText>Files / Documents</FilesSectionTitleText>
            </FilesSectionTitle>
          </Stack>
          <FilesContent marginTop={"30px"}>
            <FileItem>
              <img src={fourgroupWhitelinesicon} alt="FourLines" />
              <FileName>Blood test.pdf</FileName>
              <img src={downloadicon} alt="download" />
            </FileItem>
            {/* Add more FileItem components for additional files/documents */}
          </FilesContent>
        </FilesContainer>
      </Container>

      {/* {apiData && <AppointmentHistory appointmentHistory={apiData.appointmentHistory} />} */}
      <AppointmentHistory
        accessToken={accessToken}
        selectedStatus={selectedStatus}
        apiData={apiData}
        setApiData={setApiData}
      />
    </div>
  );
};

export default PatientProfile;
