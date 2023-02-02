import Link from "next/link";
import { useRouter } from "next/router";

interface SideBarMenuProps {
  href: string;
  solidIcon: any;
  outlineIcon: any;
  text: string;
  dashboard?: boolean;
}

export default function SidebarMenu(props: SideBarMenuProps) {
  const route = useRouter();
  return (
    <>
      {props.dashboard ? (
        <Link
          href={props.href}
          className="flex items-center gap-2 transition-all rounded-md px-3 py-2 hover:text-white hover:bg-gray-100 hover:bg-opacity-10"
        >
          {route.pathname === props.href ? (
            <>
              {/* Return a solidIcon with className */}
              <div className="text-white w-4">{props.solidIcon}</div>
            </>
          ) : (
            <>
              <div className="w-4">{props.outlineIcon}</div>
            </>
          )}
          <p
            className={
              route.pathname === props.href
                ? "text-sm text-white font-semibold"
                : "text-sm"
            }
          >
            {props.text}
          </p>
        </Link>
      ) : (
        <Link
          href={props.href}
          className="flex items-center gap-2 transition-all rounded-md px-3 py-2 hover:text-white hover:bg-gray-100 hover:bg-opacity-10"
        >
          {route.pathname.startsWith(props.href) ? (
            <>
              {/* Return a solidIcon with className */}
              <div className="text-white w-4">{props.solidIcon}</div>
            </>
          ) : (
            <>
              <div className="w-4">{props.outlineIcon}</div>
            </>
          )}
          <p
            className={
              route.pathname.startsWith(props.href)
                ? "text-sm text-white font-semibold"
                : "text-sm"
            }
          >
            {props.text}
          </p>
        </Link>
      )}
    </>
  );
}
