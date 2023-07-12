import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function DatepickerField(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <DesktopDatePicker
        leftArrowButtonText="Mês anterior"
        rightArrowButtonText="Próximo mês"
        label={props.textLabel}
        onChange={(newValue) => {
          props.onChange(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} fullWidth size="small" />
        )}
        shouldDisableDate={(dateParam) => {
          // if (!props.value[1]) {
          //     return false;
          // } else if (dateParam > props.value[1]) {
          //     return true;
          // }
        }}
        value={props.value}
        disableFuture
        disableHighlightToday
      />
    </LocalizationProvider>
  );
}
