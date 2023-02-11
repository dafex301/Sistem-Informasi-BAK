import { useRouter } from "next/router";

interface PageTitleProps {
  title?: string;
  children?: string;
}

export default function PageTitle(props: PageTitleProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col -translate-y-14 mt-1 mx-5 gap-2">
        {router.pathname !== "/" && (
          <div
            onClick={router.back}
            className="flex text-gray-600 items-center gap-2 cursor-pointer hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z"
                clipRule="evenodd"
              />
            </svg>
            <p>Kembali</p>
          </div>
        )}
        <h1 className="text-3xl font-bold  ">
          {props.title ?? props.children}
        </h1>
      </div>
    </>
  );
}
