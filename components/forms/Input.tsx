interface InputProps {
  label: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  value: string | number;
  placeholder?: string;
  type?: "text" | "date" | "time" | "datetime-local" | "number";
  style?: "dark" | "light";
}

export default function Input(props: InputProps) {
  return (
    <>
      <div className="w-full">
        {props.style === "light" ? (
          <>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor={props.id}
            >
              {props.label}
            </label>
            <input
              onChange={props.onChange}
              value={props.value}
              className={
                !props.error
                  ? " border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  : " border border-red-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              }
              id={props.id}
              type={props.type ?? "text"}
              placeholder={props.placeholder ?? props.label}
            />
          </>
        ) : (
          <>
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor={props.id}
            >
              {props.label}
            </label>
            <input
              onChange={props.onChange}
              value={props.value}
              className={
                props.error
                  ? "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  : "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id={props.id}
              type={props.type ?? "text"}
              placeholder={props.placeholder ?? props.label}
            />
          </>
        )}

        <p className="text-red-600 text-xs mt-1">{props.error}</p>
      </div>
    </>
  );
}
