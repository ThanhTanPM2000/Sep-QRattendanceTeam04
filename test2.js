console.log(1);

test(2)
  .then((x) => {
    console.log(x);
    return 3;
  })
  .then((y) => {
    console.log(y);
    return 4;
  })
  .then((z) => {
    console.log(z);
    console.log(5);
  });

//promise

function test(number) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(number);
    }, 2000);
  });
}
