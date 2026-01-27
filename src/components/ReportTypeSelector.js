// components/ReportTypeSelector.jsx
export default function ReportTypeSelector({ value, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {["monthly", "periodic", "daily"].map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-4 py-2 rounded-md text-sm font-medium
            ${
              value === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}
