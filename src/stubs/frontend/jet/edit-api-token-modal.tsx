import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import http from '../http';
import JetButton from './button';
import JetCheckbox from './checkbox';
import JetDialogModal from './dialog-modal';
import { ModalProps } from './modal';

interface Form {
  permissions: string[];
}

interface Props extends ModalProps {
  availablePermissions: string[];
  initialPermissions: string[];
  tokenId: number;
  onSuccess(): void;
}

export default function JetEditApiTokenModal({
  availablePermissions,
  initialPermissions,
  tokenId,
  onSuccess,
  ...modalProps
}: Props) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm({
    defaultValues: { permissions: initialPermissions },
  });

  async function submit({ permissions }: Form) {
    setLoading(true);
    const { ok } = await http(`api-tokens/${tokenId}`, {
      method: 'put',
      body: JSON.stringify({ permissions }),
    });
    setLoading(false);
    if (!ok) {
      return void addToast('Failed to update token', { appearance: 'error' });
    }
    addToast('Updated token', { appearance: 'success' });
    modalProps.onClose();
    onSuccess();
  }

  return (
    <JetDialogModal
      title={'API Token Permissions'}
      renderFooter={() => (
        <>
          <JetButton status={'secondary'} onClick={modalProps.onClose}>
            Nevermind
          </JetButton>

          <JetButton
            className="ml-2"
            onClick={handleSubmit(submit)}
            disabled={loading}
          >
            Save
          </JetButton>
        </>
      )}
      {...modalProps}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availablePermissions.map(permission => (
          <div key={permission}>
            <label className="flex items-center">
              <JetCheckbox
                id={`edit-permission-${permission}`}
                name={'permissions[]'}
                ref={register}
                value={permission}
              />
              <span className="ml-2 text-sm text-gray-600">{permission}</span>
            </label>
          </div>
        ))}
      </div>
    </JetDialogModal>
  );
}
