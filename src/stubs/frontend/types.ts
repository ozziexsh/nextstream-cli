export type Nullable<T> = T | null;

export type ApiDate = string;

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: Nullable<ApiDate>;
  profile_photo_path: Nullable<string>;
  profile_photo_url: Nullable<string>;
  created_at: ApiDate;
  updated_at: ApiDate;
  two_factor_secret: Nullable<string>;
}

export interface Features {
  hasProfilePhotoFeatures: boolean;
  hasApiFeatures: boolean;
  hasAccountDeletionFeatures: boolean;
  canUpdateProfileInformation: boolean;
  updatePasswords: boolean;
  canManageTwoFactorAuthentication: boolean;
}

export interface Token {
  id: number;
  tokenable_type: string;
  tokenable_id: number;
  name: string;
  abilities: string[];
  last_used_at: ApiDate;
  created_at: ApiDate;
  updated_at: ApiDate;
}
