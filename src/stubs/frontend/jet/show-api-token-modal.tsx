import JetButton from './button';
import JetDialogModal from './dialog-modal';
import { ModalProps } from './modal';

interface Props extends ModalProps {
  rawToken: string;
}

export default function JetShowApiTokenModal({
  rawToken,
  ...modalProps
}: Props) {
  return (
    <JetDialogModal
      title={'API Token'}
      renderFooter={() => (
        <JetButton status={'secondary'} onClick={modalProps.onClose}>
          Close
        </JetButton>
      )}
      {...modalProps}
    >
      <div>
        Please copy your new API token. For your security, it won't be shown
        again.
      </div>

      <div className="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500">
        {rawToken}
      </div>
    </JetDialogModal>
  );
}
