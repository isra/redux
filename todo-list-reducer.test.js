const deepfreeze = require('deepfreeze');

const todoItem = (state, action) => {
	switch(action.type) {
		case 'ADD_TASK':
			return {
					id: action.id,
					task: action.task,
					complete: false
			};
		case 'TOGGLE_TASK':
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				complete: !state.complete
			}
			break;
		default:
			return state;
	}
};

const todoList = (state = [], action) => {

	switch(action.type) {
		case 'ADD_TASK':
			return [
				...state,
				todoItem(undefined, action)
			];
		case 'TOGGLE_TASK':
			return [
				...state.map(task => todoItem(task, action))
			];
		default:
			return state;
	}

};


test("writing todo list reducer", () => {

	const stateBefore = [];
	const action = {
		type: 'ADD_TASK',
		task: 'Learn React',
		id: 0
	};
	const stateAfter = [
		{
			id: 0,
			task: 'Learn React',
			complete: false
		}
	];

	deepfreeze(stateBefore);
	deepfreeze(action);

	expect(todoList(stateBefore, action)).toEqual(stateAfter);

});


test("Toggle task", () => {
	const stateBefore = [
		{
			id: 0,
			task: 'Learn React',
			complete: false
		},
		{
			id: 1,
			task: 'Learn Redux',
			complete: false
		}
	];

	const action = {
		type: 'TOGGLE_TASK',
		id: 1
	};

	const stateAfter = [
		{
			id: 0,
			task: 'Learn React',
			complete: false
		},
		{
			id: 1,
			task: 'Learn Redux',
			complete: true
		}
	];

	deepfreeze(stateBefore);
	deepfreeze(action);

	expect(todoList(stateBefore, action)).toEqual(stateAfter);

});

