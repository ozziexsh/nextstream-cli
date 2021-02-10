import { useState } from 'react';
import http from '../http';
import JetAuthenticationCard from '../jet/authentication-card';
import JetButton from '../jet/button';
import JetGuestLayout from '../jet/guest-layout';
import JetInputError from '../jet/input-error';
import JetInput from '../jet/input';
import JetLabel from '../jet/label';
import { handleFormErrors, redirectIfAuthenticated } from '../jet/providers';
import { useForm } from 'react-hook-form';

interface Form {
  email: string;
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    reset,
  } = useForm<Form>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(values: Form) {
    setLoading(true);
    const { ok, errors: submitErrors } = await http('forgot-password', {
      method: 'post',
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!ok) {
      setSuccess(false);
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    clearErrors();
    reset();
    setSuccess(true);
  }

  return (
    <JetGuestLayout pageTitle={'Forgot Password'}>
      <JetAuthenticationCard>
        <div className="mb-4 text-sm text-gray-600">
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </div>

        {success && (
          <div className="mb-4 font-medium text-sm text-green-600">
            We have emailed your password reset link!
          </div>
        )}

        <form onSubmit={handleSubmit(submit)}>
          <div className="block">
            <JetLabel htmlFor="email">Email</JetLabel>
            <JetInput
              id="email"
              className="block mt-1 w-full"
              type="email"
              name="email"
              required
              autoFocus
              ref={register}
            />
            <JetInputError>{errors?.email?.message}</JetInputError>
          </div>

          <div className="flex items-center justify-end mt-4">
            <JetButton disabled={loading}>Email Password Reset Link</JetButton>
          </div>
        </form>
      </JetAuthenticationCard>
    </JetGuestLayout>
  );
}

export const getServerSideProps = redirectIfAuthenticated();
