interface PageBodyProps {
  children?: React.ReactNode;
}

export default function PageBody(props: PageBodyProps) {
  return (
    <div className="rounded-sm mx-5 -translate-y-10">{props.children}</div>
  );
}
