import { useRouter } from 'next/router';
import { useState } from 'react';
import JetAuthenticationCard from '../jet/authentication-card';
import JetButton from '../jet/button';
import JetCheckbox from '../jet/checkbox';
import JetGuestLayout from '../jet/guest-layout';
import JetInput from '../jet/input';
import JetLabel from '../jet/label';
import http from '../http';
import JetInputError from '../jet/input-error';
import { handleFormErrors, redirectIfAuthenticated } from '../jet/providers';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface Form {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
  } = useForm<Form>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(values: Form) {
    setLoading(true);
    const { ok, data, errors: submitErrors } = await http('login', {
      method: 'post',
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    if (data.two_factor === true) {
      router.push('/two-factor-challenge');
    }
    clearErrors();
    window.location.href = '/';
  }

  return (
    <JetGuestLayout pageTitle={'Login'}>
      <JetAuthenticationCard>
        <form onSubmit={handleSubmit(submit)}>
          <div>
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

          <div className="mt-4">
            <JetLabel htmlFor="password">Password</JetLabel>
            <JetInput
              id="password"
              className="block mt-1 w-full"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              ref={register}
            />
            <JetInputError>{errors?.password?.message}</JetInputError>
          </div>

          <div className="block mt-4">
            <label htmlFor="remember" className="flex items-center">
              <JetCheckbox id="remember" name="remember" ref={register} />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link href="/forgot-password">
              <a className="underline text-sm text-gray-600 hover:text-gray-900">
                Forgot your password?
              </a>
            </Link>
            <JetButton className="ml-4" disabled={loading}>
              Login
            </JetButton>
          </div>
        </form>
      </JetAuthenticationCard>
    </JetGuestLayout>
  );
}

export const getServerSideProps = redirectIfAuthenticated();
