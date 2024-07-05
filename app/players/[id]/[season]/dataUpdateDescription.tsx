'use client';

import RatingHistogram from '@/app/_components/RatingHistogram';
import { PlayerDataBySeason } from '@/app/_lib/services/type';
import ResultCharts from '@/app/_components/ResultsCharts';
import { getRank } from '@/app/_lib/services/getRank';
import { getTop200 } from '@/app/_lib/services/getTop200';
import { Fragment, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';

export default function DataUpdateDescription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-6">
      <svg
        onClick={() => setIsModalOpen(true)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 hover:cursor-pointer"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clipRule="evenodd"
        />
      </svg>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="my-10 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle className="mb-4 text-2xl font-bold">
                    データ更新頻度について
                  </DialogTitle>
                  <p>
                    デイリースマメイトのデータは、スマメイトへ直接アクセスすることで収集されており、スマメイトサーバーへの負荷を最小限にするため、スマメイトへのアクセスは1分あたり数回に抑えられています。
                  </p>
                  <p className="mt-2">
                    全プレイヤーのデータを常に最新にすることは難しく、データの更新は「収集されていない対戦が多いプレイヤー」が優先されます。
                  </p>
                  <p className="mt-2">
                    そのため、デイリースマメイトのデータを最新にしたい場合は、ただ待つだけでは効果は薄く、スマメイトで対戦回数を増やすほうが更新されやすくなっています。
                  </p>
                  <p className="mt-2">
                    なお、レートと順位に関しては、キャラ投票がされているプレイヤーは1日に1回ほどで更新され、キャラ投票がされていないプレイヤーはほぼ更新されません。
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      閉じる
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
