import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

import axios from "axios";

function ResetPassword() {
  // eslint-disable-next-line
  let navigate = useNavigate();
  const noPointer = { cursor: "pointer" };
  function GoToSignIn() {
    let url = window.location.pathname;
    let newurl = url.replace("/ResetPassword", "/");
    navigate(`${newurl}`, { replace: true });
  }
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3000/api/v1/auth/forgot-password", data)
      .then((res) => {
        toast.success('Please Check Your Email', {
          position: "top-center",
          autoClose: 700,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((err) => {
        toast.error('Account does not exist', {
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
      });


  };
  return (
    <div className="inputForm">
      <ToastContainer />

      <ThemeProvider theme={darkTheme}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="pSignIn">Reset Password</p>
          <TextField
            required
            id="email"
            label="Email"
            variant="outlined"
            {...register("email", {
              required: "Required field",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors?.email}
            helperText={errors?.email ? errors.email.message : null}

          />
          <Button variant="contained" sx={{ mt: 2 }} endIcon={<LoginIcon />} type='submit'>
            Send
          </Button>
          <Link sx={{ mt: 2, mb: 2 }} onClick={GoToSignIn} style={noPointer}>
            Already have an account?
          </Link>
        </form>
      </ThemeProvider>
    </div>
  );
}
export default ResetPassword;
