const React = require('react');
const { useState } = require('react');

// functionaliity

const GoalCreator = ( {userInfo} ) => {
  
  console.log('goal creator user', userInfo);
  const [formData, setFormData] = useState({
    goalName: '',
    goalAmount: '',
    goalDuration: '',
  });
  // handles input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //on submit post request using formdata

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/creategoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.user_id,
          goalName: formData.goalName,
          goalAmount: formData.goalAmount,
          goalDuration: formData.goalDuration,
          credentials: 'include'
        }),
      });
      window.location.reload();
      const data = await response.json();

      if (response.ok) {
        console.log('goal created', data);

        setFormData({ goalName: '', goalAmount: '', goalDuration: '' }); // Clear form
      } else {
        console.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id='goalCreatorDiv'>
        <h1>Enter Your Goal</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          required
          placeholder='Goal name'
          id='goalName'
          name='goalName'
          value={formData.goalName}
          onChange={handleInputChange}
        />
        <input
          type='number'
          required
          placeholder='Goal Amount'
          id='goalAmount'
          name='goalAmount'
          value={formData.goalAmount}
          onChange={handleInputChange}
        />
        <input
          type='number'
          required
          placeholder='Goal duration (days)'
          id='goalDuration'
          name='goalDuration'
          value={formData.goalDuration}
          onChange={handleInputChange}
        />
        <button className = 'goal' type='submit'>Add Goal</button>
      </form>
    </div>
  );
};

module.exports = GoalCreator;
