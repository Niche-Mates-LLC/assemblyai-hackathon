export default function Sidebar({
  personality,
  advice,
}: {
  personality: any;
  advice: any;
}) {
  return (
    <div className="absolute right-0 top-0 m-5 h-[95%] w-[400px] rounded-xl bg-white p-5">
      <h2 className="text-2xl font-bold text-gray-800">Personality</h2>
      <ul className="text-md my-5">
        <li className="flex">
          <span className="font-bold">Color</span>
          <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
          <span>{personality.color}</span>
        </li>
        <li className="flex">
          <span className="font-bold">Archetype</span>
          <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
          <span>{personality.archetype}</span>
        </li>
        <li className="flex">
          <span className="font-bold">Group</span>
          <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
          <span>{personality.group}</span>
        </li>
        <li className="flex">
          <span className="font-bold">Description</span>
          <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
          <span>
            {personality.description.join(
              ", "
            )}
          </span>
        </li>
        <li className="flex">
          <span className="font-bold">Label</span>
          <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
          <span>
            {personality.label.join(", ")}
          </span>
        </li>
        <li className="flex">
          <span className="font-bold">Character</span>
          <div className="mx-2 mb-2 flex-grow border-b border-dotted border-gray-300"></div>
          <span>{advice.adjectives.join(", ")}</span>
        </li>
      </ul>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Advice</h2>
      <span className="text-lg font-bold">General</span>
      <ul className="my-4">
        {advice.description.map((d, i) => (
          <li key={`description-${i}`} className="mb-2">
            {d}
          </li>
        ))}
        {Object.values(advice.key_traits).map((d, i) => (
          <li key={`description-${i}`} className="mb-2">
            {d}
          </li>
        ))}
      </ul>

      <span className="text-lg font-bold">What to say</span>
      <ul className="my-4">
        {advice.what_to_say.map((d, i) => (
          <li key={`dos-${i}`} className="mb-2">
            {d}
          </li>
        ))}
      </ul>

      <span className="text-lg font-bold">What to avoid</span>
      <ul className="my-4">
        {advice.what_to_avoid.map((d, i) => (
          <li key={`donts-${i}`} className="mb-2">
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
