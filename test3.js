// async await

async function hello() {
  console.log("1");
  await test(2);
  await test(3);
  await test(4);
  await test(5);
  console.log("6");
}

function test(number) {
  return new Promise((res) => {
    setTimeout(res(console.log(number)), 2000);
  });
}

hello();
