export default function Sidebar({ advice }: { advice: any }) {
  const show = !!advice;

  return (
    <div className="absolute right-0 top-0 m-5 h-[95%] w-[400px] rounded-xl bg-white p-5">
      <div
        className={`${
          show ? "opacity-0" : "opacity-100"
        } transition-opactiy flex items-center text-center `}
      >
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-lg text-gray-800">
          Generating Personality Profile
        </span>
      </div>
      <div
        className={`${
          show ? "opacity-100" : "opacity-0"
        } transition-opacity duration-700 ease-in`}
      >
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Advice</h2>
        <span className="text-lg font-bold">General</span>
        <ul className="my-4">
          {advice?.description?.map((d: string, i: number) => (
            <li key={`description-${i}`} className="mb-2">
              {d}
            </li>
          ))}
          {advice?.key_traits &&
            Object.values(advice?.key_traits).map((d, i) => (
              <li key={`description-${i}`} className="mb-2">
                {d}
              </li>
            ))}
        </ul>

        <span className="text-lg font-bold">What to say</span>
        <ul className="my-4">
          {advice?.what_to_say?.map((d: string, i: number) => (
            <li key={`dos-${i}`} className="mb-2">
              {d}
            </li>
          ))}
        </ul>

        <span className="text-lg font-bold">What to avoid</span>
        <ul className="my-4">
          {advice?.what_to_avoid?.map((d: string, i: number) => (
            <li key={`donts-${i}`} className="mb-2">
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
