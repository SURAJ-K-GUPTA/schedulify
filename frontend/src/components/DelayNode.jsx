import React from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { FaTimes } from "react-icons/fa";

export default function DelayNode({ id, data }) {
  const { setNodes } = useReactFlow();

  const handleRemove = () => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
  };

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded-md shadow-md p-4 relative w-60">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-yellow-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-yellow-500" />

      {/* Close button */}
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={handleRemove}
      >
        <FaTimes />
      </button>

      <h4 className="font-semibold text-gray-800 text-lg">⏱ Delay Node</h4>
      <p className="text-sm text-gray-700 mt-1">
        Delay: <span className="font-medium">{data.delayTime}</span>
      </p>
    </div>
  );
}
