import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function UpdatePassword() {
  // eslint-disable-next-line
  let navigate = useNavigate();
  let { userID, token } = useParams();
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
      .patch(
        `http://localhost:3000/api/v1/auth/reset-password/${userID}/${token}`,
        data
      )
      .then((res) => {
        toast.success("Please Check Your Email", {
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="inputForm">
      <ToastContainer />
      <ThemeProvider theme={darkTheme}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="pSignIn">New Password</p>

          <TextField
            required
            sx={{ mt: 1 }}
            id="password1"
            label="New Password"
            type="password"
            variant="outlined"
            autoComplete="current-password"
            {...register("password1", {
              required: "Required field",
              pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message:
                  "Invalid password It must be min 8 letter password, with at least a symbol, upper and lower case letters and a number",
              },
            })}
            error={!!errors?.password}
            helperText={errors?.password ? errors.password.message : null}
          />

          <TextField
            required
            sx={{ mt: 1 }}
            id="password2"
            label="Repeat Password"
            type="password"
            variant="outlined"
            autoComplete="current-password"
            {...register("password2", {
              required: "Required field",
              pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message:
                  "Invalid password It must be min 8 letter password, with at least a symbol, upper and lower case letters and a number",
              },
            })}
            error={!!errors?.password}
            helperText={errors?.password ? errors.password.message : null}
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            endIcon={<LoginIcon />}
            type="submit"
          >
            Change Password
          </Button>
        </form>
      </ThemeProvider>
    </div>
  );
}
export default UpdatePassword;
