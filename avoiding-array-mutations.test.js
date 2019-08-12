const deepfreeze = require('deepfreeze');

const addCounter = (list) => {
	return [...list, 0];
};

const removeCounter = (list, index) => {
	return [...list.slice(0, index), ...list.slice(index + 1)];
};

const incrementCounter = (list, index) => {
	return [...list.slice(0, index), (list[index] + 1), ...list.slice(index + 1)];
};


test("listAter is equals to listBefore", () => {
	const listAfter = [];
	const listBefore = [0];

	deepfreeze(listAfter);

	expect(addCounter(listAfter)).toEqual(listBefore);
});


test("remove", () => {
	const listBefore =  [10, 20, 30];
	const listAfter = [10, 30];

	deepfreeze(listBefore);

	expect(removeCounter(listBefore, 1)).toEqual(listAfter);
});

test("Increment counter", () => {
	const listBefore =  [10, 20, 30];
	const listAfter = [10, 21, 30];

	deepfreeze(listBefore);

	expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
});