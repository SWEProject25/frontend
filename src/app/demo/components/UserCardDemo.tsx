// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import UserCard from '@/components/ui/UserCard';
// import { Divider } from '@/components/ui/Divider';
// import { XLogo } from '@/components/ui/icons';

// export function UserCardDemo() {
//   const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
//     {}
//   );

//   const handleAction = (actionId: string, userName: string) => {
//     setLoadingStates((prev) => ({ ...prev, [actionId]: true }));
//     console.log(`Action: ${actionId} for ${userName}`);

//     // Simulate API call
//     setTimeout(() => {
//       setLoadingStates((prev) => ({ ...prev, [actionId]: false }));
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-black py-12">
//       <div className="container mx-auto px-4 max-w-3xl">
//         <div className="text-center mb-12">
//           <div className="flex justify-center mb-6">
//             <XLogo className="w-12 h-12" />
//           </div>
//           <h1 className="text-4xl font-bold text-white mb-4">
//             User Card Component
//           </h1>
//           <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//             A flexible user card component with customizable actions for
//             different use cases.
//           </p>
//         </div>

//         {/* Follow Actions */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-white mb-6">
//             Follow/Unfollow Actions
//           </h2>
//           <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
//             <UserCard
//               name="Bassem Youssef"
//               handle="@Byoussef"
//               verified={true}
//               action={{
//                 label: 'Follow',
//                 onClick: () => handleAction('follow-1', 'Bassem Youssef'),
//                 variant: 'secondary',
//                 loading: loadingStates['follow-1'],
//               }}
//             />
//             <UserCard
//               name="Ahmed Fathy"
//               handle="@ahmedfathy0-0"
//               verified={false}
//               action={{
//                 label: 'Unfollow',
//                 onClick: () => handleAction('unfollow-1', 'Ahmed Fathy'),
//                 variant: 'outline',
//                 loading: loadingStates['unfollow-1'],
//               }}
//             />
//           </div>
//         </div>

//         <Divider className="my-12" />

//         {/* Block Actions */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-white mb-6">
//             Block/Unblock Actions
//           </h2>
//           <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
//             <UserCard
//               name="Spam Account"
//               handle="@spammer123"
//               verified={false}
//               action={{
//                 label: 'Block',
//                 onClick: () => handleAction('block-1', 'Spam Account'),
//                 variant: 'outline',
//                 loading: loadingStates['block-1'],
//               }}
//             />
//             <UserCard
//               name="Previously Blocked"
//               handle="@oldblock"
//               verified={false}
//               action={{
//                 label: 'Unblock',
//                 onClick: () => handleAction('unblock-1', 'Previously Blocked'),
//                 variant: 'secondary',
//                 loading: loadingStates['unblock-1'],
//               }}
//             />
//           </div>
//         </div>

//         <Divider className="my-12" />

//         {/* Mute Actions */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-white mb-6">
//             Mute/Unmute Actions
//           </h2>
//           <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
//             <UserCard
//               name="Noisy User"
//               handle="@talkative"
//               verified={true}
//               action={{
//                 label: 'Mute',
//                 onClick: () => handleAction('mute-1', 'Noisy User'),
//                 variant: 'outline',
//                 loading: loadingStates['mute-1'],
//               }}
//             />
//             <UserCard
//               name="Previously Muted"
//               handle="@oldmute"
//               verified={false}
//               action={{
//                 label: 'Unmute',
//                 onClick: () => handleAction('unmute-1', 'Previously Muted'),
//                 variant: 'secondary',
//                 loading: loadingStates['unmute-1'],
//               }}
//             />
//           </div>
//         </div>

//         <Divider className="my-12" />

//         {/* Different Button Variants */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-white mb-6">
//             Button Variants
//           </h2>
//           <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
//             <UserCard
//               name="Primary Button"
//               handle="@primary"
//               verified={true}
//               action={{
//                 label: 'Follow',
//                 onClick: () => handleAction('primary-1', 'Primary Button'),
//                 variant: 'primary',
//                 loading: loadingStates['primary-1'],
//               }}
//             />
//             <UserCard
//               name="Secondary Button"
//               handle="@secondary"
//               verified={true}
//               action={{
//                 label: 'Following',
//                 onClick: () => handleAction('secondary-1', 'Secondary Button'),
//                 variant: 'secondary',
//                 loading: loadingStates['secondary-1'],
//               }}
//             />
//             <UserCard
//               name="Outline Button"
//               handle="@outline"
//               verified={false}
//               action={{
//                 label: 'Unfollow',
//                 onClick: () => handleAction('outline-1', 'Outline Button'),
//                 variant: 'outline',
//                 loading: loadingStates['outline-1'],
//               }}
//             />
//             <UserCard
//               name="Ghost Button"
//               handle="@ghost"
//               verified={false}
//               action={{
//                 label: 'Remove',
//                 onClick: () => handleAction('ghost-1', 'Ghost Button'),
//                 variant: 'ghost',
//                 loading: loadingStates['ghost-1'],
//               }}
//             />
//           </div>
//         </div>

//         <Divider className="my-12" />

//         {/* With Avatar Images (placeholder) */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-white mb-6">
//             With Avatar Images
//           </h2>
//           <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
//             <UserCard
//               name="User With Avatar"
//               handle="@withavatar"
//               verified={true}
//               avatarUrl="/profilePhoto.png"
//               action={{
//                 label: 'Follow',
//                 onClick: () => handleAction('avatar-1', 'User With Avatar'),
//                 variant: 'secondary',
//                 loading: loadingStates['avatar-1'],
//               }}
//             />
//             <UserCard
//               name="Another User"
//               handle="@anotherone"
//               verified={false}
//               avatarUrl="/profilePhoto.png"
//               action={{
//                 label: 'Following',
//                 onClick: () => handleAction('avatar-2', 'Another User'),
//                 variant: 'outline',
//                 loading: loadingStates['avatar-2'],
//               }}
//             />
//           </div>
//         </div>

//         {/* Usage Code Example */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-white mb-6">Usage Example</h2>
//           <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
//             <pre className="text-sm text-gray-300 overflow-x-auto">
//               <code>{`import UserCard from '@/components/ui/UserCard';

// <UserCard
//   name="Bassem Youssef"
//   handle="@Byoussef"
//   verified={true}
//   avatarUrl="/path/to/avatar.jpg"
//   action={{
//     label: 'Follow',
//     onClick: () => handleFollow(),
//     variant: 'secondary',
//     loading: isLoading,
//   }}
// />`}</code>
//             </pre>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="text-center">
//           <Link
//             href="/demo"
//             className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
//           >
//             ← Back to Demos
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
