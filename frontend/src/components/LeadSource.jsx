import React from "react";
import { Handle, useReactFlow } from "reactflow";
import { FaTimes } from "react-icons/fa";

const LeadSource = ({ id, data: { email } }) => {
  const { setNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };

  return (
    <div className="relative bg-white border border-gray-300 rounded-lg shadow-md px-4 py-3 min-w-[200px] text-sm">
      {/* Delete Icon */}
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
      >
        <FaTimes size={12} />
      </button>

      {/* Content */}
      <div className="font-semibold text-gray-700 mb-1">Lead Source</div>
      <div className="text-gray-600 truncate">{email}</div>

      {/* React Flow Handles */}
      <Handle type="target" position="top" className="w-2 h-2 bg-blue-500" />
      <Handle type="source" position="bottom" className="w-2 h-2 bg-blue-500" />
    </div>
  );
};

export default LeadSource;
