import moment from 'moment';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import http from '../../http';
import JetAppLayout from '../../jet/app-layout';
import JetButton from '../../jet/button';
import JetCheckbox from '../../jet/checkbox';
import JetDeleteApiTokenModal from '../../jet/delete-api-token-modal';
import JetEditApiTokenModal from '../../jet/edit-api-token-modal';
import JetFormActionSection from '../../jet/form-action-section';
import JetFormSection from '../../jet/form-section';
import JetInput from '../../jet/input';
import JetInputError from '../../jet/input-error';
import JetLabel from '../../jet/label';
import { handleFormErrors, useApiTokens, useModal } from '../../jet/providers';
import JetSectionBorder from '../../jet/section-border';
import JetShowApiTokenModal from '../../jet/show-api-token-modal';
import { Nullable, Token } from '../../types';

interface Form {
  name: string;
  permissions: string[];
}

export default function ApiTokens() {
  const { register, handleSubmit, errors, setError, reset } = useForm<Form>();
  const { data, revalidate } = useApiTokens();
  const [loading, setLoading] = useState(false);
  const [rawToken, setRawToken] = useState<Nullable<string>>(null);
  const [tokenToEdit, setTokenToEdit] = useState<Nullable<Token>>(null);
  const tokenModal = useModal();
  const permModal = useModal();
  const deleteModal = useModal();
  const { addToast } = useToasts();

  function onEditClick(token: Token) {
    setTokenToEdit(token);
    permModal.open();
  }

  function onDeleteClick(token: Token) {
    setTokenToEdit(token);
    deleteModal.open();
  }

  async function submit(values: Form) {
    setLoading(true);
    const { ok, data, errors: submitErrors } = await http('user/api-tokens', {
      method: 'post',
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    addToast('API Key Created', { appearance: 'success' });
    reset();
    setRawToken(data.token);
    tokenModal.open();
  }

  return (
    <JetAppLayout pageTitle={'API Tokens'}>
      <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <JetFormSection
          title={'Create API Token'}
          description={
            'API tokens allow third-party services to authenticate with our application on your behalf.'
          }
          renderActions={() => (
            <JetButton onClick={handleSubmit(submit)} disabled={loading}>
              Create
            </JetButton>
          )}
        >
          {/* <!-- Token Name --> */}
          <div className="col-span-6 sm:col-span-4">
            <JetLabel htmlFor="name">Name</JetLabel>
            <JetInput
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full"
              autoFocus
              ref={register}
            />
            <JetInputError className="mt-2">
              {errors?.name?.message}
            </JetInputError>
          </div>

          {/* <!-- Token Permissions --> */}
          {data && data.availablePermissions.length > 0 && (
            <div className="col-span-6">
              <JetLabel htmlFor="permissions">Permissions</JetLabel>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.availablePermissions.map(permission => (
                  <div key={permission}>
                    <label className="flex items-center">
                      <JetCheckbox
                        id={`new-permission-${permission}`}
                        name={'permissions[]'}
                        value={permission}
                        ref={register}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {permission}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </JetFormSection>

        {data && data.tokens.length > 0 && (
          <div>
            <JetSectionBorder />

            {/* <!-- Manage API Tokens --> */}
            <div className="mt-10 sm:mt-0">
              <JetFormActionSection
                title={'Manage API Tokens'}
                description={
                  'You may delete any of your existing tokens if they are no longer needed.'
                }
              >
                {/* <!-- API Token List --> */}
                <div className="space-y-6">
                  {data.tokens.map(token => (
                    <div
                      className="flex items-center justify-between"
                      key={token.id}
                    >
                      <div>{token.name}</div>

                      <div className="flex items-center">
                        {token.last_used_at && (
                          <div className="text-sm text-gray-400">
                            Last used {moment(token.last_used_at).fromNow()}
                          </div>
                        )}
                        {data.availablePermissions.length > 0 && (
                          <button
                            className="cursor-pointer ml-6 text-sm text-gray-400 underline"
                            onClick={() => onEditClick(token)}
                          >
                            Permissions
                          </button>
                        )}

                        <button
                          className="cursor-pointer ml-6 text-sm text-red-500"
                          onClick={() => onDeleteClick(token)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </JetFormActionSection>
            </div>
          </div>
        )}

        {/* <!-- Token Value Modal --> */}
        {rawToken && (
          <JetShowApiTokenModal
            {...tokenModal.props}
            rawToken={rawToken}
            onAnimationEnd={() => {
              if (!tokenModal.props.visible) {
                setRawToken(null);
              }
            }}
          />
        )}

        {tokenToEdit && (
          <>
            <JetEditApiTokenModal
              {...permModal.props}
              onAnimationEnd={() => {
                if (!permModal.props.visible) {
                  setTokenToEdit(null);
                }
              }}
              onSuccess={revalidate}
              tokenId={tokenToEdit.id}
              availablePermissions={data?.availablePermissions || []}
              initialPermissions={tokenToEdit.abilities}
            />
            <JetDeleteApiTokenModal
              {...deleteModal.props}
              tokenId={tokenToEdit.id}
              onAnimationEnd={() => {
                if (!deleteModal.props.visible) {
                  setTokenToEdit(null);
                }
              }}
              onSuccess={revalidate}
            />
          </>
        )}
      </div>
    </JetAppLayout>
  );
}
