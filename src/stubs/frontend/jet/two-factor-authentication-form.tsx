import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import http from '../http';
import JetButton from './button';
import JetFormActionSection from './form-action-section';
import {
  useConfirmPassword,
  useTwoFactorRecoveryCodes,
  useUser,
} from './providers';

export default function JetTwoFactorAuthenticationForm() {
  const user = useUser();
  const [enabled, setEnabled] = useState(!!user?.two_factor_secret);
  const [qrSvg, setQrSvg] = useState('');
  const [showingRecovery, setShowingRecovery] = useState(false);
  const {
    data: recoveryCodes,
    revalidate: getRecoveryCodes,
  } = useTwoFactorRecoveryCodes();
  const {
    withPasswordConfirmation,
    ConfirmPasswordModal,
    loading: loadingConfirmPassword,
  } = useConfirmPassword();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);

  async function getQrCode() {
    const { ok, data } = await http('user/two-factor-qr-code');
    if (!ok) {
      return void addToast('Failed to fetch QR Code', { appearance: 'error' });
    }
    setQrSvg(data.svg);
  }

  async function regenerateRecoveryCodes() {
    setLoading(true);
    const { ok } = await http('user/two-factor-recovery-codes', {
      method: 'post',
    });
    setLoading(false);
    if (!ok) {
      return void addToast('Failed to regenerate recovery codes', {
        appearance: 'error',
      });
    }
    getRecoveryCodes();
  }

  async function enableTwoFactor() {
    setLoading(true);
    const { ok } = await http('user/two-factor-authentication', {
      method: 'post',
    });
    setLoading(false);
    if (!ok) {
      return void addToast('Failed to enable two factor authentication', {
        appearance: 'error',
      });
    }
    await Promise.all([getQrCode(), getRecoveryCodes()]);
    setShowingRecovery(true);
    setEnabled(true);
  }

  async function disableTwoFactor() {
    setLoading(true);
    const { ok } = await http('user/two-factor-authentication', {
      method: 'delete',
    });
    setLoading(false);
    if (!ok) {
      return void addToast('Failed to disable two factor authentication', {
        appearance: 'error',
      });
    }
    setEnabled(false);
    setShowingRecovery(false);
    setQrSvg('');
    // todo update user cookie?
  }

  const isLoading = loading || loadingConfirmPassword;

  return (
    <JetFormActionSection
      title={'Two Factor Authentication'}
      description={
        'Add additional security to your account using two factor authentication.'
      }
    >
      <h3 className="text-lg font-medium text-gray-900">
        {enabled
          ? 'You have enabled two factor authentication.'
          : 'You have not enabled two factor authentication.'}
      </h3>

      <div className="mt-3 max-w-xl text-sm text-gray-600">
        <p>
          When two factor authentication is enabled, you will be prompted for a
          secure, random token during authentication. You may retrieve this
          token from your phone's Google Authenticator application.
        </p>
      </div>

      {enabled && (
        <>
          {qrSvg && (
            <>
              <div className="mt-4 max-w-xl text-sm text-gray-600">
                <p className="font-semibold">
                  Two factor authentication is now enabled. Scan the following
                  QR code using your phone's authenticator application.
                </p>
              </div>

              <div
                className="mt-4 dark:p-4 dark:w-56 dark:bg-white"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              ></div>
            </>
          )}

          {showingRecovery && (
            <>
              <div className="mt-4 max-w-xl text-sm text-gray-600">
                <p className="font-semibold">
                  Store these recovery codes in a secure password manager. They
                  can be used to recover access to your account if your two
                  factor authentication device is lost.
                </p>
              </div>

              <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 rounded-lg">
                {recoveryCodes?.map(code => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div className="mt-5">
        {!enabled ? (
          <JetButton
            onClick={withPasswordConfirmation(enableTwoFactor)}
            disabled={isLoading}
          >
            Enable
          </JetButton>
        ) : (
          <>
            {showingRecovery ? (
              <JetButton
                status={'secondary'}
                className="mr-3"
                onClick={withPasswordConfirmation(regenerateRecoveryCodes)}
                disabled={isLoading}
              >
                Regenerate Recovery Codes
              </JetButton>
            ) : (
              <JetButton
                status={'secondary'}
                className="mr-3"
                disabled={isLoading}
                onClick={withPasswordConfirmation(() =>
                  setShowingRecovery(true),
                )}
              >
                Show Recovery Codes
              </JetButton>
            )}

            <JetButton
              status={'danger'}
              onClick={withPasswordConfirmation(disableTwoFactor)}
              disabled={isLoading}
            >
              Disable
            </JetButton>
          </>
        )}
      </div>
      <ConfirmPasswordModal />
    </JetFormActionSection>
  );
}
