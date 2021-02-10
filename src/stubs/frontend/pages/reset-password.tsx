import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import http from '../http';
import JetAuthenticationCard from '../jet/authentication-card';
import JetButton from '../jet/button';
import JetGuestLayout from '../jet/guest-layout';
import JetInputError from '../jet/input-error';
import JetInput from '../jet/input';
import JetLabel from '../jet/label';
import { handleFormErrors, redirectIfAuthenticated } from '../jet/providers';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';

interface Form {
  email: string;
  password: string;
  password_confirmation: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { register, handleSubmit, errors, setError } = useForm<Form>({
    defaultValues: {
      email: router.query?.email
        ? decodeURIComponent(router.query?.email as string)
        : '',
    },
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();

  async function logUserIn({ email, password }: Form) {
    setLoading(true);
    const { ok } = await http('login', {
      method: 'post',
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!ok) {
      addToast('Password reset but failed to log you in', {
        appearance: 'error',
      });
      return void (window.location.href = '/login');
    }
    window.location.href = '/';
  }

  async function submit(values: Form) {
    setLoading(true);
    const { ok, errors: submitErrors } = await http('reset-password', {
      method: 'post',
      body: JSON.stringify({ ...values, token: router.query?.token }),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    await logUserIn(values);
  }

  useEffect(() => {
    if (!router.query?.token) {
      router.push('/login');
    }
  }, [router?.query?.token]);

  return (
    <JetGuestLayout pageTitle={'Reset Password'}>
      <JetAuthenticationCard>
        <div className="mb-4 text-sm text-gray-600">
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </div>

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
            <JetInputError>{errors.email}</JetInputError>
          </div>

          <div className="mt-4">
            <JetLabel htmlFor="password">Password</JetLabel>
            <JetInput
              id="password"
              className="block mt-1 w-full"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              ref={register}
            />
            <JetInputError>{errors.password}</JetInputError>
          </div>

          <div className="mt-4">
            <JetLabel htmlFor="password_confirmation">
              Confirm Password
            </JetLabel>
            <JetInput
              id="password_confirmation"
              className="block mt-1 w-full"
              type="password"
              name="password_confirmation"
              required
              autoComplete="new-password"
              ref={register}
            />
            <JetInputError>{errors.password_confirmation}</JetInputError>
          </div>

          <div className="flex items-center justify-end mt-4">
            <JetButton disabled={loading}>Reset Password</JetButton>
          </div>
        </form>
      </JetAuthenticationCard>
    </JetGuestLayout>
  );
}

export const getServerSideProps = redirectIfAuthenticated();
