import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import http from '../http';
import JetButton from './button';
import JetConfirmationModal from './confirmation-modal';
import { ModalProps } from './modal';

interface Props extends ModalProps {
  tokenId: number;
  onSuccess(): void;
}

export default function JetDeleteApiTokenModal({
  tokenId,
  onSuccess,
  ...modalProps
}: Props) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();

  async function submit() {
    setLoading(true);
    const { ok } = await http(`api-tokens/${tokenId}`, {
      method: 'delete',
    });
    setLoading(false);
    if (!ok) {
      return void addToast('Failed to delete token', { appearance: 'error' });
    }
    addToast('Token deleted', { appearance: 'success' });
    modalProps.onClose();
    onSuccess();
  }

  return (
    <JetConfirmationModal
      title={'Delete API Token'}
      renderFooter={() => (
        <>
          <JetButton status={'secondary'} onClick={modalProps.onClose}>
            Nevermind
          </JetButton>

          <JetButton
            status={'danger'}
            className="ml-2"
            disabled={loading}
            onClick={submit}
          >
            Delete
          </JetButton>
        </>
      )}
      {...modalProps}
    >
      Are you sure you would like to delete this API token?
    </JetConfirmationModal>
  );
}
