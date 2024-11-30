import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";

let schema = Yup.object().shape({
  email: Yup.string()
    .email("Email should be valid.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  const authState = useSelector((state) => state);

  const { user, isError, isSuccess, isLoading, message } = authState.auth;

  useEffect(() => {
    if (isSuccess) {
      navigate("admin");
    } else {
      navigate("");
    }
  }, [user, isError, isSuccess, isLoading]);

  return (
    <div className="py-5" style={{ background: "#24aec9", minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="login-input1 my-5 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        <div className="error text-center">
          {message.message === "Rejected" ? "You are not an Admin" : ""}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="email"
            label="Email Address"
            id="email"
            val={formik.values.email}
            onChg={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
          />
          <div className="error">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
          <CustomInput
            type="password"
            name="password"
            label="Password"
            id="pass"
            val={formik.values.password}
            onChg={formik.handleChange("password")}
            onBlr={formik.handleBlur("password")}
          />
          <div className="error mt-2">
            {formik.touched.password && formik.errors.password}
            {/* // ? ( <div>{formik.errors.password}</div>
            // ) : null} */}
          </div>
          <div className="mb-3 text-end">
            <Link to="forgot-password" className="">
              Forgot Password?
            </Link>
          </div>

          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5"
            style={{
              background: hover ? "#106f9c" : "#24aec9",
              transition: "background-color 0.3s ease",
            }}
            type="submit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Login
          </button>
          {/* <Link to="/signup" className="button1 signup">
                      SignUp
                    </Link> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
