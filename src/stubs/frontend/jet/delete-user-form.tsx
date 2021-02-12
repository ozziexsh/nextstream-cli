import React, { useState } from 'react';
import JetButton from './button';
import JetDialogModal from './dialog-modal';
import JetFormActionSection from './form-action-section';
import JetInputError from './input-error';
import JetInput from './input';
import http from '../http';

export default function JetDeleteUserForm() {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    password: '',
  });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { ok, errors } = await http('user', {
      method: 'delete',
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!ok) {
      return void setErrors(errors.errors);
    }
    setVisible(false);
    window.location.href = '/logout';
  }

  return (
    <JetFormActionSection
      title={'Delete Account'}
      description={'Permanently delete your account.'}
    >
      <div className="max-w-xl text-sm text-gray-600">
        Once your account is deleted, all of its resources and data will be
        permanently deleted. Before deleting your account, please download any
        data or information that you wish to retain.
      </div>

      <div className="mt-5">
        <JetButton status={'danger'} onClick={() => setVisible(true)}>
          Delete Account
        </JetButton>
      </div>

      {/* <!-- Delete User Confirmation Modal --> */}
      <JetDialogModal
        visible={visible}
        onClose={() => setVisible(false)}
        title={'Delete Account'}
        renderFooter={() => (
          <>
            <JetButton status={'secondary'} onClick={() => setVisible(false)}>
              Nevermind
            </JetButton>

            <JetButton
              status={'danger'}
              className="ml-2"
              onClick={submit}
              disabled={loading}
            >
              Delete Account
            </JetButton>
          </>
        )}
      >
        Are you sure you want to delete your account? Once your account is
        deleted, all of its resources and data will be permanently deleted.
        Please enter your password to confirm you would like to permanently
        delete your account.
        <div className="mt-4">
          <JetInput
            type="password"
            className="mt-1 block w-3/4"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
          />

          <JetInputError className="mt-2">{errors?.password}</JetInputError>
        </div>
      </JetDialogModal>
    </JetFormActionSection>
  );
}
