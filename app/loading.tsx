export default async function RootLoading() {
  return (
    <div className="mt-32 flex justify-center" aria-label="読み込み中">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}
