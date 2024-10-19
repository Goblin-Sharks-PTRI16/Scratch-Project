const React = require('react');
const Card = require('./Card');
const { useState } = require('react');
const { useEffect } = require('react');
const { v4: uuidv4 } = require('uuid');
// SAR, measurable, time to props and pass to individual cards

// grab fetched goal data and pass to respective components
// assign SAR, measurable, time to props and pass to goalist
// map to populate state array with users goals and render a card component for each goal

const GoalList = ({ userInfo }) => {
  const user = userInfo?.user_id;
  const [goals, setGoals] = useState([]);



  const fetchGoals = async () => {
    const endpoint = `http://localhost:3000/api/fetchgoal?id=${user}`; // Adjust the endpoint based on your API
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log('response from fetch call', data);
        setGoals(data);
      } else {
        const errorData = await response.json();
        // console.error('Error fetching accounts:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log('goal state', goals);
  // Use effect to constantly fetch from db
  useEffect(() => {
    if (user) {
      fetchGoals(); // Fetch accounts when the component mounts
    }
  }, [user]);

  const totalProgressGoals = goals.reduce((acc, currentGoal) => {
    const progressValue = Number(currentGoal.progress); // Convert to number
    const existingGoal = acc.find((goal) => goal.goal_id === currentGoal.goal_id);
  
    if (existingGoal) {
      return acc.map((goal) =>
        goal.goal_id === currentGoal.goal_id
          ? { ...goal, progress: goal.progress + progressValue } // Update the existing goal with summed progress
          : goal
      );
    }
  
    return [...acc, { ...currentGoal, progress: progressValue }]; // Ensure new goals have numeric progress
  }, []);

  return (
    <div id='goalListDiv'>
      <h1>Goal List</h1>
      {totalProgressGoals.length > 0 ? (
        totalProgressGoals.map((goal) => (
          <Card
            fetchGoals={fetchGoals}
            userInfo={userInfo}
            key={uuidv4()}
            goalId={goal.goal_id}
            goalName={goal.sar}
            goalAmount={goal.measurable}
            goalDuration={goal.target_completion_date}
            goalProgress={goal.progress}
            goalPercentage={Math.round((goal.progress / goal.measurable) * 100)}
          />
        ))
      ) : (
        <p>No goals found. Please add some goals!</p>
      )}
    </div>
  );
};

module.exports = GoalList;
