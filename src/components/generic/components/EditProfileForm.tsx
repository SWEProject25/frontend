import React from 'react';
import { InputField } from '@/components/ui/input/InputField';
import DatePicker, { DatePickerValue } from '@/components/ui/DatePicker';

interface EditProfileFormProps {
  name: string;
  setName: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  birth: DatePickerValue | undefined;
  setBirth: (v: DatePickerValue | undefined) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  name,
  setName,
  bio,
  setBio,
  location,
  setLocation,
  website,
  setWebsite,
  birth,
  setBirth,
}) => (
  <div className="mt-20 space-y-6 mx-2">
    <InputField
      label="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      maxLength={50}
      showCharCount
    />
    <InputField
      label="Bio"
      type="textarea"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      maxLength={160}
      showCharCount
    />
    <InputField
      label="Location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      maxLength={30}
      showCharCount
    />
    <InputField
      label="Website"
      value={website}
      onChange={(e) => setWebsite(e.target.value)}
      maxLength={100}
      showCharCount
    />
    <div className="w-full">
      <label className="text-sm text-text-active  font-bold block mb-2 ml-2">
        Date of birth
      </label>
      <DatePicker
        value={birth}
        onChange={setBirth}
        idPrefix="edit-birth"
        fullWidth={true}
      />
    </div>
  </div>
);

export default EditProfileForm;
