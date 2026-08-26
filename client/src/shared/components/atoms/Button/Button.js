export function Button({
    children,
    type = "button",
    variant = "default",
    active = false,
    disabled = false,
    className = "",
    ...props
  }) {
    const variants = {
      default: `
        px-4 py-2
        font-semibold
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
      `,
  
      tab: `
        px-4 py-2
        font-semibold
        transition-colors
        ${
          active
            ? "border-b-2 border-[rgb(82,144,246)] text-[rgb(82,144,246)] dark:border-gray-200 dark:text-gray-200"
            : "text-gray-500"
        }
        disabled:cursor-not-allowed
        disabled:opacity-50
      `,
  
      outline: `
        px-4 py-2
        rounded-full
        border
        text-sm
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-50
      `,
      primary: `
      w-full rounded-lg py-3
      text-white font-semibold
      bg-[rgb(82,144,246)]
      hover:bg-[rgb(60,120,220)]
      transition shadow-md
      disabled:cursor-not-allowed
      disabled:opacity-50
    `,
      icon: `
        inline-flex
        items-center
        justify-center
        p-2
        rounded-full
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50
      `,
    };
  
    return (
      <button
        type={type}
        disabled={disabled}
        className={`${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }