// Temporary user data until backend integration
export const userData = {
  name: 'Ahmed Fathy',
  username: 'ahmedfathy0_0',
  bio: 'Just a guy who loves coding and coffee ☕️. Always eager to learn new things and take on challenges! 🚀',
  coverImage:
    'https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXJ8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
  avatarImage: 'https://avatars.githubusercontent.com/u/583231?v=4',
  profession: 'Software Engineer',
  location: 'Cairo, Egypt',
  website: 'https://ahmedfathy.dev',
  birthdate: 'April 19, 2004',
  joinDate: 'January 2020',
  followingCount: 150,
  followersCount: 1200,
  isVerified: true,
  // Additional account info
  phone: '+201552851443',
  email: 'ahmedfathi20044002@gmail.com',
  accountCreation: 'Apr 12, 2021, 9:20:23 PM',
  accountCreationIP: '156.193.143.48 (Egypt)',
  country: 'Egypt',
  languages: 'English, Arabic, No linguistic content',
  gender: 'Male',
  birthDate: 'Apr 19, 2004',
  age: '21',
};

export const accountInfoItems = [
  {
    id: 'username',
    label: 'Username',
    value: userData.username,
    path: '/settings/account/accountinfo/username',
  },
  {
    id: 'phone',
    label: 'Phone',
    value: userData.phone,
    path: '/settings/account/accountinfo/phone',
  },
  {
    id: 'email',
    label: 'Email',
    value: userData.email,
    path: '/settings/account/accountinfo/email',
  },
  {
    id: 'account-creation',
    label: 'Account creation',
    value: userData.accountCreation,
    path: '/settings/account/accountinfo/creation',
  },
  {
    id: 'country',
    label: 'Country',
    value: userData.country,
    path: '/settings/account/accountinfo/country',
  },
  {
    id: 'languages',
    label: 'Languages',
    value: userData.languages,
    path: '/settings/account/accountinfo/languages',
  },
  {
    id: 'gender',
    label: 'Gender',
    value: userData.gender,
    path: '/settings/account/accountinfo/gender',
  },
  {
    id: 'birth-date',
    label: 'Birth date',
    value: userData.birthDate,
    path: '/settings/account/accountinfo/birth-date',
  },
  {
    id: 'age',
    label: 'Age',
    value: userData.age,
    path: '/settings/account/accountinfo/age',
  },
];
