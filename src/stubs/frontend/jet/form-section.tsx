import JetSectionTitle from './section-title';
import classNames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

interface Props {
  title: string;
  description: string;
  renderActions?(): JSX.Element;
  onSubmit?(e: React.FormEvent<HTMLFormElement>): void | Promise<void>;
  className?: Pick<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'className'
  >;
}

export default function JetFormSection({
  title,
  description,
  children,
  renderActions,
  onSubmit,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div
      {...props}
      className={classNames('md:grid md:grid-cols-3 md:gap-6', props.className)}
    >
      <JetSectionTitle title={title} description={description} />

      <div className="mt-5 md:mt-0 md:col-span-2">
        <form onSubmit={onSubmit}>
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">{children}</div>
            </div>

            {renderActions && (
              <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6">
                {renderActions()}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
