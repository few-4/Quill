import React, { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import CollaborativeCursor from "../../../pages/components/Collaborative Cursor";
import AuthHeader from "../components/AuthHeader";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { handleForgotPassword, handleResetPassword } = useAuth();
  
  const forgotPasswordMutation = handleForgotPassword();
  const resetPasswordMutation = handleResetPassword();

  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const passwordValue = watch("password");

  const handleOtpChange = useCallback((e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = val;
      return nextOtp;
    });

    if (val !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        setOtp((prev) => {
          const nextOtp = [...prev];
          nextOtp[index - 1] = "";
          return nextOtp;
        });
        inputRefs.current[index - 1]?.focus();
      } else {
        setOtp((prev) => {
          const nextOtp = [...prev];
          nextOtp[index] = "";
          return nextOtp;
        });
      }
    }
  }, [otp]);

  const handleOtpPaste = useCallback((e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  }, []);

  const onEmailSubmit = (data) => {
    forgotPasswordMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setResetEmail(data.email);
          setStep(2);
        },
      }
    );
  };

  const onResetSubmit = (data) => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    resetPasswordMutation.mutate(
      {
        email: resetEmail,
        otp: otpCode,
        password: data.password,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/sign-in");
          }, 3000);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 pt-16">
      <div className="grid-lines-bg" />

      <CollaborativeCursor name="Reset" color="#3b82f6" className="top-[20%] left-[8%] md:left-[14%]" />
      <CollaborativeCursor name="Recover" color="#ec4899" className="top-[50%] right-[7%] md:right-[13%]" />
      <CollaborativeCursor name="Secure" color="#10b981" className="bottom-[20%] left-[10%] md:left-[20%]" />

      <AuthHeader authLinkTo="/sign-in" authLinkText="Sign In" />

      <main className="flex-1 flex items-start justify-center pt-10 pb-10 w-full relative z-10">
        <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl px-9 pt-10 pb-8 flex flex-col theme-transition duration-300">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
              <CheckCircle2 className="w-16 h-16 text-brand-blue animate-bounce" />
              <h2 className="text-xl font-bold text-theme-txt-primary">Password Reset Successful</h2>
              <p className="text-sm text-theme-txt-secondary leading-relaxed">
                Your password has been successfully updated. Redirecting to the sign-in page...
              </p>
            </div>
          ) : step === 1 ? (
            <>
              <Link 
                to="/sign-in" 
                className="flex items-center gap-2 text-xs font-semibold text-theme-txt-secondary/60 hover:text-theme-txt-primary theme-transition duration-200 no-underline mb-6 group w-max"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to sign in</span>
              </Link>

              <div className="text-left mb-7">
                <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-theme-txt-primary mb-2.5 theme-transition duration-300">
                  Reset your password
                </h1>
                <p className="text-sm text-theme-txt-secondary leading-relaxed theme-transition duration-300">
                  Enter the email address associated with your account and we will send you a 6-digit recovery code.
                </p>
              </div>

              <form onSubmit={handleSubmit(onEmailSubmit)} className="flex flex-col gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reset-email" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em] theme-transition duration-300">
                    Email Address
                  </label>
                  <input
                    {...register("email", { 
                      required: "Email is required", 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                        message: "Invalid email address"
                      } 
                    })}
                    id="reset-email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
                  />
                  {errors.email && (
                    <p className="text-blue-500 text-xs text-center font-medium my-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {forgotPasswordMutation.isError && (
                  <p className="text-blue-500 text-xs text-center font-medium my-1">
                    {forgotPasswordMutation.error?.response?.data?.message || forgotPasswordMutation.error?.message || "Failed to send reset code. Please try again."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  id="reset-submit-btn"
                  className="w-full py-3 mt-2 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-[0.8125rem] font-bold tracking-[0.08em] cursor-pointer hover:opacity-90 active:scale-[0.98] theme-transition duration-200 border-none font-sans disabled:opacity-50"
                >
                  {forgotPasswordMutation.isPending ? "SENDING..." : "SEND RESET CODE"}
                </button>
              </form>
            </>
          ) : (
            <>
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="flex items-center gap-2 text-xs font-semibold text-theme-txt-secondary/60 hover:text-theme-txt-primary theme-transition duration-200 no-underline mb-6 group w-max bg-transparent border-none cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to email entry</span>
              </button>

              <div className="text-left mb-7">
                <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-theme-txt-primary mb-2.5 theme-transition duration-300">
                  Enter recovery code
                </h1>
                <p className="text-sm text-theme-txt-secondary leading-relaxed theme-transition duration-300">
                  We've sent a 6-digit code to <span className="text-theme-txt-primary font-semibold">{resetEmail}</span>. Enter the code and set your new password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onResetSubmit)} className="flex flex-col gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em]">
                    6-Digit Code
                  </label>
                  <div className="flex gap-2.5 justify-center my-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        placeholder="•"
                        value={otp[index] || ""}
                        disabled={resetPasswordMutation.isPending}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="w-11 h-11 text-center text-lg font-semibold rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary outline-none focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans placeholder:text-theme-txt-secondary/30 disabled:opacity-50"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="new-password" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em]">
                    New Password
                  </label>
                  <input
                    {...register("password", { 
                      required: "Password is required", 
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long"
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/,
                        message: "Must include: uppercase, lowercase, number, and special character (@#$!%*?&)"
                      }
                    })}
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
                  />
                  {errors.password && (
                    <p className="text-blue-500 text-xs text-center font-medium my-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirm-password" className="text-[0.8125rem] font-medium text-theme-txt-primary tracking-[-0.01em]">
                    Confirm Password
                  </label>
                  <input
                    {...register("confirmPassword", { 
                      required: "Please confirm your password", 
                      validate: (val) => val === passwordValue || "Passwords do not match"
                    })}
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none placeholder:text-theme-txt-secondary/50 focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans"
                  />
                  {errors.confirmPassword && (
                    <p className="text-blue-500 text-xs text-center font-medium my-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {resetPasswordMutation.isError && (
                  <p className="text-blue-500 text-xs text-center font-medium my-1">
                    {resetPasswordMutation.error?.response?.data?.message || resetPasswordMutation.error?.message || "Failed to reset password. Please verify the code and try again."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending || otp.join("").length < 6}
                  id="reset-submit-btn"
                  className="w-full py-3 mt-2 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-[0.8125rem] font-bold tracking-[0.08em] cursor-pointer hover:opacity-90 active:scale-[0.98] theme-transition duration-200 border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetPasswordMutation.isPending ? "RESETTING..." : "RESET PASSWORD"}
                </button>
              </form>
            </>
          )}

          <hr className="border-none border-t border-theme-border mb-5 theme-transition duration-300" />

          <p className="text-center text-sm text-theme-txt-secondary/60 theme-transition duration-300">
            Don't have an account?
            <Link to="/sign-up" id="reset-signup-link" className="text-theme-txt-primary font-semibold no-underline ml-1 hover:underline">
              Sign up
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

export default ResetPassword;