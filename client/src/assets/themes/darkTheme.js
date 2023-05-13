import {ThemeProvider ,createTheme } from "@mui/material/styles";

const dark = createTheme({
    palette: {
      mode: "light",
    },
  });
export{
    ThemeProvider,
    dark
} 