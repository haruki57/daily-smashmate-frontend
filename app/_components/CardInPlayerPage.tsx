export default function CardInPlayerPage() {
  return (
    <div className="w-full rounded-lg border-2 bg-gray-50  p-4 shadow-xl ">
      <h4 className="flex justify-center text-lg font-semibold ">
        ファイター順位
      </h4>
      <div className="mt-1 flex items-end justify-center text-4xl font-bold">
        <div>1234</div>
        <div className="mb-1 ml-2 text-sm">th</div>
      </div>
      <div className="mt-1 flex justify-center text-sm text-slate-500">
        243556人中
      </div>
    </div>
  );
}
