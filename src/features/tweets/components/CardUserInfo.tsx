import Link from 'next/link';
import { VerifiedIcon } from '@/components/ui/icons/BrandIcons';

type Direction = 'horizontal' | 'vertical';

type User = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  avatar: string | null;
};
export default function CardUserInfo({
  data,
  direction = 'horizontal',
}: {
  data: User;
  direction?: Direction;
}) {
  const containerClass =
    direction === 'horizontal'
      ? 'flex items-center gap-1'
      : 'flex flex-col items-start';

  const nameRowClass = 'font-bold hover:underline';

  const usernameClass = 'text-gray-400 text-sm relative';

  // const profileCardClass =
  //   'absolute left-1/2 transform -translate-x-1/2 top-full z-50 cursor-default';

  return (
    <div className={containerClass}>
      <div className="relative">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span className={nameRowClass}>
            <span className="flex items-center gap-0.5">
              {data.name}
              {data.verified && (
                <VerifiedIcon className="w-4.5 h-4.5 text-blue-400" />
              )}
            </span>
          </span>
        </Link>
      </div>
      <div className="relative">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span className={usernameClass}>{data.username}</span>
        </Link>
      </div>
    </div>
  );
}
