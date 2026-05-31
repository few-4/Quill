import React, { useState, useCallback } from "react";
import { Link } from "react-router";
import CollaborativeCursor from "../../../pages/components/Collaborative Cursor";
import AuthHeader from "../components/AuthHeader";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth.js";

const Register = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleRegister } = useAuth();
  const { mutate: registerUser, isError, isPending, error } = handleRegister();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const passwordValue = watch("password");

  const onSubmit = useCallback((data) => {
    registerUser({
      email: data.email,
      password: data.password
    }, {
      onSuccess: () => reset(),
    });
  }, [registerUser, reset]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 pt-16">
      <div className="grid-lines-bg" />

      <CollaborativeCursor name="Create" color="#3b82f6" className="top-[18%] left-[8%] md:left-[14%]" />
      <CollaborativeCursor name="Innovate" color="#10b981" className="top-[55%] right-[7%] md:right-[13%]" />
      <CollaborativeCursor name="Showcase" color="#ec4899" className="bottom-[18%] left-[10%] md:left-[20%]" />

      <AuthHeader authLinkTo="/sign-in" authLinkText="Sign In" />

      <main className="flex-1 flex items-start justify-center pt-10 pb-10 w-full relative z-10">
        <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl px-9 pt-10 pb-8 flex flex-col theme-transition duration-300">

          <div className="text-center mb-7">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-theme-txt-primary mb-2.5 theme-transition duration-300">
              Create your Quill account
            </h1>
            <p className="text-sm text-theme-txt-secondary leading-relaxed theme-transition duration-300">
              Start building and collaborating in real-time.
            </p>
          </div>

          <form className="flex flex-col gap-4 mb-5" onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-email" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em] theme-transition duration-300">
                Email Address
              </label>
              <input
                {...register("email", {required: "Email is required", pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address"}})}
                id="register-email"
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
              />
              {errors.email && <p className="text-blue-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-password" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em] theme-transition duration-300">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {required: "Password is required", minLength: {value: 6, message: "Password must be at least 6 characters"}, 
                    pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                    }})}
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
                />
                {errors.password && <p className="text-blue-500 text-sm">{errors.password.message}</p>}
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  id="register-toggle-password"
                  aria-label="Show password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-txt-secondary/50 hover:text-theme-txt-secondary flex items-center theme-transition duration-200 bg-transparent border-none cursor-pointer p-0"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-confirm-password" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em] theme-transition duration-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (val) => val === passwordValue || "Passwords do not match"
                  })}
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
                />
                {errors.confirmPassword && <p className="text-blue-500 text-sm">{errors.confirmPassword.message}</p>}
                <button
                  onClick={toggleConfirmPasswordVisibility}
                  type="button"
                  id="register-toggle-confirm-password"
                  aria-label="Show confirm password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-txt-secondary/50 hover:text-theme-txt-secondary flex items-center theme-transition duration-200 bg-transparent border-none cursor-pointer p-0"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
            </div>

            {isError && (
              <p className="text-blue-500 text-xs text-center font-medium my-1">
                {error?.response?.data?.message || error?.message || "Registration failed. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              id="register-submit-btn"
              className="w-full py-3 mt-1 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-[0.8125rem] font-bold tracking-[0.08em] cursor-pointer hover:opacity-90 active:scale-[0.98] theme-transition duration-200 border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "REGISTERING..." : "SIGN UP"}
            </button>
          </form>

          <p className="text-center text-[0.8rem] text-theme-txt-secondary/60 leading-relaxed mb-5 theme-transition duration-300">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-theme-txt-primary font-medium no-underline hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-theme-txt-primary font-medium no-underline hover:underline">Privacy Policy</Link>.
          </p>

          <hr className="border-none border-t border-theme-border mb-5 theme-transition duration-300" />

          <p className="text-center text-sm text-theme-txt-secondary/60 theme-transition duration-300">
            Already have an account?
            <Link to="/sign-in" id="register-signin-link" className="text-theme-txt-primary font-semibold no-underline ml-1 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

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

export default Register;