import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


import GradientButton from "../../../com/users/Button/Button";


import styles from "../login/Login.module.css";

export default function Register() {
  const [serverError, setServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();

  const registerUser = async (value) => {
    console.log("Sending data:", value);
    setIsLoading(true);
    const payload = {
      name: value.username,
      email: value.email,
      password: value.password,
    };
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/signup", payload);

      console.log("Response from server:", response.data);
      if (response.status === 201) {
        toast.success("Account created successfully. Please verify your email.", {
          autoClose: 2000,
          position: "top-right",
          theme: "light",
        });
        setServerError(false);
        navigate("/login");
      }
    } catch (error) {
      console.log("Server error:", error.response?.data);
      if (error.response?.status === 400) {
        setServerError("Email already in use");
      } else {
        setServerError("Server error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* أيقونة الشعار أعلى الصفحة */}
        <div className={styles.iconAbove} />

        {/* عنوان Register */}
        <h2 className={styles.signInTitle}>Register</h2>

        {/* رسالة خطأ السيرفر */}
        {serverError && <div className={styles.serverError}>{serverError}</div>}

        <form onSubmit={handleSubmit(registerUser)} className={styles.form} noValidate>
          {/* Username */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              User name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your user name"
              className={errors.username ? `${styles.input} ${styles.inputError}` : styles.input}
              {...register("username", { required: "Username is required" })}
            />
            <div className={styles.fieldError}>{errors.username?.message}</div>
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className={errors.email ? `${styles.input} ${styles.inputError}` : styles.input}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Email must be a valid Gmail address",
                },
              })}
            />
            <div className={styles.fieldError}>{errors.email?.message}</div>
          </div>

          {/* Password مع أيقونة الإظهار/الإخفاء */}
          <div className={styles.formGroup} style={{ position: "relative" }}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={errors.password ? `${styles.input} ${styles.inputError}` : styles.input}
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/,
                  message:
                    "Password must be longer than 8 characters and include uppercase, lowercase, number, and special character",
                },
              })}
            />
            {/* أيقونة العين */}
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? (
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.359 11.238l1.36 1.36c.146-.205.287-.422.417-.651C15.999 10.422 14 7.5 8 7.5c-1.195 0-2.326.155-3.382.434l1.527 1.527A3.495 3.495 0 018 8a3.5 3.5 0 013.5 3.5c0 .484-.102.938-.278 1.352l.138.386zm-2.085-2.086l1.596 1.596a5.509 5.509 0 00.802-1.027C14.239 8.289 12.023 6 8 6c-1.2 0-2.327.162-3.379.445l1.527 1.527A3.498 3.498 0 018 7.5c1.93 0 3.5 1.57 3.5 3.5 0 .9-.35 1.715-.926 2.304zm-2.44-2.44l1.44 1.44a1.5 1.5 0 01-2.12-2.12l1.44 1.44zm-2.343-2.344L5.748 7.315a1.5 1.5 0 012.122-2.122L6.831 6.814zM1.646 1.646a.5.5 0 11.708.708l12 12a.5.5 0 11-.708.708l-12-12a.5.5 0 01.708-.708z" />
                </svg>
              ) : (
               
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3.5-5.5-8-5.5S0 8 0 8s3.5 5.5 8 5.5S16 8 16 8zM8 12a4 4 0 110-8 4 4 0 010 8z" />
                  <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              )}
            </span>
            <div className={styles.fieldError}>{errors.password?.message}</div>
          </div>

          {/* Confirm Password مع أيقونة الإظهار/الإخفاء */}
          <div className={styles.formGroup} style={{ position: "relative" }}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className={
                errors.confirmPassword ? `${styles.input} ${styles.inputError}` : styles.input
              }
              {...register("confirmPassword", {
                required: "Confirmation is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {/* أيقونة العين */}
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showConfirmPassword ? (
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.359 11.238l1.36 1.36c.146-.205.287-.422.417-.651C15.999 10.422 14 7.5 8 7.5c-1.195 0-2.326.155-3.382.434l1.527 1.527A3.495 3.495 0 018 8a3.5 3.5 0 013.5 3.5c0 .484-.102.938-.278 1.352l.138.386zm-2.085-2.086l1.596 1.596a5.509 5.509 0 00.802-1.027C14.239 8.289 12.023 6 8 6c-1.2 0-2.327.162-3.379.445l1.527 1.527A3.498 3.498 0 018 7.5c1.93 0 3.5 1.57 3.5 3.5 0 .9-.35 1.715-.926 2.304zm-2.44-2.44l1.44 1.44a1.5 1.5 0 01-2.12-2.12l1.44 1.44zm-2.343-2.344L5.748 7.315a1.5 1.5 0 012.122-2.122L6.831 6.814zM1.646 1.646a.5.5 0 11.708.708l12 12a.5.5 0 11-.708.708l-12-12a.5.5 0 01.708-.708z" />
                </svg>
              ) : (
             
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3.5-5.5-8-5.5S0 8 0 8s3.5 5.5 8 5.5S16 8 16 8zM8 12a4 4 0 110-8 4 4 0 010 8z" />
                  <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              )}
            </span>
            <div className={styles.fieldError}>{errors.confirmPassword?.message}</div>
          </div>

          {/* زرّ التسجيل باستخدام GradientButton */}
          <GradientButton
            text={isLoading ? "Loading..." : "Register"}
            type="submit"
            disabled={isLoading}
          />
        </form>

        {/* جملة "Already have an account? Login" أسفل النموذج */}
        <div className={styles.footerText}>
          Already have an account?{" "}
          <a href="/login" className={styles.signUpLink}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
