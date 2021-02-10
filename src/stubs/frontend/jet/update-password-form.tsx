import { useState } from 'react';
import http from '../http';
import JetButton from './button';
import JetFormSection from './form-section';
import JetInputError from './input-error';
import JetInput from './input';
import JetLabel from './label';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
import { handleFormErrors } from './providers';

interface Form {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export default function JetUpdatePasswordForm() {
  const { register, handleSubmit, errors, setError, reset } = useForm<Form>();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);

  async function submit(values: Form) {
    setLoading(true);
    const { ok, errors: submitErrors } = await http('user/password', {
      method: 'put',
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    reset();
    addToast('Password updated', { appearance: 'success' });
  }

  return (
    <JetFormSection
      title={'Update Password'}
      description={
        'Ensure your account is using a long, random password to stay secure.'
      }
      onSubmit={handleSubmit(submit)}
      renderActions={() => (
        <>
          <JetButton disabled={loading}>Save</JetButton>
        </>
      )}
    >
      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="current_password">Current Password</JetLabel>
        <JetInput
          id="current_password"
          name="current_password"
          type="password"
          className="mt-1 block w-full"
          autoComplete="current-password"
          ref={register}
        />
        <JetInputError className="mt-2">
          {errors?.current_password?.message}
        </JetInputError>
      </div>

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="password">New Password</JetLabel>
        <JetInput
          id="password"
          name="password"
          type="password"
          className="mt-1 block w-full"
          autoComplete="new-password"
          ref={register}
        />
        <JetInputError className="mt-2">
          {errors?.password?.message}
        </JetInputError>
      </div>

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="password_confirmation">Confirm Password</JetLabel>
        <JetInput
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          className="mt-1 block w-full"
          autoComplete="new-password"
          ref={register}
        />
        <JetInputError className="mt-2">
          {errors?.password_confirmation?.message}
        </JetInputError>
      </div>
    </JetFormSection>
  );
}
