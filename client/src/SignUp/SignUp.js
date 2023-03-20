import { useState } from "react";
import { useNavigate } from "react-router";
import * as muiSignUp from "./styles/muiSignUp";
import axios from "axios";
function SignUp() {
  // const [registrationData, setRegistrationData] = useState();
  const [err, setErr] = useState("");

  let navigate = useNavigate();
  function GoToSignIn() {
    navigate("/");
  }
  const noPointer = { cursor: "pointer" };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = muiSignUp.useForm();
  const onSubmit = (data) => {
    if (data) {
      axios
        .post("http://localhost:3000/api/v1/auth/register", data)
        .then((res) => {
          navigate("/");
        })
        .catch((err) => {
          setErr("User Already Exists");
        });
    }
  };

  return (
    <div className="inputForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="pSignIn">Sign Up</p>
        <muiSignUp.Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            width: "80%",
          }}
        >
          <muiSignUp.TextField
            required
            sx={{ mt: 1, width: "100%" }}
            id="name"
            label="First Name"
            variant="outlined"
            {...register("name", { required: "Required" })}
            error={!!errors?.name}
            helperText={errors?.name ? errors.name.message : null}
          />
        </muiSignUp.Box>
        <muiSignUp.TextField
          required
          sx={{ mt: 1, width: "80%" }}
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
        <muiSignUp.TextField
          required
          sx={{ mt: 1, width: "80%" }}
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          autoComplete="current-password"
          {...register("password", {
            required: "Required field",
            pattern: {
              value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
              message:
                "Invalid password It must be min 8 letter, with at least a symbol, upper and lower case letters and a number",
            },
          })}
          error={!!errors?.password}
          helperText={errors?.password ? errors.password.message : null}
        />
        {err ? (
          <p style={{ fontSize: "0.8rem", color: "#F44362" }}>{err}</p>
        ) : (
          ""
        )}

        <muiSignUp.Button
          variant="contained"
          sx={{ mt: 2 }}
          endIcon={<muiSignUp.VpnKeyIcon />}
          type="submit"
        >
          Create an Account
        </muiSignUp.Button>

        <muiSignUp.Link
          sx={{ mt: 2, mb: 2 }}
          onClick={GoToSignIn}
          style={noPointer}
        >
          Already have an account?
        </muiSignUp.Link>
      </form>
    </div>
  );
}
export default SignUp;
