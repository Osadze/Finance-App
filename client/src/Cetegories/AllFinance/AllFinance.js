import axios from "axios";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { counterActions } from "../../store/index";

function AllFinance(props) {
  let [finances, setFinances] = useState([]);
  let userData = JSON.parse(sessionStorage.user);
  const searchInput = useSelector((state) => state.searchInput);
  const components = useSelector((state) => state.chosenComponents);
  const startDate = useSelector((state) => state.startDate);
  const endDate = useSelector((state) => state.endDate);
  const dispatch = useDispatch();

  const columns = [
    {
      field: "financeName",
      headerName: "Finance Name",
      type: "String",
      width: 250,
    },
    {
      field: "description",
      headerName: "Description",
      type: "String",
      width: 300,
    },
    {
      field: "money",
      headerName: "Value",
      type: "Number",
      width: 100,
    },
    {
      field: "category",
      headerName: "Category",
      type: "String",
      width: 300,
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
    { field: "_id", headerName: "ID", width: 250 },
  ];

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/api/v1/finances?search=${
          searchInput ? searchInput : ""
        }&type=${components.type ? components.type : components.type}&status=${
          components.status ? components.status : ""
        }&startDate=${startDate ? startDate : ""}&endDate=${
          endDate ? endDate : ""
        }&moneyMin=${
          components.valueRangeMin ? components.valueRangeMin: ""
        }&moneyMax=${components.valueRangeMax ? components.valueRangeMax : ""}`,
        {
          headers: {
            Authorization: "Bearer " + userData.token,
          },
        }
      )
      .then((res) => {
        setFinances(res.data.finances);
        dispatch(counterActions.addFinances(res.data.finances));
      });
    // eslint-disable-next-line
  }, [props.updateFinance, components, startDate, endDate]);
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
