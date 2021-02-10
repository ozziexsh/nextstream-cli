import JetSectionTitle from './section-title';
import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

interface Props {
  title: string;
  description: string;
  className?: Pick<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'className'
  >;
}

export default function JetFormActionSection({
  title,
  description,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div
      {...props}
      className={classNames('md:grid md:grid-cols-3 md:gap-6', props.className)}
    >
      <JetSectionTitle title={title} description={description} />

      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
