import classNames from 'classnames';
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const JetCheckbox = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    {...props}
    type="checkbox"
    ref={ref}
    className={classNames(
      'rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
      props.className,
    )}
  />
));

export default JetCheckbox;
