import clsx from "clsx";

const variantStyles = {
  primary:
    "border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
  secondary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
};

type ButtonProps = {
  variant: keyof typeof variantStyles;
} & React.HtmlHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const { variant, className, ...htmlProps } = props;

  return (
    <button
      type="button"
      className={clsx(
        className,
        variantStyles[variant],
        "inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      )}
      {...htmlProps}
    />
  );
};
