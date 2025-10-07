

const CategoryChip = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
      isActive
        ? 'bg-black text-white dark:bg-gray-700'
        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

export default CategoryChip