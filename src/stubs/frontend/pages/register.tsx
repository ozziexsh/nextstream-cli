import { useState } from 'react';
import JetAuthenticationCard from '../jet/authentication-card';
import JetButton from '../jet/button';
import JetCheckbox from '../jet/checkbox';
import JetGuestLayout from '../jet/guest-layout';
import JetInput from '../jet/input';
import JetLabel from '../jet/label';
import JetInputError from '../jet/input-error';
import http from '../http';
import { handleFormErrors, redirectIfAuthenticated } from '../jet/providers';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface Form {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
  } = useForm<Form>();
  const [loading, setLoading] = useState(false);

  async function submit(values: Form) {
    setLoading(true);
    const { ok, errors: submitErrors } = await http('register', {
      method: 'post',
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    clearErrors();
    window.location.href = '/';
  }

  return (
    <JetGuestLayout pageTitle={'Register'}>
      <JetAuthenticationCard>
        <form onSubmit={handleSubmit(submit)}>
          <div>
            <JetLabel htmlFor="name">Name</JetLabel>
            <JetInput
              id="name"
              className="block mt-1 w-full"
              type="text"
              name="name"
              required
              autoFocus
              autoComplete="name"
              ref={register}
            />
            <JetInputError>{errors?.name?.message}</JetInputError>
          </div>

          <div className="mt-4">
            <JetLabel htmlFor="email">Email</JetLabel>
            <JetInput
              id="email"
              className="block mt-1 w-full"
              type="email"
              name="email"
              required
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
              autoComplete="new-password"
              ref={register}
            />
            <JetInputError>{errors?.password?.message}</JetInputError>
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
            <JetInputError>
              {errors?.password_confirmation?.message}
            </JetInputError>
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link href="/login">
              <a className="underline text-sm text-gray-600 hover:text-gray-900">
                Already registered?
              </a>
            </Link>

            <JetButton className="ml-4" disabled={loading}>
              Register
            </JetButton>
          </div>
        </form>
      </JetAuthenticationCard>
    </JetGuestLayout>
  );
}

export const getServerSideProps = redirectIfAuthenticated();
