// defining a async main function simulating the get request
async function main() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=2",
  ); // fetching the data and limiting it to 2 json's

  const data = await response.json(); // Turning the headers to actual json data

  console.log(data); // logginf the short-data
}

// calling the main function while catching the errors
main().catch(console.error);
