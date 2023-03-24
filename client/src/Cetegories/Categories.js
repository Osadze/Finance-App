import * as React from "react";
import { useState, useEffect } from "react";
import "./styles/categories.scss";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  // TextField,
  MenuItem,
} from "@mui/material";

import AddCategory from "./AddCategory/AddCategory";
import AddFinance from "./AddFinance/AddFinance";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AdbIcon from "@mui/icons-material/Adb";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router";
import axios from "axios";
import AllFinance from "./AllFinance/AllFinance";
import UpdateCategory from "./UpdateCategory/UpdateCategory";
import SearchAndSort from "./SearchAndSort/SearchAndSort";

function Categories() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [myCategories, setMyCategories] = useState([]);
  const [addCategory, setAddCategory] = useState(false);
  const [addFinance, setAddFinance] = useState(false);
  const [updateFinance, setUpdateFinance] = useState(false);
  const [updateCategory, setUpdateCategory] = useState(false);
  const [updateCategoryName, setUpdateCategoryName] = useState(false);
  const [categoryIdForUpdate, setAddCategoryIdForUpdate] = useState("");

  const navigate = useNavigate();
  let userData = JSON.parse(sessionStorage.user);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const SignOut = () => {
    sessionStorage.clear();
    navigate(0);
  };
  const EditCategory = (e) => {
    if (e.target.id) {
      setUpdateCategoryName(!updateCategoryName);
      setAddCategoryIdForUpdate(e.target.id);
    }
  };
  const DeleteCategory = (e) => {
    if (e.target.id) {
      axios
        .delete(
          `http://localhost:3000/api/v1/finances/categories/${e.target.id}`,

          {
            headers: {
              Authorization: "Bearer " + userData.token,
            },
          }
        )
        .then((res) => {
          toast.success("Category Deleted", {
            position: "top-center",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setUpdateCategory(!updateCategory);
          setUpdateFinance(!updateFinance);
        })
        .catch((err) => {
          toast.error("Could Not Be Deleted", {
            position: "top-center",
            autoClose: 700,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          console.log(err);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/finances/categories", {
        headers: {
          Authorization: "Bearer " + userData.token,
        },
      })
      .then((res) => {
        setMyCategories(res.data.categories);
      });
    // eslint-disable-next-line
  }, [updateCategory]);

  return (
    <div className="categories">
      <div className="postContainer">
        <AppBar position="static">
          <Container maxWidth="xl">
            <ToastContainer />
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                LOGO
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {myCategories?.map((page, index) => (
                    <MenuItem key={index} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        {page.categoryName}
                      </Typography>
                      <EditIcon
                        fontSize="small"
                        onClick={(e) => {
                          EditCategory(e);
                        }}
                        id={page.categoryName}
                      />

                      <DeleteIcon
                        fontSize="small"
                        onClick={(e) => DeleteCategory(e)}
                        id={page.categoryName}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                LOGO
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {myCategories?.map((page, index) => (
                  <Box sx={{ display: "flex" }} key={index}>
                    <Button
                      key={index}
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color: "white",
                        display: "block",
                      }}
                    >
                      {page.categoryName}
                    </Button>

                    <EditIcon
                      className="hoverBG"
                      fontSize="small"
                      sx={{
                        my: 2,
                        mt: 2.4,
                        p: 1,
                      }}
                      id={page.categoryName}
                      onClick={(e) => {
                        EditCategory(e);
                      }}
                    />
                    <DeleteIcon
                      id={page.categoryName}
                      fontSize="small"
                      className="hoverBG"
                      onClick={(e) => DeleteCategory(e)}
                      sx={{
                        my: 2,
                        mt: 2.4,
                        p: 1,
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                sx={{
                  mr: 1,
                }}
                endIcon={<AddIcon />}
                onClick={(e) => setAddCategory(!addCategory)}
              >
                Add Category
              </Button>
              <Button
                sx={{
                  mr: 1,
                }}
                variant="contained"
                endIcon={<AddCircleOutlineIcon />}
                onClick={(e) => {
                  setAddFinance(!addFinance);
                }}
              >
                Add Finance
              </Button>
              <Button
                variant="outlined"
                onClick={SignOut}
                endIcon={<LogoutIcon />}
              >
                Sign Out
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        {updateCategoryName && (
          <UpdateCategory
            categoryIdForUpdate={categoryIdForUpdate}
            setUpdateCategoryName={setUpdateCategoryName}
            updateCategoryName={updateCategoryName}
            setUpdateCategory={setUpdateCategory}
            updateCategory={updateCategory}
            setUpdateFinance={setUpdateFinance}
            updateFinance={updateFinance}
          />
        )}
        {addCategory && (
          <AddCategory
            setAddCategory={setAddCategory}
            addCategory={addCategory}
            setUpdateCategory={setUpdateCategory}
            updateCategory={updateCategory}
          />
        )}

        {addFinance && (
          <AddFinance
            myCategories={myCategories}
            setAddFinance={setAddFinance}
            addFinance={addFinance}
            setUpdateFinance={setUpdateFinance}
            updateFinance={updateFinance}
          />
        )}


        <SearchAndSort
          myCategories={myCategories}
          setUpdateFinance={setUpdateFinance}
          updateFinance={updateFinance}
        />

{/* <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} /> */}



        <AllFinance updateFinance={updateFinance} />
        <ToastContainer />
      </div>
    </div>
  );
}
export default Categories;
