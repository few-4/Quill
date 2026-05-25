import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import CollaborativeCursor from "../../../pages/components/Collaborative Cursor";
import AuthHeader from "../components/AuthHeader";
import { useVerifyOtp } from "../hooks/useAuth";

const VerifyOTP = () => {
  const queryClient = useQueryClient();
  
  const email = queryClient.getQueryData(["register-email"]) || "";

  const { mutate: verifyOtp, isPending, isError, error } = useVerifyOtp();

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format MM:SS helper
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }, []);

  const handleResend = useCallback(() => {
    setTimeLeft(120);
    // Any future resend API trigger can go here
  }, []);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    getValues,
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const otpValues = watch("otp") || ["", "", "", "", "", ""];
  const inputRefs = useRef([]);

  const handleChange = useCallback((e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    setValue(`otp.${index}`, val, { shouldValidate: true });

    if (val !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }, [setValue]);

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === "Backspace") {
      const currentVal = getValues(`otp.${index}`);
      if (currentVal === "" && index > 0) {
        setValue(`otp.${index - 1}`, "");
        inputRefs.current[index - 1].focus();
      } else {
        setValue(`otp.${index}`, "");
      }
    }
  }, [getValues, setValue]);

  const handlePaste = useCallback((e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const digits = pasteData.split("");
      digits.forEach((digit, i) => {
        setValue(`otp.${i}`, digit, { shouldValidate: true });
      });
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  }, [setValue]);

  const onSubmit = useCallback((data) => {
    const otpCode = data.otp.join("");
    if (otpCode.length === 6) {
      verifyOtp({
        email,
        otp: otpCode,
      });
    }
  }, [email, verifyOtp]);


  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 pt-16">
      {/* Background grid */}
      <div className="grid-lines-bg" />

      {/* Decorative collaborative cursors */}
      <CollaborativeCursor name="Verify" color="#3b82f6" className="top-[18%] left-[8%] md:left-[14%]" />
      <CollaborativeCursor name="Secure" color="#10b981" className="top-[55%] right-[7%] md:right-[13%]" />
      <CollaborativeCursor name="Confirm" color="#ec4899" className="bottom-[18%] left-[10%] md:left-[20%]" />

      {/* Auth header — fixed navbar style */}
      <AuthHeader authLinkTo="/sign-in" authLinkText="Sign In" />

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center pt-10 pb-10 w-full relative z-10">
        <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl px-9 pt-10 pb-8 flex flex-col theme-transition duration-300">

          {/* Title */}
          <div className="text-center mb-7">
            <h1 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-theme-txt-primary mb-2.5 theme-transition duration-300">
              Verify your email
            </h1>
            <p className="text-sm text-theme-txt-secondary leading-relaxed theme-transition duration-300">
              We've sent a 6-digit verification code to{" "}
              {email ? (
                <span className="text-theme-txt-primary font-semibold">{email}</span>
              ) : (
                "your email address"
              )}
              . Enter the code below to secure your account.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4 mb-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* OTP Input Fields */}
            <div className="flex gap-2.5 justify-center my-3">
              {Array.from({ length: 6 }).map((_, index) => {
                const { ref: RHFRef, ...rest } = register(`otp.${index}`, {
                  required: true,
                  pattern: /^[0-9]$/
                });

                return (
                  <input
                    key={index}
                    {...rest}
                    ref={(el) => {
                      RHFRef(el); // Hook up RHF register ref
                      inputRefs.current[index] = el; // Store local ref for auto-focusing
                    }}
                    type="text"
                    maxLength={1}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="•"
                    value={otpValues[index] || ""}
                    disabled={isPending}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary outline-none focus:border-theme-txt-secondary/40 theme-transition duration-200 font-sans placeholder:text-theme-txt-secondary/30 disabled:opacity-50"
                  />
                );
              })}
            </div>

            {/* Hook Form Validation Message */}
            {errors.otp && (
              <p className="text-blue-500 text-xs text-center font-medium my-1">
                Please enter a complete 6-digit OTP code.
              </p>
            )}

            {/* Server Error Message */}
            {isError && (
              <p className="text-blue-500 text-xs text-center font-medium my-1">
                {error?.response?.data?.message || error?.message || "Invalid OTP code. Please try again."}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || otpValues.join("").length < 6}
              id="verify-submit-btn"
              className="w-full py-3 mt-2 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-[0.8125rem] font-bold tracking-[0.08em] cursor-pointer hover:opacity-90 active:scale-[0.98] theme-transition duration-200 border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "VERIFYING..." : "VERIFY EMAIL"}
            </button>
          </form>

          {/* Resend code option */}
          <p className="text-center text-[0.8rem] text-theme-txt-secondary/60 leading-relaxed mb-5 theme-transition duration-300">
            Didn't receive the code?{" "}
            {timeLeft > 0 ? (
              <span className="text-theme-txt-secondary/80 font-medium">
                Resend code in <span className="font-mono font-bold text-theme-txt-primary">{formatTime(timeLeft)}</span>
              </span>
            ) : (
              <button
                type="button"
                id="verify-resend-btn"
                disabled={isPending}
                onClick={handleResend}
                className="text-theme-txt-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
              >
                Resend code
              </button>
            )}
          </p>

          {/* Divider */}
          <hr className="border-none border-t border-theme-border mb-5 theme-transition duration-300" />

          {/* Change email option */}
          <p className="text-center text-sm text-theme-txt-secondary/60 theme-transition duration-300">
            Entered the wrong email?{" "}
            <Link to="/sign-up" id="verify-change-email-link" className="text-theme-txt-primary font-semibold no-underline hover:underline">
              Change email
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
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

export default VerifyOTP;