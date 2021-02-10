import { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';

interface Props extends LinkProps {
  className?: Pick<HTMLAttributes<HTMLAnchorElement>, 'className'>;
}

export default function JetDropdownLink({
  className,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <Link {...props}>
      <a
        className={classNames(
          'block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out',
          className,
        )}
      >
        {children}
      </a>
    </Link>
  );
}
