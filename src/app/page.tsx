import { WelcomePage, AuthFooter } from '@/features/authentication/components';

export default function Home() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <WelcomePage />
      </main>
      <AuthFooter />
    </div>
  );
}
