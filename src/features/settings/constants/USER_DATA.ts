import { UserResponse } from '@/features/authentication/types/api';

export const getAccountInfoItems = (user: UserResponse | null) => [
  {
    id: 'profile-info',
    label: 'Profile information',
    value: 'Name, bio, location, and more',
    path: '/settings/account/accountinfo/profileinfo',
  },
  {
    id: 'username',
    label: 'Username',
    value: user?.username,
    path: '/settings/account/accountinfo/username',
  },
  // {
  //   id: 'phone',
  //   label: 'Phone',
  //   value: userData.phone,
  //   path: '/settings/account/accountinfo/phone',
  // },
  {
    id: 'email',
    label: 'Email',
    value: user?.email,
    path: '/settings/account/accountinfo/email',
  },
  // {
  //   id: 'account-creation',
  //   label: 'Account creation',
  //   value: userData.accountCreation,
  //   path: '/settings/account/accountinfo/creation',
  // },
  // {
  //   id: 'country',
  //   label: 'Country',
  //   value: userData.country,
  //   path: '/settings/account/accountinfo/country',
  // },
  // {
  //   id: 'languages',
  //   label: 'Languages',
  //   value: userData.languages,
  //   path: '/settings/account/accountinfo/languages',
  // },
  // {
  //   id: 'gender',
  //   label: 'Gender',
  //   value: userData.gender,
  //   path: '/settings/account/accountinfo/gender',
  // },
  // {
  //   id: 'birth-date',
  //   label: 'Birth date',
  //   value: userData.birthDate,
  //   path: '/settings/account/accountinfo/birth-date',
  // },
  // {
  //   id: 'age',
  //   label: 'Age',
  //   value: userData.age,
  //   path: '/settings/account/accountinfo/age',
  // },
];
