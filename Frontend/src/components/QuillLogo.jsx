import React from "react";
import logoSvg from "../assets/QuillLogo.svg";

export function QuillLogo({ className = "w-10 h-10" }) {
  return (
    <img
      src={logoSvg}
      alt="Quill Logo"
      className={`${className} object-contain`}
    />
  );
}
