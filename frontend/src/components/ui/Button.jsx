import "./Button.css";

function Button({
  children,
  backgroundColor = "var(--color-accent)",
  textColor = "var(--color-white)",
  className = "",
  fullWidth = false,
  style,
  type = "button",
  ...props
}) {
  const buttonClassName = [
    "ui-button",
    fullWidth ? "ui-button--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClassName}
      style={{
        "--button-bg": backgroundColor,
        "--button-color": textColor,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
