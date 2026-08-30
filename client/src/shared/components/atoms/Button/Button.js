export function Button({
  children,
  type = "button",
  icon: Icon,
  text,
  className = "",
  disabled = false,
  active = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-full
        ${active ? "text-gray-400" : "text-gray-500"}
        ${className}
      `}
      {...props}
    >
      {Icon ? <Icon className="w-4 h-4" /> : text || children}
    </button>
  );
}