import React from "react";
import { Box, InputAdornment, Input, SvgIcon } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { blue } from "@mui/material/colors";
import { sosPrimary } from "../../constants/theme/color";

const Searchbar = ({ onSearch }) => {
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    onSearch(searchTerm);
  };

  return (
    <Box>
      <Input
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon component={SearchIcon} />
          </InputAdornment>
        }
        disableUnderline
        placeholder="Search patients here"
        onChange={handleSearchChange}
        sx={{
          border: `1px solid ${blue[400]}`,
          backgroundColor: sosPrimary[100],
          borderRadius: "6px",
          marginTop: "10px",
          marginLeft: "22px",
          display: "flex",
          height: "40px",
          width: "399px",
          float: "left",
          paddingLeft: "8px",
        }}
      />
    </Box>
  );
};

export default Searchbar;
