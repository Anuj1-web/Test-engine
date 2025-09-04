import React, { useState, useEffect } from "react";

// Assume `tests` are imported or fetched from admin-created tests
// Example: import tests from './tests.json';
const sampleTests = [
  {
    title: "Sample Test 01",
    duration: 300,
    sections: [
      {
        title: "Section 1",
        questions: [
          {
            id: 1,
            text: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswerIndex: 1,
            image: null
          },
          {
            id: 2,
            text: "Select the animal shown",
            options: ["Dog", "Cat", "Elephant", "Tiger"],
            correctAnswerIndex: 0,
            image: "https://via.placeholder.com/150"
          }
        ]
      }
    ]
  }
];

export default function UserTestRunner() {
  const [tests, setTests] = useState(sampleTests);
  const [selectedTestIndex, setSelectedTestIndex] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // ---------- Timer ----------
  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, submitted]);

  const selectAnswer = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const submitTest = () => setSubmitted(true);
  const reattempt = () => {
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(tests[selectedTestIndex].duration);
    setCurrentSection(0);
    setCurrentQuestion(0);
  };

  const startTest = (index) => {
    setSelectedTestIndex(index);
    setTimeLeft(tests[index].duration);
    setCurrentSection(0);
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
  };

  if (selectedTestIndex === null) {
    return (
      <div className="p-6 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Select a Test to Start</h1>
        <div className="flex flex-col space-y-3">
          {tests.map((t, idx) => (
            <button
              key={idx}
              onClick={() => startTest(idx)}
              className="p-4 rounded-lg bg-black text-white hover:bg-gray-800 text-left shadow"
            >
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-gray-300">{t.duration}s</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const test = tests[selectedTestIndex];
  const section = test.sections[currentSection];
  const question = section.questions[currentQuestion];

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-white p-4 shadow overflow-auto">
        <h2 className="font-bold text-lg mb-4">{section.title}</h2>
        <div className="grid grid-cols-5 gap-2">
          {section.questions.map((q, qi) => {
            let status = "bg-gray-400";
            if (submitted) {
              if (answers[q.id] === q.correctAnswerIndex) status = "bg-green-500";
              else if (answers[q.id] !== undefined) status = "bg-red-500";
            } else if (answers[q.id] !== undefined) status = "bg-blue-500";
            return (
              <button
                key={qi}
                className={`${status} text-white rounded w-10 h-10`}
                onClick={() => setCurrentQuestion(qi)}
              >
                {qi + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <div className="flex items-center space-x-4">
            {timeLeft !== null && (
              <span className="font-mono text-lg">{`${Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}</span>
            )}
            {!submitted && (
              <button
                onClick={submitTest}
                className="px-4 py-2 border rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {/* Question */}
        <div className="p-4 bg-white rounded-lg shadow mb-4">
          <h3 className="font-semibold mb-2">{`Q${currentQuestion + 1}: ${question.text}`}</h3>
          {question.image && (
            <img
              src={question.image}
              alt="q-img"
              style={{ maxWidth: "250px", maxHeight: "150px", objectFit: "contain", cursor: "pointer" }}
              onDoubleClick={() => setModalImage(question.image)}
              className="mb-2 border rounded"
            />
          )}
          <div className="grid gap-3 mb-4">
            {question.options.map((opt, idx) => {
              let bg = "bg-gray-300";
              if (answers[question.id] === idx)
                bg = submitted
                  ? idx === question.correctAnswerIndex
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-blue-500";
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(question.id, idx)}
                  className={`${bg} text-white p-3 rounded text-left`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 border rounded-lg bg-black text-white hover:bg-gray-800"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.min(prev + 1, section.questions.length - 1))
              }
              className="px-4 py-2 border rounded-lg bg-black text-white hover:bg-gray-800"
            >
              Next
            </button>
          </div>

          {/* Submission Summary */}
          {submitted && (
            <div className="mt-4 p-2 border-t border-gray-300">
              <p className="font-semibold mb-2">Summary:</p>
              <p>
                {answers[question.id] !== undefined
                  ? `Selected: ${question.options[answers[question.id]]}, Correct: ${question.options[question.correctAnswerIndex]}`
                  : "Not Answered"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for full-screen image */}
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
