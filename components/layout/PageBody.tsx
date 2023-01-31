interface PageTitleProps {
  children?: React.ReactNode;
}

export default function PageTitle(props: PageTitleProps) {
  return (
    <div className="rounded-sm mx-5 -translate-y-10">{props.children}</div>
  );
}
