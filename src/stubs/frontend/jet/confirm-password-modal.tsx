import { PropsWithChildren, useState } from 'react';
import http from '../http';
import JetButton from './button';
import JetDialogModal from './dialog-modal';
import JetInputError from './input-error';
import JetInput from './input';
import { ModalProps } from './modal';

interface Props extends ModalProps {
  title?: string;
  onSuccess(): void;
}

export default function JetConfirmPasswordModal({
  title = 'Confirm Password',
  children = 'For your security, please confirm your password to continue.',
  onSuccess,
  ...modalProps
}: PropsWithChildren<Props>) {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ password: '' });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { ok, errors } = await http('user/confirm-password', {
      method: 'post',
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!ok) {
      return void setErrors(errors.errors);
    }
    modalProps.onClose();
    onSuccess();
  }

  return (
    <JetDialogModal
      {...modalProps}
      title={title}
      renderFooter={() => (
        <>
          <JetButton status={'secondary'} onClick={modalProps.onClose}>
            Nevermind
          </JetButton>

          <JetButton className="ml-2" onClick={submit} disabled={loading}>
            Ok
          </JetButton>
        </>
      )}
    >
      {children}

      <div className="mt-4">
        <JetInput
          type="password"
          className="mt-1 block w-3/4"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.currentTarget.value)}
        />

        <JetInputError className="mt-2">{errors.password}</JetInputError>
      </div>
    </JetDialogModal>
  );
}
