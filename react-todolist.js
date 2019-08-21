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

const Link = ({ active, children, onClickFilter }) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClickFilter();
      }}
    >
      {children}
    </a>
  );
};

class FilterLink extends React.Component {
  componentWillMount() {
    this.unsubscribe = storeApp.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = storeApp.getState();

    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClickFilter={() =>
          storeApp.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}

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

const Footer = () => (
  <div>
    Show <FilterLink filter={"SHOW_ALL"}>All</FilterLink>{" "}
    <FilterLink filter={"SHOW_ACTIVE"}>Active</FilterLink>{" "}
    <FilterLink filter={"SHOW_COMPLETED"}>Completed</FilterLink>
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
    <Footer />
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
