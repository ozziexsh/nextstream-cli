import { useEffect, useRef, useState } from 'react';
import JetAuthenticationCard from '../jet/authentication-card';
import JetButton from '../jet/button';
import JetGuestLayout from '../jet/guest-layout';
import JetInput from '../jet/input';
import JetLabel from '../jet/label';
import http from '../http';
import JetInputError from '../jet/input-error';
import { useForm } from 'react-hook-form';
import { handleFormErrors, redirectIfAuthenticated } from '../jet/providers';

enum Mode {
  Code,
  RecoveryCodes,
}

interface Form {
  code: string;
  recovery_code: string;
}

export default function TwoFactorChallenge() {
  const { register, handleSubmit, errors, setError, reset } = useForm<Form>();
  const [mode, setMode] = useState(Mode.Code);
  const codeRef = useRef<HTMLInputElement | null>(null);
  const recoveryRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit({ code, recovery_code }: Form) {
    setLoading(true);
    const { ok, errors: submitErrors } = await http('two-factor-challenge', {
      method: 'post',
      body: JSON.stringify(mode === Mode.Code ? { code } : { recovery_code }),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    window.location.href = '/';
  }

  function switchToRecovery() {
    setMode(Mode.RecoveryCodes);
  }

  function switchToCode() {
    setMode(Mode.Code);
  }

  useEffect(() => {
    reset();
    if (mode === Mode.Code) {
      codeRef?.current?.focus();
    } else {
      recoveryRef?.current?.focus();
    }
  }, [mode]);

  return (
    <JetGuestLayout pageTitle={'Login'}>
      <JetAuthenticationCard>
        <div>
          {mode === Mode.Code ? (
            <div className="mb-4 text-sm text-gray-600">
              Please confirm access to your account by entering the
              authentication code provided by your authenticator application.
            </div>
          ) : (
            <div className="mb-4 text-sm text-gray-600">
              Please confirm access to your account by entering one of your
              emergency recovery codes.
            </div>
          )}

          <form onSubmit={handleSubmit(submit)}>
            {mode === Mode.Code ? (
              <div className="mt-4">
                <JetLabel htmlFor="code">Code</JetLabel>
                <JetInput
                  id="code"
                  className="block mt-1 w-full"
                  type="text"
                  inputMode="numeric"
                  name="code"
                  autoFocus
                  autoComplete="one-time-code"
                  ref={ref => {
                    register(ref);
                    codeRef.current = ref;
                  }}
                />
                <JetInputError>{errors?.code?.message}</JetInputError>
              </div>
            ) : (
              <div className="mt-4" x-show="recovery">
                <JetLabel htmlFor="recovery_code">Recovery Code</JetLabel>
                <JetInput
                  id="recovery_code"
                  className="block mt-1 w-full"
                  type="text"
                  name="recovery_code"
                  autoComplete="one-time-code"
                  ref={ref => {
                    register(ref);
                    recoveryRef.current = ref;
                  }}
                />
                <JetInputError>{errors?.recovery_code?.message}</JetInputError>
              </div>
            )}

            <div className="flex items-center justify-end mt-4">
              {mode === Mode.Code ? (
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"
                  onClick={switchToRecovery}
                  disabled={loading}
                >
                  Use a recovery code
                </button>
              ) : (
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"
                  onClick={switchToCode}
                  disabled={loading}
                >
                  Use an authentication code
                </button>
              )}

              <JetButton className="ml-4" disabled={loading}>
                Login
              </JetButton>
            </div>
          </form>
        </div>
      </JetAuthenticationCard>
    </JetGuestLayout>
  );
}

export const getServerSideProps = redirectIfAuthenticated();
