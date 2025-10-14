import { SettingsLayout } from '@/features/settings/components';

export default function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
