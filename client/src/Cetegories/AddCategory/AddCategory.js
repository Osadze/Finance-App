import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

function AddCategory(props) {
  const [categoryName, setCategoryName] = useState("");
  let userData = JSON.parse(sessionStorage.user);
  const addCategoryOnDB = (e) => {
    e.preventDefault();
    if (categoryName.length && sessionStorage.user) {
      axios
        .post(
          "http://localhost:3001/api/v1/finances/categories",
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
          toast.success('Category Added', {
            position: "top-center",
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          props.setAddCategory(!props.addCategory);
          props.setUpdateCategory(!props.updateCategory)
        })
        .catch((err) => {
          toast.error('Category Already Exists', {
            position: "top-center",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          console.log(err)
        }
        );
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
      <ToastContainer />

    </Box>
  );
}
export default AddCategory;
