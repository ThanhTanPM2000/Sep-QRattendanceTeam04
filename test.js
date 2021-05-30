console.log("1");

const test = hello(2, (number) => {
  console.log(number);
  hello(3, (test2) => {
    console.log(test2);
    console.log("4");
  });
});

// callback
// promise
// async await

function hello(number, callback) {
  setTimeout(() => {
    callback(number);
  }, 2000);
}
