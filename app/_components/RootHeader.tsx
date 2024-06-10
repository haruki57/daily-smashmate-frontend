import Link from 'next/link';

import * as React from 'react';
import { SVGProps } from 'react';

export function RootHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex h-10 w-full items-center justify-between bg-slate-900 text-slate-100">
        <Link
          href="/"
          className="ml-2 flex text-xl font-bold"
          style={{
            fontFamily: "'Arial', sans-serif",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' /* 文字の影 */,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            className="mr-1"
            height="24px"
            width="24px"
            version="1.1"
            viewBox="0 0 490.4 490.4"
          >
            <g>
              <g>
                <g>
                  <path d="M17.2,251.55c-9.5,0-17.2,7.7-17.2,17.1v179.7c0,9.5,7.7,17.2,17.2,17.2h113c9.5,0,17.1-7.7,17.1-17.2v-179.7     c0-9.5-7.7-17.1-17.1-17.1L17.2,251.55L17.2,251.55z M113,431.25H34.3v-145.4H113V431.25z" />
                  <path d="M490.4,448.45v-283.7c0-9.5-7.7-17.2-17.2-17.2h-113c-9.5,0-17.2,7.7-17.2,17.2v283.6c0,9.5,7.7,17.2,17.2,17.2h113     C482.7,465.55,490.4,457.85,490.4,448.45z M456.1,431.25h-78.7v-249.3h78.7L456.1,431.25L456.1,431.25z" />
                  <path d="M301.7,465.55c9.5,0,17.1-7.7,17.1-17.2V42.05c0-9.5-7.7-17.2-17.1-17.2h-113c-9.5,0-17.2,7.7-17.2,17.2v406.3     c0,9.5,7.7,17.2,17.2,17.2H301.7z M205.9,59.25h78.7v372h-78.7L205.9,59.25L205.9,59.25z" />
                </g>
              </g>
            </g>
          </svg>
          デイリースマメイト
        </Link>

        <Link href="/players/search" className="bold mr-2 flex text-slate-300">
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
