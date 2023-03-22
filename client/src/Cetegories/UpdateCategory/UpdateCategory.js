import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateCategory(props) {
    const [newCategory, setNewCategory] = useState("");

    let userData = JSON.parse(sessionStorage.user);
    const UpdateCategoryOnDB = (e) => {
        e.preventDefault();
        if (newCategory.length && sessionStorage.user && props.categoryIdForUpdate) {
            axios
                .patch(
                    `http://localhost:3000/api/v1/finances/categories/${props.categoryIdForUpdate}`,
                    {
                        categoryName: newCategory,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + userData.token,
                        },
                    }
                )
                .then((res) => {
                    toast.success('Updated', {
                        position: "top-center",
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    props.setUpdateCategoryName(!props.updateCategoryName);
                    props.setUpdateCategory(!props.updateCategory)
                    props.setUpdateFinance(!props.updateFinance)
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
            onSubmit={(e) => UpdateCategoryOnDB(e)}
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
                label="Input New Category Name"
                value={newCategory}
                required
                sx={{ width: "100%", m: 2 }}
                onChange={(event) => {
                    setNewCategory(event.target.value);
                }}
            />
            <Button variant="outlined" type="submit" sx={{ width: "100%", m: 2 }} >
                Update
            </Button>
            <ToastContainer />

        </Box>
    );
}
export default UpdateCategory;
