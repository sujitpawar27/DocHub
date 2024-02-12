import { createTheme } from "@mui/material/styles";
import { sosPrimary } from "./color";
import { grey } from "@mui/material/colors";
export const themeButtons = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "appointmentButton" },
          style: {
            width: "200px",
            height: "10%",
            padding: "10px",
            borderRadius: "6px",
            gap: "10px",
            textTransform: "none",
            color: grey[100],
            backgroundColor: sosPrimary[500],
            justifyContent: "flex-start",
            alignItems: "center",
            disableRipple: true,
            "&:hover": {
              backgroundColor: sosPrimary[500],
            },
          },
        },
        {
          props: { variant: "acceptButton" },
          style: {
            width: "100px",
            height: "30px",
            padding: "6px, 14px, 6px, 14px",
            borderRadius: "6px",
            gap: "10px",
            backgroundColor: sosPrimary[500],
            color: grey[100],
            textTransform: "none",
            "&:hover": {
              backgroundColor: sosPrimary[500],
            },
          },
        },
        {
          props: { variant: "declineButton" },
          style: {
            width: "100px",
            height: "30px ",
            padding: "6px, 14px, 6px, 14px",
            borderRadius: "4px",
            border: `1px solid ${sosPrimary[500]}`,
            gap: "4px",
            textTransform: "none",
          },
        },
        {
          props: { variant: "notesButton" },
          style: {
            width: "78px",
            height: "30px",
            padding: "6px, 14px, 6px, 14px",
            borderRadius: "6px",
            gap: "10px",
            backgroundColor: sosPrimary[500],
            color: grey[100],
            textTransform: "none",
            "&:hover": {
              backgroundColor: sosPrimary[500],
            },
          },
        },
      ],
    },
  },
});
