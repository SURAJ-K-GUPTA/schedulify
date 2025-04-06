import React, { useEffect, useState } from "react";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { useReactFlow } from "reactflow";

export default function EmailBodyNodeCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const { setNodes } = useReactFlow();

  useEffect(() => {
    const stored = localStorage.getItem("email_templates");
    if (stored) setTemplates(JSON.parse(stored));
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("email_templates", JSON.stringify(templates));
    }
  }, [templates, hasLoaded]);

  const handleCreateNode = () => {
    if (!subject.trim() || !emailBody.trim()) return;

    const location = {
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 100,
    };
    setNodes((prev) => [
      ...prev,
      {
        id: `email-body-${Date.now()}`,
        data: { subject, emailBody },
        type: "emailBody",
        position: location,
      },
    ]);

    setIsOpen(false);
    setSubject("");
    setEmailBody("");
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !subject || !emailBody) return;
    const newTemplate = { name: templateName, subject, body: emailBody };
    const filtered = templates.filter((t) => t.name !== templateName);
    setTemplates([...filtered, newTemplate]);
    setTemplateName("");
  };

  const handleSelectTemplate = (name) => {
    const template = templates.find((t) => t.name === name);
    if (template) {
      setSelectedTemplate(name);
      setSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  const handleDeleteTemplate = (name) => {
    setTemplates((prev) => prev.filter((t) => t.name !== name));
    if (name === selectedTemplate) {
      setSelectedTemplate("");
      setSubject("");
      setEmailBody("");
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlayEmailBody") {
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
        <h2 className="font-medium text-gray-800">Add Email Body</h2>
        <p className="text-sm text-gray-600">Click to create email content</p>
      </div>

      {/* Modal */}
      {isOpen && (
        <div  onClick={handleClickOutside} id="modalOverlayEmailBody" className="fixed inset-0 top-20 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-60">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4  overflow-scroll h-100 ">
            <h3 className="text-lg font-semibold">Create Email Body</h3>

            {/* Template Selection */}
            <select
              value={selectedTemplate}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select a template</option>
              {templates.map((t, idx) => (
                <option key={idx} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <textarea
              rows={4}
              placeholder="Email Body"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Save as template..."
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSaveTemplate}
              >
                <FaSave />
              </button>
            </div>

            {templates.length > 0 && (
              <div className="space-y-2">
                {templates.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                  >
                    <span>{t.name}</span>
                    <button onClick={() => handleDeleteTemplate(t.name)}>
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
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
