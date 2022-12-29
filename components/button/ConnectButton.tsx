import React from "react";
import Image from "next/image";

type ConnectButtonProps = {
  icon: string;
  provider: string;
  handler: Function;
  identities: string;
  width?: number;
};

export default function ConnectButton(props: ConnectButtonProps) {
  return (
    <div>
      <button
        aria-label={`Connect with ${props.provider}`}
        role="button"
        className="disabled:bg-gray-200 focus:outline-none p-3 mt-5 focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 border rounded-lg border-gray-400 flex items-center w-full"
        onClick={() => (props.identities ? null : props.handler)}
        disabled={props.identities ? true : false}
      >
        <Image
          className={props.identities ? "filter" : ""}
          width={props.width ?? 30}
          src={props.icon}
          alt={`${props.provider} Icon`}
        />
        <p className="ml-3 text-base font-medium text-gray-600">
          {props.identities
            ? "Already connected"
            : `Connect with ${props.provider}`}
        </p>
      </button>
    </div>
  );
}
