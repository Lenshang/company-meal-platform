import { createStore } from 'ice';
import user from './models/user';
import menu from './models/menu';
import localset from './models/localset';
const store = createStore({
    user,
    menu,
    localset,
});
export default store;
