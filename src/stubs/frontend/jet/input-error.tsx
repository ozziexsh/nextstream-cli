import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function JetInputError({ children, ...props }: Props) {
  if (!children) {
    return null;
  }

  return (
    <p
      {...props}
      className={classNames('text-sm text-red-600', props.className)}
    >
      {children}
    </p>
  );
}
