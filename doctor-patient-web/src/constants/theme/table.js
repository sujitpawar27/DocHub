import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export const tableHeaderTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "18px 16px",
          borderBottom: "1px solid",
        },
      },
    },
  },
});

export const srNoTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "94px",
          borderTopLeftRadius: "6px",
          borderBottomLeftRadius: "0px",
        },
      },
    },
  },
});

export const patientNameTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "196px",
        },
      },
    },
  },
});

export const genderTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "140px",
        },
      },
    },
  },
});

export const patientAgeTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "140px",
        },
      },
    },
  },
});

export const dateTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "140px",
        },
      },
    },
  },
});

export const timeTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "140px",
        },
      },
    },
  },
});

export const actionTheme = createTheme({
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          width: "212px",
          borderTopRightRadius: "6px",
          borderBottomRightRadius: "0px",
        },
      },
    },
  },
});
