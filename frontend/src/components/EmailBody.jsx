import React from "react";
import { Handle, useReactFlow } from "reactflow";
import { FaTimes } from "react-icons/fa";

const EmailBody = ({ id, data: { subject, emailBody } }) => {
  const { setNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  };

  return (
    <div className="relative bg-white border border-gray-300 rounded-lg shadow-md px-4 py-3 min-w-[220px] max-w-xs">
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
      >
        <FaTimes size={12} />
      </button>

      {/* Node Content */}
      <div className="mb-1 text-gray-700 font-semibold text-sm">Email Body</div>

      <div className="mb-1">
        <div className="text-xs text-gray-500 font-medium">Subject:</div>
        <div className="text-sm text-gray-800 break-words">{subject}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500 font-medium">Body:</div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap break-words max-h-40 overflow-auto">
          {emailBody}
        </div>
      </div>

      {/* React Flow handles */}
      <Handle type="target" position="top" className="w-2 h-2 bg-blue-500" />
      <Handle type="source" position="bottom" className="w-2 h-2 bg-blue-500" />
    </div>
  );
};

export default EmailBody;
