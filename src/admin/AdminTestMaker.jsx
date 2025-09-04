import React, { useState } from "react";

export default function AdminTestMaker() {
  const [tests, setTests] = useState([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Test fields
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(300);

  // Section/Question fields
  const [sectionTitle, setSectionTitle] = useState("");
  const [selectedSection, setSelectedSection] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  // ---------- Test Management ----------
  const createTest = () => {
    if (!testTitle) return alert("Test title required");
    setTests([...tests, { title: testTitle, duration: testDuration, sections: [] }]);
    setCurrentTestIndex(tests.length);
    setTestTitle("");
  };

  const addSection = () => {
    if (!sectionTitle) return alert("Section title required");
    const copy = [...tests];
    copy[currentTestIndex].sections.push({ title: sectionTitle, questions: [] });
    setTests(copy);
    setSectionTitle("");
    setSelectedSection(copy[currentTestIndex].sections.length - 1);
  };

  const addQuestion = () => {
    if (!questionText || options.some((o) => !o)) return alert("Question and options required");
    const copy = [...tests];
    const question = {
      id: Date.now(),
      text: questionText,
      options,
      correctAnswerIndex,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    };
    copy[currentTestIndex].sections[selectedSection].questions.push(question);
    setTests(copy);

    // Reset question form
    setQuestionText("");
    setOptions(["", ""]);
    setCorrectAnswerIndex(0);
    setImageFile(null);
  };

  const handleOptionChange = (idx, val) => {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Test Maker</h1>
      <div className="flex space-x-6 flex-1">
        {/* Left Panel - Test List & Controls */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="flex-1 overflow-auto mb-4">
            {tests.map((t, idx) => (
              <div
                key={idx}
                className={`p-3 mb-2 border rounded-lg cursor-pointer hover:bg-gray-100 ${
                  currentTestIndex === idx ? "bg-gray-200" : ""
                }`}
                onClick={() => setCurrentTestIndex(idx)}
              >
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-500">{t.duration}s</div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Create New Test</h3>
            <input
              type="text"
              placeholder="Test Title"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
            />
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={testDuration}
              onChange={(e) => setTestDuration(Number(e.target.value))}
              className="w-full p-2 border rounded-lg mb-2"
            />
            <button
              onClick={createTest}
              className="w-full px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              Create Test
            </button>
          </div>
          {currentTestIndex !== null && (
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="mt-4 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
            >
              {previewMode ? "Exit Preview" : "Preview Test"}
            </button>
          )}
        </div>

        {/* Right Panel - Editor / Preview */}
        {currentTestIndex !== null && !previewMode && (
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-md overflow-auto flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{tests[currentTestIndex].title}</h2>

            {/* Section Manager */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-semibold mb-2">Sections</h3>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Section Title"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  onClick={addSection}
                  className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Add Section
                </button>
              </div>
              {tests[currentTestIndex].sections.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-3 mb-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedSection === idx ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedSection(idx)}
                >
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-gray-500">{s.questions.length} questions</div>
                </div>
              ))}
            </div>

            {/* Question Manager */}
            {tests[currentTestIndex].sections.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Add Question</h3>
                <input
                  type="text"
                  placeholder="Question Text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-3"
                />
                {options.map((opt, idx) => (
                  <div key={idx} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                      className="px-2 py-1 border rounded-lg bg-gray-800 text-white hover:bg-black"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setOptions([...options, ""])}
                  className="px-3 py-2 border rounded-lg mb-3 bg-black text-white hover:bg-gray-800"
                >
                  Add Option
                </button>
                <div className="mb-3">
                  <label className="mr-2 font-semibold">Correct Answer:</label>
                  <select
                    value={correctAnswerIndex}
                    onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
                    className="p-2 border rounded-lg"
                  >
                    {options.map((_, i) => (
                      <option key={i} value={i}>{`Option ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Image (optional):</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </div>
                <button
                  onClick={addQuestion}
                  className="px-3 py-2 border rounded-lg w-full bg-black text-white hover:bg-gray-800"
                >
                  Add Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* Preview Mode */}
        {previewMode && currentTestIndex !== null && (
          <div className="w-2/3 p-6 bg-gray-50 rounded-lg shadow-md overflow-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Preview: {tests[currentTestIndex].title}</h2>
            {tests[currentTestIndex].sections.map((s, si) => (
              <div key={si} className="mb-4">
                <h3 className="font-semibold mb-2">{s.title}</h3>
                {s.questions.map((q, qi) => (
                  <div key={qi} className="mb-3 p-3 border rounded-lg bg-white shadow-sm">
                    <p className="font-semibold mb-2">{`Q${qi + 1}: ${q.text}`}</p>
                    {q.image && (
                      <img
                        src={q.image}
                        alt="q-img"
                        style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "contain", cursor: "pointer" }}
                        onDoubleClick={() => setModalImage(q.image)}
                        className="mb-2 border rounded"
                      />
                    )}
                    <ul className="list-disc ml-5">
                      {q.options.map((opt, i) => (
                        <li key={i} className={q.correctAnswerIndex === i ? "font-bold text-green-600" : ""}>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for full screen image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <img src={modalImage} alt="full" className="max-h-full max-w-full rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
