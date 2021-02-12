import { useRef, useState } from 'react';
import http from '../http';
import JetButton from './button';
import JetFormSection from './form-section';
import JetInputError from './input-error';
import JetInput from './input';
import JetLabel from './label';
import {
  handleFormErrors,
  useFeatures,
  useRefreshUser,
  useUser,
} from './providers';
import { Nullable } from '../types';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';

interface Form {
  name: string;
  email: string;
  photo: Nullable<File>;
}

export default function JetUpdateProfileInformationForm() {
  const { hasProfilePhotoFeatures } = useFeatures();
  const user = useUser();
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      photo: null,
    },
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refreshUser = useRefreshUser();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);

  async function submit(values: Form) {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    if (values.photo) {
      formData.append('photo', values.photo, values.photo.name);
    }
    setLoading(true);
    const { ok, errors: submitErrors } = await http(
      'user/profile-information',
      {
        method: 'post',
        body: formData,
        headers: {},
      },
    );
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    addToast('Profile updated', { appearance: 'success' });
    clearErrors();
    await refreshUser?.();
  }

  function onFileChange(e: React.FormEvent<HTMLInputElement>) {
    if (!e.currentTarget.files || e.currentTarget.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(e.currentTarget.files[0]);
    setValue('photo', e.currentTarget.files[0]);
  }

  async function removePhoto() {
    setLoading(true);
    await http('user/profile-photo', {
      method: 'delete',
    });
    setLoading(false);
    addToast('Profile updated', { appearance: 'success' });
    setPhotoPreview('');
    await refreshUser?.();
  }

  if (!user) {
    return null;
  }

  return (
    <JetFormSection
      title={'Profile Information'}
      description={
        "Update your account's profile information and email address."
      }
      onSubmit={handleSubmit(submit)}
      renderActions={() => (
        <>
          <JetButton disabled={loading}>Save</JetButton>
        </>
      )}
    >
      {hasProfilePhotoFeatures && (
        <div
          x-data="{photoName: null, photoPreview: null}"
          className="col-span-6 sm:col-span-4"
        >
          {/* Profile Photo File Input */}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept={'image/*'}
            onChange={onFileChange}
          />

          <JetLabel htmlFor="photo">Photo</JetLabel>

          {/* Current Profile Photo */}
          {!photoPreview && user.profile_photo_url && (
            <div className="mt-2">
              <img
                src={user.profile_photo_url}
                alt={user.name}
                className="rounded-full h-20 w-20 object-cover"
              />
            </div>
          )}

          {/* New Profile Photo Preview */}
          {photoPreview && (
            <div className="mt-2">
              <span
                className="block rounded-full w-20 h-20"
                style={{
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundImage: `url(${photoPreview})`,
                }}
              />
            </div>
          )}

          <JetButton
            status={'secondary'}
            className="mt-2 mr-2"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Select A New Photo
          </JetButton>

          {user.profile_photo_path && (
            <JetButton
              status={'secondary'}
              type="button"
              className="mt-2"
              onClick={removePhoto}
              disabled={loading}
            >
              Remove Photo
            </JetButton>
          )}

          <JetInputError className="mt-2">
            {errors?.photo?.message}
          </JetInputError>
        </div>
      )}

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="name">Name</JetLabel>
        <JetInput
          id="name"
          name="name"
          type="text"
          className="mt-1 block w-full"
          autoComplete="name"
          ref={register}
        />
        <JetInputError className="mt-2">{errors?.name?.message}</JetInputError>
      </div>

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="email">Email</JetLabel>
        <JetInput
          id="email"
          name="email"
          type="email"
          className="mt-1 block w-full"
          ref={register}
        />
        <JetInputError className="mt-2">{errors?.email?.message}</JetInputError>
      </div>
    </JetFormSection>
  );
}
