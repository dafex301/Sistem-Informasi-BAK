import { useState } from "react";

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}

export default function Select(props: SelectProps) {
  const [click, setClick] = useState<boolean>(false);

  return (
    <div className="relative pt-5 w-full">
      <label
        className={
          click
            ? "text-xs absolute left-3 top-3 bg-white px-1 text-blue-600 dark:text-blue-400"
            : "text-xs absolute left-3 top-3 bg-white px-1 text-gray-600 dark:text-gray-400"
        }
        htmlFor={props.label}
      >
        {props.label}
      </label>
      <select
        id={props.label}
        value={props.value}
        onChange={props.onChange}
        className=" text-sm text-gray-700 font-normal dark:text-white bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full py-2 pl-3 pr-10 sm:text-sm rounded-md transition-all"
        onClick={() => setClick(true)}
        onBlur={() => setClick(false)}
      >
        {props.children}
      </select>
    </div>
  );
}
