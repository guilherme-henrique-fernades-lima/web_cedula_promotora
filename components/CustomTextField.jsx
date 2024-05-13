import InputMask from "react-input-mask";

//Mui components
import TextField from "@mui/material/TextField";

export default function CustomTextField({
  value,
  setValue,
  label,
  helperText,
  placeholder,
  validateFieldName,
  errorFlag,
  maskFieldFlag,
  numbersNotAllowed,
  ...props
}) {
  return (
    <TextField
      value={value}
      helperText={helperText}
      onChange={(e) => {
        if (numbersNotAllowed) {
          setValue(e.target.value.replace(/[^A-Za-z\s]/g, ""));
        } else {
          setValue(e.target.value);
        }
      }}
      size="small"
      label={label}
      placeholder={placeholder}
      InputLabelProps={{ shrink: true }}
      autoComplete="off"
      fullWidth
      error={Boolean(errorFlag)}
      // {...register(`${validateFieldName}`)}
      {...props}
    />
  );
}

// <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
//             <InputMask
//               {...register("cpf")}
//               error={Boolean(errors.cpf)}
//               mask="999.999.999-99"
//               maskChar={null}
//               value={cpf}
//               onChange={(e) => {
//                 setCpf(e.target.value);
//               }}
//             >
//               {(inputProps) => (
//                 <TextField
//                   {...inputProps}
//                   variant="outlined"
//                   size="small"
//                   fullWidth
//                   label="CPF"
//                   placeholder="000.000.000-000"
//                   InputLabelProps={{ shrink: true }}
//                   autoComplete="off"
//                 />
//               )}
//             </InputMask>
//             <Typography sx={{ color: "#f00", fontSize: "12px" }}>
//               {errors.cpf?.message}
//             </Typography>
//           </Grid>

// import React from "react";
// import InputMask from "react-input-mask";
// import TextField from "@mui/material/TextField";

// // Custom text field with input mask
// function MaskedTextField({ mask, value, onChange, ...props }) {
//   return (
//     <InputMask mask={mask} value={value} onChange={onChange}>
//       {(inputProps) => (
//         <TextField {...inputProps} {...props} />
//       )}
//     </InputMask>
//   );
// }

// // Custom text field without input mask
// function PlainTextField({ value, onChange, ...props }) {
//   return (
//     <TextField
//       value={value}
//       onChange={onChange}
//       {...props}
//     />
//   );
// }

// export default function CustomTextField({
//   maskFieldFlag,
//   ...textFieldProps
// }) {
//   const TextFieldComponent = maskFieldFlag ? MaskedTextField : PlainTextField;

//   return <TextFieldComponent {...textFieldProps} />;
// }
