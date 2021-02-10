import { PropsWithChildren } from 'react';
import JetModal, { ModalProps } from './modal';

interface Props extends ModalProps {
  title: string;
  renderFooter(): JSX.Element;
}

export default function JetDialogModal({
  title,
  renderFooter,
  children,
  ...modalProps
}: PropsWithChildren<Props>) {
  return (
    <JetModal {...modalProps}>
      <div className="px-6 py-4">
        <div className="text-lg">{title}</div>

        <div className="mt-4">{children}</div>
      </div>
      <div className="px-6 py-4 bg-gray-100 text-right">{renderFooter()}</div>
    </JetModal>
  );
}
