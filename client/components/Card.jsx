const React = require('react');
const { useState } = require('react');

const Card = ({
  goalName,
  goalAmount,
  goalDuration,
  goalId,
  goalProgress,
  goalPercentage,
  fetchGoals,
  userInfo,
  
}) => {
  const [formData, setFormData] = useState({
    progress: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/updateprogress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: formData.progress,
          goalId,
          userInfo,
          credentials: 'include'
        }),
      });
      const data = await response.json();
      // window.location.reload();
      if (response.ok) {
        console.log('progress updated', data);

        setFormData({ progress: '' }); // Clear form
        fetchGoals(); // Refresh goals without reloading the page
      } else {
        console.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const setGraphId = () => {
    localStorage.setItem('graphId', goalId);
  };

  const handleDelete = async () => {
    const endpoint = `http://localhost:3000/api/deletegoal?id=${goalId}`;
    fetchGoals();
    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (response.ok) {
        console.log('Goal deleted successfully');
        fetchGoals(); // Re-fetch goals after deletion
      } else {
        console.error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getUnit = (goalString) => {
    if (!goalString) return ''; // Check for empty or undefined input
  
    const words = goalString.trim().split(' '); // Trim and split by spaces
    return cleanString(words[words.length - 1]); // Return the last word
  };

  const cleanString = (str) => {
    return str
      .toLowerCase()                  // Convert to lowercase
      .replace(/[^\w\s]|_/g, '')       // Remove punctuation
      .replace(/\s+/g, ' ')            // Replace multiple spaces with a single space
      .trim();                         // Remove leading/trailing spaces
  };

  const handleAdd = async () => {};

  return (
    <div className='cardDiv'>
      <p> {goalName}</p>
      <p> Amount: {goalAmount} {getUnit(goalName)}</p>
      <p> Duration: {goalDuration} days</p>
      <p> Progress: {goalProgress} {getUnit(goalName)}</p>
      <p> Completion: {goalPercentage}%</p>
      <form  className ="addProg" onSubmit={handleAdd}>Add Progress: </form>
      <form onSubmit={handleSubmit}>
        <input
          type='number'
          required
          placeholder='Input your progress!'
          id='progress'
          name='progress'
          value={formData.progress}
          onChange={handleInputChange}
        />
        <button className = "update" type='submit'>Update Progress</button>
      </form>
      <button onClick={setGraphId}>Show Graph</button>
      <button onClick={() => handleDelete()}> Delete </button>
    </div>
  );
};

module.exports = Card;
