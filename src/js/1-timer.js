console.log("A");
setTimeout(test, 1000);

console.log("B");
setTimeout(test, 2000);

console.log("C");
setTimeout(test, 3000)
function test() {
  console.log("Hello");
}
