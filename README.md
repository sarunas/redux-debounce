redux-debounce
=============

Redux middleware to debounce your actions

```bash
npm install --save redux-debounce
```

## Usage

```js
import {createStore, applyMiddleware} from "redux";
import debounceActions from 'redux-debounce';
import reducers from "./reducers";
import actionTypes from "./constants/actionTypes";

const defaultWait = 300
const defaultDebounceOption = { // https://lodash.com/docs#debounce
  leading: true,
  trailing: true
}

const middleware = debounceActions(defaultWait, defaultDebounceOption);
const store = applyMiddleware(middleware)(createStore)(reducers);
```

Then you just have to dispatch actions with the meta `debounce`:

```js
{
  type: 'ACTION_TYPE',
  meta: {
    debounce: true
  }
}

{
  type: 'ACTION_TYPE_2',
  meta: {
    debounce: 300 // wait time
  }
}

{
  type: 'ACTION_TYPE_3',
  meta: {
    debounce: {
      wait: 300,
      leading: false
    }
  }
}

```

There are 2 special actions exported by the library:

```js
import {CANCEL, FLUSH} from debounce;

dispatch({
  type: CANCEL,
  payload: {
    type: 'ACTION_TYPE'
  }
})

dispatch({
  type: FLUSH,
  payload: {
    type: ['ACTION_TYPE_2', 'ACTION_TYPE_3']
  }
})

dispatch({ // will flush everything
  type: FLUSH
})
```

Both of them can be used to respectively cancel or flush a debounced action.

## License

  MIT
