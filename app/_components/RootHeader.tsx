import Link from 'next/link';

import * as React from 'react';
import { SVGProps } from 'react';

export function RootHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex h-10 w-full items-center justify-between bg-slate-900 text-slate-100">
        <Link
          href="/"
          className="ml-4 flex items-center justify-start gap-1 font-bold md:text-xl"
          style={{
            fontFamily: "'Arial', sans-serif",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' /* 文字の影 */,
          }}
        >
          <div className="mt-[-4px] h-5 md:h-6">
            <svg
              viewBox="0 0 480 480"
              height="full"
              width="full"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
            >
              <g>
                <rect
                  fill="#000000"
                  height="322"
                  id="svg_4"
                  rx="8"
                  ry="8"
                  stroke="#ffffff"
                  stroke-width="27"
                  width="100"
                  x="40"
                  y="136"
                />
                <rect
                  fill="#000000"
                  height="398"
                  id="svg_5"
                  rx="8"
                  ry="8"
                  stroke="#ffffff"
                  stroke-width="27"
                  transform="matrix(1 0 0 1 0 0)"
                  width="100"
                  x="192"
                  y="60"
                />
                <rect
                  fill="#000000"
                  height="236"
                  id="svg_6"
                  rx="8"
                  ry="8"
                  stroke="#ffffff"
                  stroke-width="27"
                  width="100"
                  x="342"
                  y="220"
                />
              </g>
            </svg>
          </div>
          デイリースマメイト
        </Link>

        <Link href="/players/search" className="bold mr-4 flex text-slate-300">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="flex-none  "
            aria-hidden="true"
          >
            <path d="m19 19-3.5-3.5"></path>
            <circle cx="11" cy="11" r="6"></circle>
          </svg>
          プレイヤー検索
        </Link>
      </div>
      <hr className="border-slate-300" />
    </header>
  );
}
