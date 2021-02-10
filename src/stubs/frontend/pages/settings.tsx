import JetAppLayout from '../jet/app-layout';
import JetDeleteUserForm from '../jet/delete-user-form';
import { redirectIfGuest, useFeatures } from '../jet/providers';
import JetSectionBorder from '../jet/section-border';
import JetTwoFactorAuthenticationForm from '../jet/two-factor-authentication-form';
import JetUpdatePasswordForm from '../jet/update-password-form';
import JetUpdateProfileInformationForm from '../jet/update-profile-information-form';

export default function Settings() {
  const {
    canUpdateProfileInformation,
    updatePasswords,
    canManageTwoFactorAuthentication,
    hasAccountDeletionFeatures,
  } = useFeatures();

  return (
    <JetAppLayout pageTitle={'User Settings'} header={'Profile Settings'}>
      <div>
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          {canUpdateProfileInformation && (
            <>
              <JetUpdateProfileInformationForm />
              <JetSectionBorder />
            </>
          )}
          {updatePasswords && (
            <>
              <div className="mt-10 sm:mt-0">
                <JetUpdatePasswordForm />
              </div>
              <JetSectionBorder />
            </>
          )}
          {canManageTwoFactorAuthentication && (
            <>
              <div className="mt-10 sm:mt-0">
                <JetTwoFactorAuthenticationForm />
              </div>
              <JetSectionBorder />
            </>
          )}
          {/* <div className="mt-10 sm:mt-0">
            @livewire('profile.logout-other-browser-sessions-form')
          </div> */}
          {hasAccountDeletionFeatures && (
            <>
              {/* <SectionBorder /> */}
              <div className="mt-10 sm:mt-0">
                <JetDeleteUserForm />
              </div>
            </>
          )}
        </div>
      </div>
    </JetAppLayout>
  );
}

export const getServerSideProps = redirectIfGuest();
