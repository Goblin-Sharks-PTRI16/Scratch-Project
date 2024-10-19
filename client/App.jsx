const React = require('react');
const GoalList = require('./components/GoalList');
const Graph = require('./components/Graph');
const GoalCreator = require('./components/GoalCreator');
const Header = require('./components/Header');
const { useGoogleLogin } = require('@react-oauth/google');
const { useEffect } = require('react');

const App = () => {
  //user login state
  const [user, setUser] = React.useState(null);
  // login function using login.
  const [loggedInUser, setLoggedinUser] = React.useState(null);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Login successful!', response);
      setUser(response.access_token); // assuming response contains profile info
      console.log('google user', user);
    },
    onError: () => {
      console.log('Login failed');
    },
  });

  useEffect(() => {
    const fetchUserInfo = async (user) => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await response.json();
        console.log('User Info:', userInfo);
        fetchData(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    const fetchData = async (userInfo) => {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInfo }),
        });
        console.log('response', response);
        if (response.ok) {
          const data = await response.json();
          console.log('Logged in user data:', data);
          // This will log the updated user
          setLoggedinUser(data.loggedInUser);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (user) {
      fetchUserInfo(user);
    }
  }, [user]); // Runs whenever `user` is updated

  // Styled components?

  return (
    <div className='headerDiv'>
      <Header></Header>
      <h1>My Goal Progress</h1>
      {/* If user is logged in, show the main app */}
      {loggedInUser ? (
        <div className='appDiv'>
          <div className='leftDiv'>
            <GoalList id='goalList' userInfo={loggedInUser}></GoalList>
            <GoalCreator id='goalCreator' userInfo={loggedInUser}></GoalCreator>
          </div>
          <div className='rightDiv'>
            <Graph userInfo={loggedInUser}></Graph>
          </div>
        </div>
      ) : (
        // Show login button if the user is not logged in
        <button onClick={() => login()}>Login with Google</button>
      )}
    </div>
  );
};

module.exports = App;
