'use client';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import OptionItem from '@/components/ui/OptionItem';
import {
  block_mute_Items,
  description,
} from '@/features/settings/constants/MUTE_and_BLOCK';

export default function MuteAndBlockPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/settings/privacy_and_safety');
  };

  return (
    <div className="border-r border-border min-h-screen">
      <Breadcrumb
        title="Mute and block"
        description={description}
        onBack={handleBack}
        showArrow={true}
      />
      <nav className="flex flex-col">
        {block_mute_Items.map((item) => (
          <ListItem key={item.id} href={item.path}>
            <OptionItem label={item.label} showArrow={true} />
          </ListItem>
        ))}
      </nav>
    </div>
  );
}
