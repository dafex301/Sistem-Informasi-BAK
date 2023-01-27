interface PageTitleProps {
  title?: string;
  children?: string;
}

export default function PageTitle(props: PageTitleProps) {
  return (
    <h1 className="text-3xl font-bold -translate-y-14 mt-1 mx-5">
      {props.title ?? props.children}
    </h1>
  );
}
