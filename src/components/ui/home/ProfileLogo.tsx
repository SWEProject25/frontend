import Image from 'next/image';
import Link from 'next/link';
export default function ProfileLogo() {
  return (
    <div className="flex-none w-fit mr-2 pt-3  ">
      <Link href={'./profile'}>
        <Image
          src="/profilePhoto.png"
          role="button"
          width={500}
          height={500}
          className="w-10 h-10 rounded-full hover:cursor-pointer transition-filter duration-500 ease-out delay-75 hover:brightness-75 "
          alt="user profile"
        />
      </Link>
    </div>
  );
}
