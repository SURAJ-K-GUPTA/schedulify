import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useReactFlow } from "reactflow";

export default function DelayInputNodeCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const [delayList, setDelayList] = useState([]);
  const [selectedDelay, setSelectedDelay] = useState("");
  const [newDelay, setNewDelay] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { setNodes } = useReactFlow();

  const delayTemplates = [
    "now",
    "in 1 minute",
    "in 5 minutes",
    "in 1 hour",
    "in 1 day",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("delay_values");
    if (stored) {
      setDelayList(JSON.parse(stored));
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("delay_values", JSON.stringify(delayList));
    }
  }, [delayList, hasLoaded]);

  const handleCreateNode = () => {
    if (!selectedDelay.trim()) return;

    const location = {
      x: window.innerWidth / 2 - 100, // center horizontally
      y: window.innerHeight - 200, // ~200px from the bottom
    };
    setNodes((prev) => [
      ...prev,
      {
        id: `delay-${Date.now()}`,
        data: { delayTime: selectedDelay },
        type: "delayNode",
        position: location,
      },
    ]);

    setIsOpen(false);
    setSelectedDelay("");
  };

  const handleAddOrEditDelay = () => {
    if (!newDelay.trim()) return;

    if (editingIndex !== null) {
      const updated = [...delayList];
      updated[editingIndex] = newDelay;
      setDelayList(updated);
      setEditingIndex(null);
    } else if (!delayList.includes(newDelay)) {
      setDelayList((prev) => [...prev, newDelay]);
    }

    setNewDelay("");
  };

  const handleDelete = (index) => {
    const updated = delayList.filter((_, i) => i !== index);
    if (delayList[index] === selectedDelay) setSelectedDelay("");
    setDelayList(updated);
  };

  const handleEdit = (index) => {
    setNewDelay(delayList[index]);
    setEditingIndex(index);
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlayDelay") {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <div
        className="cursor-pointer w-64 border border-gray-300 bg-gray-100 rounded-lg shadow-sm p-4 text-center hover:shadow-md transition"
        onClick={() => setIsOpen(true)}
      >
        <div className="text-2xl text-gray-600 mb-1">
          <FaPlus />
        </div>
        <h2 className="font-medium text-gray-800">Add Delay Node</h2>
        <p className="text-sm text-gray-600">Click to schedule delay</p>
      </div>

      {/* Modal */}
      {isOpen && (
        <div   onClick={handleClickOutside} id="modalOverlayDelay" className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Select or Add Delay
            </h3>

            {/* Templates */}
            <select
              value={selectedDelay}
              onChange={(e) => setSelectedDelay(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select from delay templates</option>
              {delayTemplates.map((delay, idx) => (
                <option key={idx} value={delay}>
                  {delay}
                </option>
              ))}
              {delayList.map((delay, idx) => (
                <option key={`custom-${idx}`} value={delay}>
                  {delay}
                </option>
              ))}
            </select>

            <div className="flex mb-4 gap-2">
              <input
                type="text"
                placeholder="Add custom delay"
                value={newDelay}
                onChange={(e) => setNewDelay(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAddOrEditDelay}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>

            {/* Custom delay list */}
            <div className="max-h-32 overflow-y-auto">
              {delayList.map((delay, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm border-b py-1"
                >
                  <span>{delay}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNode}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Create Node
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
