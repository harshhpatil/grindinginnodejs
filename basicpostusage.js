// creating the object (payload)
const body = {
  title: "Foo",
  body: "Bar",
  userId: 1,
};

// defining a async main function simulating the post request
async function main() {
  // posting the data to the url using the fetch
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "User-Agent": "udici-stream-example",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json(); // getting the posted data back as most of the API's responds by sending back the dat you just sent

  console.log(data); // logging the data
}

// calling the main function while catching the errors
main().catch(console.error);
