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

const FilterLink = ({ filter, currentFilter, children }) => {
  if (currentFilter === filter) {
    return <span>{children}</span>;
  }

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        storeApp.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter: filter
        });
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

class App extends React.Component {
  render() {
    const { todos, visibilityFilter } = this.props;

    const listFilterTodo = getListFilterTodo(todos, visibilityFilter);

    return (
      <div>
        <h1>Hello Redux</h1>
        <input
          type="text"
          ref={element => {
            this.input = element;
          }}
        />
        <button
          onClick={() => {
            storeApp.dispatch({
              type: "ADD_TASK",
              id: indexTask++,
              task: this.input.value
            });
            this.input.value = "";
          }}
        >
          Add task
        </button>
        <ul>
          {listFilterTodo.map(item => (
            <li
              key={item.id}
              onClick={() =>
                storeApp.dispatch({
                  type: "TOGGLE_TASK",
                  id: item.id
                })
              }
              style={{
                textDecoration: item.complete === true ? "line-through" : "none"
              }}
            >
              {item.task}
            </li>
          ))}
        </ul>
        Show{" "}
        <FilterLink filter={"SHOW_ALL"} currentFilter={visibilityFilter}>
          All
        </FilterLink>{" "}
        <FilterLink filter={"SHOW_ACTIVE"} currentFilter={visibilityFilter}>
          Active
        </FilterLink>{" "}
        <FilterLink filter={"SHOW_COMPLETED"} currentFilter={visibilityFilter}>
          Completed
        </FilterLink>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <App {...storeApp.getState()} />,
    document.getElementById("root")
  );
};

storeApp.subscribe(render);

render();
