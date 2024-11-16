import React, { useState } from "react";
import HeaderSignUpLoginPage from "../components/headerSignUpLoginPage";
import FooterLandingPage from "../components/Footer";

type QuestionType = {
  id: number;
  question: string;
  answer: boolean | null;
};

const initialQuestions: QuestionType[] = [
  {
    id: 1,
    question: "Do you often seem sad, tired, restless, or out of the sorts?",
    answer: null,
  },
  { id: 2, question: "Do you spend a lot of time alone?", answer: null },
  { id: 3, question: "Have low self-esteem?", answer: null },
  {
    id: 4,
    question: "Have trouble getting along with family, friends, and peers?",
    answer: null,
  },
  {
    id: 5,
    question: "Have frequent outbursts of shouting, complaining, or crying?",
    answer: null,
  },
  { id: 6, question: "Show sudden changes of eating patterns?", answer: null },
  {
    id: 7,
    question: "Show signs of using drugs and/or alcohol?",
    answer: null,
  },
  { id: 8, question: "Feel overwhelmed or stressed often?", answer: null },
  { id: 9, question: "Feel anxious or worried frequently?", answer: null },
];

const SignUpSurveyPage = () => {
  const [questions, setQuestions] = useState(initialQuestions);

  const handleAnswer = (id: number, answer: boolean) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSignUpLoginPage />
      <div className="flex-grow flex items-center justify-center bg-blue-50 py-10">
        <SurveySection questions={questions} onAnswer={handleAnswer} />
      </div>
      <FooterLandingPage />
    </div>
  );
};

const SurveySection = ({
  questions,
  onAnswer,
}: {
  questions: QuestionType[];
  onAnswer: (id: number, answer: boolean) => void;
}) => {
  return (
    <section className="bg-blue-100 p-6 rounded-lg shadow-md w-full max-w-3xl">
      <h2 className="text-3xl font-semibold text-center text-[#5E9ED9] mb-6">
        New User - Survey
      </h2>
      <form className="space-y-4">
        {questions.map(({ id, question, answer }) => (
          <div
            key={id}
            className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm"
          >
            <span className="text-lg">{question}</span>
            <div className="flex space-x-4 ">
              <button
                type="button"
                onClick={() => onAnswer(id, true)}
                className={`px-4 py-2 rounded-md ${
                  answer === true
                    ? "bg-blue-100 border border-[#44719b]"
                    : "bg-gray-100 border border-gray-400"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onAnswer(id, false)}
                className={`px-4 py-2 rounded-md ${
                  answer === false
                    ? "bg-blue-100 border border-[#44719b]"
                    : "bg-gray-100 border border-gray-400"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-2/4 bg-[#5E9ED9] text-white font-semibold p-3 rounded-md hover:bg-[#4a8ac9]"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignUpSurveyPage;
