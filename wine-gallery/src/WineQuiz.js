import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect to the gallery

const WineQuiz = ({ wines, setFilters }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const questions = [
    { id: 1, text: "Do you prefer red or white wine?", options: ["Red", "White", "Both"] },
    { id: 2, text: "What is your preferred price range?", options: ["0-50", "50-100", "100-200", "200+"] },
    { id: 3, text: "Do you prefer dry or sweet wines?", options: ["Dry", "Sweet", "Either"] },
    { id: 4, text: "What is your favorite wine region?", options: ["France", "Italy", "USA", "Other"] },
    { id: 5, text: "Do you have a preference for sparkling wine?", options: ["Yes", "No"] },
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRecommendations();
    }
  };

  const calculateRecommendations = () => {
    // Example logic to filter wines based on answers
    let filteredWines = wines.filter(wine => {
      const matchesType = answers[1] === 'Both' || wine.wine_type.toLowerCase() === answers[1].toLowerCase();
      const matchesPrice = parseFloat(wine.price) >= getMinPrice(answers[2]) && parseFloat(wine.price) <= getMaxPrice(answers[2]);
      const matchesSweetness = answers[3] === 'Either' || wine.sweetness.toLowerCase() === answers[3].toLowerCase();
      const matchesRegion = answers[4] === 'Other' || wine.region.toLowerCase() === answers[4].toLowerCase();
      const matchesSparkling = answers[5] === 'Yes' ? wine.sparkling === 'true' : true;

      return matchesType && matchesPrice && matchesSweetness && matchesRegion && matchesSparkling;
    });

    // Sort or get the top 5 based on user preferences (this is an example)
    const top5Wines = filteredWines.slice(0, 5);

    // Store the filters for gallery redirection
    const newFilters = {
      wineType: [answers[1]],
      priceRange: [getMinPrice(answers[2]), getMaxPrice(answers[2])],
      country: [answers[4]],
    };

    setFilters(newFilters);
    navigate('/recommendations', { state: { top5Wines } }); // Redirect to recommendations page
  };

  const getMinPrice = (priceRange) => {
    switch (priceRange) {
      case '0-50': return 0;
      case '50-100': return 50;
      case '100-200': return 100;
      case '200+': return 200;
      default: return 0;
    }
  };

  const getMaxPrice = (priceRange) => {
    switch (priceRange) {
      case '0-50': return 50;
      case '50-100': return 100;
      case '100-200': return 200;
      case '200+': return Infinity;
      default: return Infinity;
    }
  };

  return (
    <div className="wine-quiz">
      {currentStep <= questions.length ? (
        <div className="question-step">
          <h3>{questions[currentStep - 1].text}</h3>
          {questions[currentStep - 1].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(currentStep, option)}>
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div>Loading your recommendations...</div>
      )}
    </div>
  );
};

export default WineQuiz;
