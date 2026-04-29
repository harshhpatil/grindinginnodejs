// retriving user data from multiple sources and aggregating it
const USER_DATA_SOURCE = "https://jsonplaceholder.typicode.com/users";
const USER_POSTS_SOURCE = "https://jsonplaceholder.typicode.com/posts?userId=";

async function fetchUserData(userId) {
  try {
    // promise to fetch user data
    const fetchUserData = new Promise((resolve, reject) => {
      resolve(
        fetch(USER_DATA_SOURCE + "/" + userId)
          .then((response) => response.json())
          .catch((err) => {
            reject("Error fetching user data for userId: " + userId);
          }),
      );
    });

    // promise to fetch the user posts
    const fetchUserPosts = new Promise((resolve, reject) => {
      resolve(
        fetch(USER_POSTS_SOURCE + userId)
          .then((response) => response.json())
          .catch((err) => {
            reject("Error fetching user posts for userId: " + userId);
          }),
      );
    });

    // aggregate the data from both promises
    return Promise.all([fetchUserData, fetchUserPosts])
      .then(([userData, userPosts]) => {
        return {
          userData,
          userPosts,
        };
      })
      .catch((err) => {
        console.error(
          "Error aggregating user data and posts for userId: " + userId,
        );
      });
  } catch (err) {
    throw new Error("Error fetching user data: " + err.message);
  }
}


// calling out the function
fetchUserData(1)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });