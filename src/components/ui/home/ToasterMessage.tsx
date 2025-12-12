import Link from 'next/link';
import { toast, ToastPosition } from 'react-hot-toast';

export default function toasterMessage(
  message: string,
  position: ToastPosition = 'bottom-center',
  state: 'success' | 'error' = 'success',
  link = ''
) {
  return toast.custom(
    (t) => (
      <div
        data-testid={`toaster-message-${state}`}
        onMouseLeave={() => toast.dismiss(t.id)}
        className={`${
          t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
        }  max-w-max w-full p-2 px-4 ${state === 'success' ? 'bg-primary' : 'bg-error-message'} shadow-lg rounded-lg pointer-events-auto flex just ring-1 ring-offset-primary ring-opacity-5`}
      >
        <p className=" text-sm">
          {message}{' '}
          {link && (
            <Link
              href={link}
              className="text-white font-semibold text-lg hover:underline "
            >
              View
            </Link>
          )}
        </p>
      </div>
    ),
    { position: position, duration: 3000, removeDelay: 500 }
  );
}
