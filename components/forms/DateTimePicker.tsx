interface DateTimePickerProps {
  label: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  value: string;
  type: "date" | "time";
}

export default function DateTimePicker(props: DateTimePickerProps) {
  return (
    <>
      <div>
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
          type={props.type}
        />
        <p className="text-red-600 text-xs mt-1">{props.error}</p>
      </div>
    </>
  );
}
