export default function PushNotificationsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-text-active">
        Push notifications
      </h2>
      <p className="text-text-inactive">
        Push notifications are not available in this version. The notification
        system uses REST API polling and optional Firestore real-time
        subscriptions.
      </p>
    </div>
  );
}
