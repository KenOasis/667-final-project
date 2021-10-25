const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

exports.orderGenerator = (start, end) => {
  const initial_orders = [];
  const orders = [];
  let random_index = 0;
  let next_order = 0;
  for (let i = start; i <= end; ++i) {
    initial_orders.push(i);
  }
  while (initial_orders.length > 0) {
    random_index = getRandomInt(initial_orders.length);
    next_order = initial_orders.splice(random_index, 1)[0];
    orders.push(next_order);
  } 

  return orders;
}

// test code
// const array = this.orderGenerator(1, 108);
// console.log(array);