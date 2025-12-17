export interface SettingsOption {
  id: string;
  label: string;
  value: boolean | string;
}

export interface AccountSettings {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface NotificationSettings {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface PrivacySettings {
  privateAccount?: boolean;
  allowTagging?: boolean;
  allowMessagesFrom?: string;
}

export interface SecuritySettings {
  twoFactorAuth?: boolean;
  loginVerification?: boolean;
  connectedDevices?: string[];
}
