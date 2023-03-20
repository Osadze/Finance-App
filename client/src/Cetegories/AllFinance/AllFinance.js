import axios from "axios";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
function AllFinance() {
  let [finances, setFinances] = useState([]);
  let userData = JSON.parse(sessionStorage.user);
  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    {
      field: "description",
      headerName: "Description",
      type: "String",
      width: 300,
    },
    {
      field: "category",
      headerName: "Category",
      type: "String",
      width: 100,
    },
    {
      field: "financeName",
      headerName: "Finance Name",
      type: "String",
      width: 250,
    },
    {
      field: "money",
      headerName: "Value",
      type: "Number",
      width: 100,
    },
    {
      field: "type",
      headerName: "Type",
      type: "String",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      type: "String",
      width: 100,
    },

    {
      field: "createdAt",
      headerName: "Created",
      type: "String",
      width: 200,
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/finances", {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      })
      .then((res) => {
        setFinances(res.data.finances);
      });
  }, []);

  return (
    <div style={{ height: 600, width: "100%", marginTop: "40px" }}>
      <DataGrid
        rows={finances}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row, index) => row._id}
      />
    </div>
  );
}
export default AllFinance;
