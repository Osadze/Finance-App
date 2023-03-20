import * as React from "react";

import {
  Box,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  ListItemText,
  Button,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

function AddFinance(props) {
  const [cName, setCName] = useState([]);
  const [values, setValues] = useState({
    financeName: "",
    financeDescription: "",
    cost: 0,
    financeType: "",
    status: "",
  });

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };
  const categoryChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setCName(typeof value === "string" ? value.split(",") : value);
  };

  let userData = JSON.parse(sessionStorage.user);

  const addFinanceOnDB = (e) => {
    e.preventDefault();
    if (values.financeName.length && sessionStorage.user) {
      if (values.financeType === "outcome") {
        axios
          .post(
            "http://localhost:3000/api/v1/finances",
            {
              financeName: values.financeName,
              description: values.financeDescription,
              money: values.cost,

              type: values.financeType,
              status: values.status,
              category: cName,
            },
            {
              headers: {
                Authorization: "Bearer " + userData.token,
              },
            }
          )
          .then((res) => {
            props.setAddFinance(!props.addFinance);
            console.log(res);
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .post(
            "http://localhost:3000/api/v1/finances",
            {
              financeName: values.financeName,
              description: values.financeDescription,
              money: values.cost,
              type: values.financeType,
              category: cName,
            },
            {
              headers: {
                Authorization: "Bearer " + userData.token,
              },
            }
          )
          .then((res) => {
            props.setAddFinance(!props.addFinance);
            console.log(res);
          })
          .catch((err) => console.log(err));
      }
    }
  };
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        border: "2px solid grey",
        width: "40%",
        margin: "20px auto 20px auto",
      }}
      noValidate
      autoComplete="off"
      onSubmit={addFinanceOnDB}
    >
      <TextField
        id="FinanceName"
        label="Finance Name"
        variant="outlined"
        sx={{ marginTop: "10px" }}
        onChange={(e) => setValues({ ...values, financeName: e.target.value })}
        required
      />
      <TextField
        id="Description"
        label="Finance Description"
        variant="outlined"
        sx={{ marginTop: "10px" }}
        onChange={(e) =>
          setValues({ ...values, financeDescription: e.target.value })
        }
        required
      />

      <TextField
        id="Cost"
        label="Finance Cost"
        variant="outlined"
        sx={{ marginTop: "10px" }}
        onChange={(e) => setValues({ ...values, cost: e.target.value })}
        type="number"
        required
      />
      <InputLabel sx={{ mt: 1 }} id="demo-simple-select-label">
        Finance Type
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={values.financeType}
        label="Finance Type"
        required
        onChange={(e) => setValues({ ...values, financeType: e.target.value })}
      >
        <MenuItem value={"outcome"}>Outcome</MenuItem>
        <MenuItem value={"income"}>Income</MenuItem>
      </Select>
      {values.financeType === "outcome" && (
        <>
          <InputLabel id="demo-simple-select-label">Status Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.status}
            label="Finance Type"
            onChange={(e) => setValues({ ...values, status: e.target.value })}
            required
          >
            <MenuItem value={"processing"}>Processing</MenuItem>
            <MenuItem value={"completed"}>Completed</MenuItem>
          </Select>
        </>
      )}
      <FormControl sx={{ mt: 2, width: "100%" }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={cName}
          onChange={categoryChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {props.myCategories?.map((name, index) => (
            <MenuItem key={index} value={name.categoryName}>
              <Checkbox checked={cName.indexOf(name.categoryName) > -1} />
              <ListItemText primary={name.categoryName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" type="submit" sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
}

export default AddFinance;
