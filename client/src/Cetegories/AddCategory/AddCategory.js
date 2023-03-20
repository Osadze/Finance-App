import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";

function AddCategory(props) {
  const [categoryName, setCategoryName] = useState("");
  let userData = JSON.parse(sessionStorage.user);
  const addCategoryOnDB = (e) => {
    e.preventDefault();
    if (categoryName.length && sessionStorage.user) {
      axios
        .post(
          "http://localhost:3000/api/v1/finances/categories",
          {
            categoryName: categoryName,
          },
          {
            headers: {
              Authorization: "Bearer " + userData.token,
            },
          }
        )
        .then((res) => {
          props.setAddCategory(!props.addCategory);
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => addCategoryOnDB(e)}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        alignItems: "center",
        border: "2px solid grey",
        width: "40%",
        margin: "20px auto 20px auto",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-controlled"
        label="Input Category Name"
        value={categoryName}
        required
        sx={{ width: "100%", m: 2 }}
        onChange={(event) => {
          setCategoryName(event.target.value);
        }}
      />
      <Button variant="outlined" type="submit" sx={{ width: "100%", m: 2 }}>
        Save
      </Button>
    </Box>
  );
}
export default AddCategory;
