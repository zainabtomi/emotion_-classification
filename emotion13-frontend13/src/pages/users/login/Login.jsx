import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Slide } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Login.module.css";
import GradientButton from "../../../com/users/Button/Button";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", data);
      if (response.status === 200) {
        
         localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); 



        toast.success("Login successful", { transition: Slide });

        setTimeout(() => {
          if (response.data.user.is_admin) {
            navigate("/dashboard/stats");
          } else {
            navigate("/index");
          }
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.detail || "Login failed";
      setServerError(message);
      toast.error(message, { transition: Slide });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconAbove} />
        <h2 className={styles.signInTitle}>Sign in</h2>
        {serverError && <div className={styles.serverError}>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="enter your email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              {...register("email", {
                required: "Email is required",
                onChange: () => setServerError(null),
              })}
            />
            <div className={styles.fieldError}>{errors.email?.message}</div>
          </div>

          <div className={styles.formGroup} style={{ position: "relative" }}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="enter your password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              {...register("password", {
                required: "Password is required",
                onChange: () => setServerError(null),
              })}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
            <div className={styles.fieldError}>{errors.password?.message}</div>
          </div>

          <div className={styles.forgotWrapper}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot your password ?
            </Link>
          </div>

          <GradientButton
            type="submit"
            disabled={isLoading}
            text={isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
          />
        </form>

        <div className={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.signUpLink}>
            Sign up
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
