/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { store } from "./store";
import AppRoutes from "./routes/AppRoutes";

// Build a beautiful luxury-minimal theme for Material UI (Muji, Uniqlo style)
const atelierMuiTheme = createTheme({
  palette: {
    primary: {
      main: "#171717", // deep charcoal/black
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#737373" // mid gray
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff"
    },
    text: {
      primary: "#171717",
      secondary: "#525252"
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 650,
      letterSpacing: "0.08em"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // strict flat architecture
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none"
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: "1px solid #e5e5e5",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
        }
      }
    }
  }
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={atelierMuiTheme}>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="foxnt-sans text-xs"
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
