const deepfreeze = require('deepfreeze');

const testToggleTodo = (obj) => {
	
	// return {
	// 	id: obj.id,
	// 	task: obj.task,
	// 	complete: !obj.complete
	// };

	// return Object.assign({}, obj, { complete: !obj.complete });
	
	return {
		...obj,
		complete: !obj.complete
	};
}


test("Toggle Todo", () => {

	const taskBefore = {
		id: 1,
		task: "Make chores",
		complete: false
	};
	const taskAfter = {
		id: 1,
		task: "Make chores",
		complete: true
	};

	deepfreeze(taskBefore);

	expect(testToggleTodo(taskBefore)).toEqual(taskAfter);

});