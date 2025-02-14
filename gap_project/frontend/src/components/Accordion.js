import React, { useRef, useState, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import '../css/Accordion.css'

//  accordionitem component
const AccordionItem = ({ question, score, improvement, evidence, isOpen, onClick }) => {
  const contentHeight = useRef();
  console.log(improvement);
  return (
    <div className="wrapper">
      <button
        className={`question-container ${isOpen ? "active" : ""}`}
        onClick={onClick}
      >
        <p className="question-content">{question}</p>
        <RiArrowDropDownLine className={`arrow ${isOpen ? "active" : ""}`} />
      </button>

      <div
        ref={contentHeight}
        className="answer-container"
        style={
          isOpen
            ? { height: contentHeight.current.scrollHeight }
            : { height: "0px" }
        }
      >
        <p className="answer-content">{score}</p>
        <p className="answer-content">{evidence}</p>
        <p className="answer-content">{improvement}</p>

      </div>
    </div>
  );
};

const Accordion = ({data, answers, evidence, improvement}) => {
      
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="container">
      {data.map((q, index) => (
        <>
        <AccordionItem
          key={index}
          question={q.Questions.Question_Name}
          score={
            answers[`${data[index]?.Section_Number}`]?.[
                data[index]?.Questions?.Question_Number &&
                String(data[index]?.Questions?.Question_Number).split(".")[1] &&
                String(Number(String(data[index]?.Questions?.Question_Number).split(".")[1]) - 1)
            ]
          }
          improvement = {
            improvement[
              String(data[index]?.Section_Number)
            ]?.[
              String(Number(String(data[index]?.Questions?.Question_Number).split(".")[1]) - 1)
            ]
          }
          evidence = {
            evidence[
              String(data[index]?.Section_Number)
            ]?.[
              String(Number(String(data[index]?.Questions?.Question_Number).split(".")[1]) - 1)
            ]
          }
          isOpen={activeIndex === index}
          onClick={() => handleItemClick(index)}
        />
        </>
      ))}
    </div>
  );
};

export default Accordion;
