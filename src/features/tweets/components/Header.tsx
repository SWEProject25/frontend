import React from 'react';
import Image from 'next/image';

export default function Header({ image }: { image?: string }) {
  return (
    <div>
      <Image
        width={48}
        height={48}
        src={image || '/default-avatar.png'}
        alt="User avatar"
        className="w-12 h-12 rounded-full"
      />
    </div>
  );
}
// }
//       {/* Name and Username beside avatar */}
//       <div className="flex">
//         <Link href="/profile" className="font-bold flex items-center gap-1">
//           <span className="hover:underline">{data.user.name}</span>
//           {data.user.isVerified && (
//             <FaCheckCircle className="inline text-blue-500" size={16} />
//           )}
//           <span className="text-gray-400 text-sm">{data.user.username}</span>
//         </Link>
//       </div>
//     </div>
//   );
// }
