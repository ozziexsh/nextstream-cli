import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';
import classNames from 'classnames';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const JetInput = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className={classNames(
      'border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm',
      props.className,
    )}
  />
));

export default JetInput;
