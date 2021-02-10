import {
  DetailedHTMLProps,
  LabelHTMLAttributes,
  PropsWithChildren,
} from 'react';
import classNames from 'classnames';

type Props = DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export default function JetLabel({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <label
      {...props}
      className={classNames(
        'block font-medium text-sm text-gray-700',
        props.className,
      )}
    >
      {children}
    </label>
  );
}
