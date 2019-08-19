const createStore = Redux.createStore;

const todoItem = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        id: action.id,
        task: action.task,
        complete: false
      };
    case "TOGGLE_TASK":
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        complete: !state.complete
      };
      break;
    default:
      return state;
  }
};

const todoList = (state = [], action) => {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, todoItem(undefined, action)];
    case "TOGGLE_TASK":
      return [...state.map(task => todoItem(task, action))];
    default:
      return state;
  }
};

const visibilityFilter = (status = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return status;
  }
};

// Redux: Reducer Composition with combineReducers()
const combineReducers = Redux.combineReducers;

const todoListApp = combineReducers({
  todos: todoList,
  visibilityFilter
});

const storeApp = createStore(todoListApp);
let indexTask = 0;

const FilterLink = ({ filter, currentFilter, children, onClickFilter }) => {
  if (currentFilter === filter) {
    return <span>{children}</span>;
  }

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClickFilter(filter);
      }}
    >
      {children}
    </a>
  );
};

const getListFilterTodo = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_ACTIVE":
      return todos.filter(item => !item.complete);
    case "SHOW_COMPLETED":
      return todos.filter(item => item.complete);
  }
};

const Task = ({ onClick, complete, task }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: complete === true ? "line-through" : "none"
    }}
  >
    {task}
  </li>
);

const Tasks = ({ todos, onClickHandler }) => (
  <ul>
    {todos.map(task => (
      <Task key={task.id} {...task} onClick={() => onClickHandler(task.id)} />
    ))}
  </ul>
);

const HeaderTodo = ({ onClickAddHandler }) => {
  let input;
  return (
    <div>
      <input
        type="text"
        ref={element => {
          input = element;
        }}
      />
      <button
        onClick={() => {
          onClickAddHandler(input.value);
          input.value = "";
        }}
      >
        Add task
      </button>
    </div>
  );
};

const Footer = ({ visibilityFilter, onClickFilterHandler }) => (
  <div>
    Show{" "}
    <FilterLink
      filter={"SHOW_ALL"}
      currentFilter={visibilityFilter}
      onClickFilter={onClickFilterHandler}
    >
      All
    </FilterLink>{" "}
    <FilterLink
      filter={"SHOW_ACTIVE"}
      currentFilter={visibilityFilter}
      onClickFilter={onClickFilterHandler}
    >
      Active
    </FilterLink>{" "}
    <FilterLink
      filter={"SHOW_COMPLETED"}
      currentFilter={visibilityFilter}
      onClickFilter={onClickFilterHandler}
    >
      Completed
    </FilterLink>
  </div>
);

const App = ({ todos, visibilityFilter }) => (
  <div>
    <HeaderTodo
      onClickAddHandler={task =>
        storeApp.dispatch({
          type: "ADD_TASK",
          id: indexTask++,
          task
        })
      }
    />
    <Tasks
      todos={getListFilterTodo(todos, visibilityFilter)}
      onClickHandler={id =>
        storeApp.dispatch({
          type: "TOGGLE_TASK",
          id
        })
      }
    />
    <Footer
      visibilityFilter={visibilityFilter}
      onClickFilterHandler={filter => {
        storeApp.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter
        });
      }}
    />
  </div>
);

const render = () => {
  console.log(storeApp.getState());

  ReactDOM.render(
    <App {...storeApp.getState()} />,
    document.getElementById("root")
  );
};

storeApp.subscribe(render);

render();
