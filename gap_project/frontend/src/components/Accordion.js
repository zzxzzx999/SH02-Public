import React, { useRef, useState, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import '../css/Accordion.css'

const COLOR_MAP = {
    exceptional: '#006613', 
    good: '#42C259',
    basic: '#7CCC8B', 
    needsImprovement: '#FFC546', 
    unsatisfactory: '#FF0B0B', 
  };

  const compliance = {
    1: {text:( <> Exceptional Compliance<br /> (Score 5) </> ), color: '#006613'},
    2: {text:( <> Good Compliance<br /> (Score 4) </> ), color: '#42C259'},
    3: {text:( <> Basic Compliance<br /> (Score 3) </> ), color: '#7CCC8B'},
    4: {text:( <> Needs Improvement<br /> (Score 2) </> ), color: '#FFC546'},
    5: {text:( <> Unsatisfactory<br /> (Score 1) </> ), color: '#FF0B0B'}
  };

//  accordionitem component
const AccordionItem = ({ question, score, improvement, evidence, isOpen, onClick, index }) => {
  const contentHeight = useRef();
  console.log(improvement);
  return (
    <div className="wrapper">
      <button
        className={`question-container ${isOpen ? "active" : ""}`}
        onClick={onClick}
      >
        <p className="question-content">{index+1}. {question}</p>
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
        <p className="compliance-box" style={{backgroundColor:compliance[score]?.color}}>{compliance[score]?.text || "No score"}</p>

        <div className="evidence-improvement-container">
            <p className="evidence-text">{evidence || "N/A"}</p>
            <p className="improvement-text">{improvement || "N/A"}</p>
        </div>

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
      {data.slice(0, -1).map((q, index) => (
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
          index = {index}
        />
        </>
      ))}
    </div>
  );
};

export default Accordion;
