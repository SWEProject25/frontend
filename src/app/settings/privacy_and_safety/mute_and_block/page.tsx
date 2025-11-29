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
    <div
      className="border-r border-border min-h-screen"
      data-testid="mute-and-block-page"
    >
      <Breadcrumb
        title="Mute and block"
        description={description}
        onBack={handleBack}
        showArrow={true}
        data-testid="mute-and-block-breadcrumb"
      />
      <nav className="flex flex-col" data-testid="mute-and-block-nav">
        {block_mute_Items.map((item) => (
          <ListItem
            key={item.id}
            href={item.path}
            data-testid={`mute-and-block-item-${item.id}`}
          >
            <OptionItem
              label={item.label}
              showArrow={true}
              data-testid={`mute-and-block-option-${item.id}`}
            />
          </ListItem>
        ))}
      </nav>
    </div>
  );
}
