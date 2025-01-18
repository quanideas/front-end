"use client";
import { PencilSquareIcon as PencilAltIcon, TrashIcon } from "@heroicons/react/24/outline";

const ActionButton = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-center space-x-8">
      <button
        className="flex items-center text-gray-500 hover:text-blue-600"
        onClick={onEdit}
      >
        <PencilAltIcon className="w-5 h-5" />
      </button>
      {onDelete && (
        <button
          className="flex items-center text-red-500 hover:text-red-700"
          onClick={onDelete}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ActionButton;
