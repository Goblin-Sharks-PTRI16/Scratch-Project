const React = require('react');
const { useEffect, useRef, useState } = require('react');
const { Chart } = require('chart.js/auto');

const Graph = ({ userInfo }) => {
  const user = userInfo?.user_id;

  const [goals, setGoals] = useState(null); // Set initial state to null
  const [totalData, setTotalData] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [graphId, setGraphId] = useState(localStorage.getItem('graphId'));

  // Function to poll local storage for graphId
  const pollStorage = () => {
    const newGraphId = localStorage.getItem('graphId');
    if (newGraphId && newGraphId !== graphId) {
      setGraphId(newGraphId);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(pollStorage, 1000);
    return () => clearInterval(intervalId);
  }, [user,graphId]);

  // Fetch goals from the server
  const fetchGoals = async () => {
    const endpoint = `http://localhost:3000/api/fetchgoal?id=${user}`;
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setTotalData(data);
        // Check if data is not empty before setting goals
        if (data.length > 0) {
          setGoals(data[0]);
        }
      } else {
        console.error('Error fetching accounts:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Set graph progress based on total data
  const setGraphProgress = (totalData) => {
    const newXAxis = [];
    const newYAxis = [];

    let accumulatedProgress = 0; // Initialize accumulated progress

    // To track the last processed goal_id to avoid duplicate entries
    let lastGoalId = null;

    for (let i = 0; i < totalData.length; i++) {
        // Process only the current goal_id
        if (totalData[i].goal_id === graphId) {
            let date;

            // Check if the progress is zero
            if (totalData[i].progress === "0") {
                date = totalData[i].created_at.split('T')[0]; // Use created_at for zero progress
                // Remove '2024' if it exists at the start of the date
      if (date.startsWith('2024')) {
        date = date.substring(5); // Removes the first 5 characters ('2024-')
      }
                // Only add the date and progress if this is the first entry for the goal
                if (lastGoalId !== graphId) {
                    newXAxis.push(date);
                    newYAxis.push(accumulatedProgress); // Progress remains the same (0)
                    lastGoalId = graphId; // Update the last processed goal_id
                }
            } else {
                // Use progress_updated for non-zero progress
                date = totalData[i].progress_updated.split('T')[0]; // Extract date from progress_updated
                // Remove '2024' if it exists at the start of the date
      if (date.startsWith('2024')) {
        date = date.substring(5); // Removes the first 5 characters ('2024-')
      }
                // Convert progress to a number for accumulation
                const currentProgress = parseInt(totalData[i].progress, 10);

                // Accumulate progress
                accumulatedProgress += currentProgress;

                // Push the accumulated progress and corresponding date
                newXAxis.push(date);
                newYAxis.push(accumulatedProgress);
            }
        }
    }

    setXAxis(newXAxis);
    setYAxis(newYAxis);
};

  // Fetch goals on component mount
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [graphId,user]);
  
  const getGraphUnit = (graphId, totalData) => {
    const goalData = totalData.find(item => item.goal_id === graphId);
    return goalData ? getUnit(goalData.sar) : ''; // Return empty string if no data
  };

  // Code to get unit
  
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
  //
  // Update graph when graphId or totalData changes
  useEffect(() => {
    if (graphId && totalData.length > 0) {
      setGraphProgress(totalData);

    }
  }, [graphId, totalData]);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getGraphTitle = (graphId, totalData) => {
    const goalData = totalData.find(item => item.goal_id === graphId);
    return goalData ? goalData.sar : 'Add Graph'; // Default title if no goal found
  };
  useEffect(() => {
    if (!goals || xAxis.length === 0 || yAxis.length === 0) return; // Only proceed if data is ready
    
    const getGraphLabel = (graphId, totalData) => {
      // You can customize this logic based on your requirements
      const goalData = totalData.find(item => item.goal_id === graphId);
      return goalData ? goalData.measurable : 'Unknown Goal'; // Default label if no goal found
    };
    const ctx = chartRef.current.getContext('2d');
    const graphData = {
      label: getGraphLabel(graphId, totalData),
      data: yAxis,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    };

    const chartData = {
      labels: xAxis,
      datasets: [graphData],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: `Progress (in ${getGraphUnit(graphId, totalData)})`, font: { size: 16 } },
        },
        x: {
          beginAtZero: true,
          title: { display: true, text: 'Time', font: { size: 16 } },
        },
      },
    };

    if (chartInstanceRef.current) {
      // Update existing chart
      chartInstanceRef.current.data = chartData;
      chartInstanceRef.current.update();
    } else {
      // Create new chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Clean up on unmount
        chartInstanceRef.current = null; // Reset reference
      }
    };
  }, [goals, xAxis, yAxis, graphId]); // Run effect on goals, xAxis, or yAxis changes

  return (
    <div className='graphDiv'>
      <h2>{getGraphTitle(graphId, totalData)}</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

module.exports = Graph;
