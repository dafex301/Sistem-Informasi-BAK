interface InputProps {
  label: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  value: string | number;
  placeholder?: string;
  type?: "text" | "date" | "time" | "datetime-local" | "number" | "tel";
  style?: "dark" | "light";
  required?: boolean;
  defaultValue?: string;
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
              {props.required ? "*" : ""}
            </label>
            <input
              onChange={props.onChange}
              value={props.value}
              className={
                !props.error
                  ? "appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  : "appearance-none border-2 border-red-500 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              }
              id={props.id}
              type={props.type ?? "text"}
              placeholder={props.placeholder ?? props.label}
              required={props.required}
              defaultValue={props.defaultValue}
            />
          </>
        ) : (
          <>
            <label
              className="block tracking-wide text-gray-700 text-sm font-bold mb-2"
              htmlFor={props.id}
            >
              {props.label}
              {props.required ? "*" : ""}
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
