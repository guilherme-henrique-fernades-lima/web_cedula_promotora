import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";

//Mui components
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

//Mui components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

//Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login(props) {
  const { children, title } = props;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        height: "100%",
        backgroundColor: "red",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    ></Box>
  );
}
