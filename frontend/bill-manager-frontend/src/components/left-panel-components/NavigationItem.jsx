export default function NavigationItem({ id, name, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className="text-white w-full text-center px-4 py-2 hover:bg-gray-700 rounded justify-center"
    >
      {name}
    </button>
  );
}