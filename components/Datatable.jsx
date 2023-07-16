import React, { useState } from "react";
import { DataGrid, ptBR, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

export default function DataTable(props) {
  const [pageSize, setPageSize] = useState(50);

  return (
    <Box>
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={props.rows}
        columns={props.columns}
        autoHeight={true}
        sx={{
          mb: 2,
          mt: 2,
        }}
        disableColumnMenu={true}
        disableSelectionOnClick={true}
        disableColumnResize={true}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableColumnSelector
        disableDensitySelector
        disableColumnFilter
      />
    </Box>
  );
}
