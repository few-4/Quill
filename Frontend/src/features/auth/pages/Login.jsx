import React, { useState, useCallback } from "react";
import { Link } from "react-router";
import CollaborativeCursor from "../../../pages/components/Collaborative Cursor";
import AuthHeader from "../components/AuthHeader";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();
  const { mutate: loginUser, isError, isPending, error } = handleLogin();

  const onSubmit = useCallback((data) => {
    loginUser({
      email: data.email,
      password: data.password
    });
    reset();
  }, [loginUser, reset]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);


  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 pt-16">
      {}
      <div className="grid-lines-bg" />

      {}
      <CollaborativeCursor name="Plan" color="#3b82f6" className="top-[20%] left-[8%] md:left-[14%]" />
      <CollaborativeCursor name="Design" color="#ec4899" className="top-[50%] right-[7%] md:right-[13%]" />
      <CollaborativeCursor name="Develop" color="#10b981" className="bottom-[20%] left-[10%] md:left-[20%]" />

      {}
      <AuthHeader authLinkTo="/sign-up" authLinkText="Sign Up" />

      {}
      <main className="flex-1 flex items-start justify-center pt-10 pb-10 w-full relative z-10">
        <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl px-9 pt-10 pb-8 flex flex-col theme-transition duration-300">

          {}
          <div className="text-center mb-7">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-theme-txt-primary mb-2.5 theme-transition duration-300">
              Welcome back
            </h1>
            <p className="text-sm text-theme-txt-secondary leading-relaxed theme-transition duration-300">
              Sign in to your Quill account to continue.
            </p>
          </div>

          {}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-5">

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em] theme-transition duration-300">
                Email Address
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                id="login-email"
                type="email"
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
              />
              {errors.email && <p className="text-blue-500 text-xs text-center font-medium my-1">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em] theme-transition duration-300">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
                />
                {errors.password && <p className="text-blue-500 text-xs text-center font-medium my-1">{errors.password.message}</p>}
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  id="login-toggle-password"
                  aria-label="Show password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-txt-secondary/50 hover:text-theme-txt-secondary flex items-center theme-transition duration-200 bg-transparent border-none cursor-pointer p-0"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {isError && (
              <p className="text-blue-500 text-xs text-center font-medium my-1">
                {error?.response?.data?.message || error?.message || "Invalid email or password. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              id="login-submit-btn"
              className="w-full py-3 mt-1 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-[0.8125rem] font-bold tracking-[0.08em] cursor-pointer hover:opacity-90 active:scale-[0.98] theme-transition duration-200 border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          {}
          <hr className="border-none border-t border-theme-border mb-5 theme-transition duration-300" />

          {}
          <p className="text-center text-sm text-theme-txt-secondary/60 theme-transition duration-300">
            Don't have an account?
            <Link to="/sign-up" id="login-signup-link" className="text-theme-txt-primary font-semibold no-underline ml-1 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {}
      <footer className="w-full flex justify-between items-center px-12 py-6 relative z-10">
        <span className="text-[0.8rem] text-theme-txt-secondary/40 theme-transition duration-300">
          © 2026 Quill Technologies Inc. All rights reserved.
        </span>
        <div className="flex gap-7">
          <Link to="/privacy" className="text-[0.8rem] text-theme-txt-secondary/40 no-underline hover:text-theme-txt-secondary theme-transition duration-200">Privacy Policy</Link>
          <Link to="/terms" className="text-[0.8rem] text-theme-txt-secondary/40 no-underline hover:text-theme-txt-secondary theme-transition duration-200">Terms of Service</Link>
          <Link to="/security" className="text-[0.8rem] text-theme-txt-secondary/40 no-underline hover:text-theme-txt-secondary theme-transition duration-200">Security</Link>
        </div>
      </footer>
    </div>
  );
};

export default Login;