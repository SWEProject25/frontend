export default function Loader() {
  return (
    <div className="flex items-center gap-2" data-testid="loader">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
