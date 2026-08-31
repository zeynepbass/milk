export function Button({
  children,
  type = "button",
  icon: Icon,
  text,
  className = "",
  variant = "default",
  disabled = false,
  active,
  loading = false,
  loadingText = "Yükleniyor...",
  ...props
}) {
  const variants = {
    default: "text-gray-500 ",
    dark: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "text-gray-500 hover:text-red-500",
    primary:
      "bg-[rgb(82,144,246)] dark:bg-gray-900 hover:opacity-90 text-white gap-2 px-5 py-2 rounded-full disabled:cursor-not-allowed",
tab: ""
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        
        px-4 py-2 rounded-full
        ${variants[variant] || variants.default}
        ${active ? "text-[#89CDFB] dark:text-white  border-[rgb(137,205,251)]"
          : "text-gray-500"}
        ${className}
      `}
      {...props}
    >
{loading ? (
  loadingText
) : (
  <>
    {Icon && <Icon className="w-4 h-4" />}
    {text || children}
  </>
)}
    </button>
  );
}