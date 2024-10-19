const React = require('react');
const { useState, useEffect } = require('react');

const quotesArray = [
  'Believe you can and you\'re halfway there.',
  'It does not matter how slowly you go as long as you do not stop.',
  'The only limit to our realization of tomorrow is our doubts of today.',
  'Life is short, spend as much time as you can on the computer.',
  'If you never give up, you can never fail.',
  'Do what you can, with what you have, where you are.',
  'Show up, don\'t give up, and ask questions.',
  'Champions keep playing until they get it right.',
  'You are never too old to set another goal or to dream a new dream.',
  'It always seems impossible until it\'s done.',
];

const Header = () => {
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    // Function to update the quote
    const updateQuote = () => {
      const quote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
      setRandomQuote(quote);
    };

    // Set the interval for every 5 seconds (3000 milliseconds)
    const intervalId = setInterval(updateQuote, 5000);

    // Call updateQuote immediately to display a quote on mount
    updateQuote();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1 id='quote'>"{randomQuote}"</h1>
    </div>
  );
};

module.exports = Header;
