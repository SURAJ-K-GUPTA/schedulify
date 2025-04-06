import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useReactFlow } from "reactflow";

export default function LeadSourceNodeCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    const stored = localStorage.getItem("lead_emails");
    if (stored) {
      setEmailList(JSON.parse(stored));
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("lead_emails", JSON.stringify(emailList));
    }
  }, [emailList, hasLoaded]);

  const handleCreateNode = () => {
    if (!selectedEmail.trim()) return;

    const location = {
      x: window.innerWidth / 2 - 100, // center horizontally
      y: 100, // ~100px from the top
    };
    setNodes((prev) => [
      ...prev,
      {
        id: `lead-${Date.now()}`,
        data: { email: selectedEmail },
        type: "leadSource",
        position: location,
      },
    ]);

    setIsOpen(false);
    setSelectedEmail("");
  };

  const handleAddOrEditEmail = () => {
    if (!newEmail.trim()) return;

    if (editingIndex !== null) {
      const updated = [...emailList];
      updated[editingIndex] = newEmail;
      setEmailList(updated);
      setEditingIndex(null);
    } else if (!emailList.includes(newEmail)) {
      setEmailList((prev) => [...prev, newEmail]);
    }

    setNewEmail("");
  };

  const handleDelete = (index) => {
    const updated = emailList.filter((_, i) => i !== index);
    setEmailList(updated);
    if (emailList[index] === selectedEmail) setSelectedEmail("");
  };

  const handleEdit = (index) => {
    setNewEmail(emailList[index]);
    setEditingIndex(index);
  };
  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlayLead") {
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
        <h2 className="font-medium text-gray-800">Add Lead Source</h2>
        <p className="text-sm text-gray-600">Click to select or add email</p>
      </div>

      {/* Modal */}
      {isOpen && (
        <div onClick={handleClickOutside} id="modalOverlayLead" className="fixed inset-0  bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-60">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Select or Add Recipient Email</h3>

            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
            >
              <option value="">Select an email</option>
              {emailList.map((email, idx) => (
                <option key={idx} value={email}>
                  {email}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter new email"
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAddOrEditEmail}
              >
                Add
              </button>
            </div>

            {emailList.map((email, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded px-3 py-2 flex justify-between items-center"
              >
                <span>{email}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(index)}>
                    <FaEdit className="text-orange-500" />
                  </button>
                  <button onClick={() => handleDelete(index)}>
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreateNode}
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
