import { request } from 'ice';
import HttpClient from '@/utils/HttpClient';

export default {
    state: {
        theme: window.localStorage.getItem('theme')
    },
    effects: (dispatch) => ({
        // fetch() {
        //     dispatch.menu.update({ theme: window.localStorage.getItem('theme') });
        // },
        changeTheme(_theme) {
            // debugger
            // if (dispatch.localset.theme === "default") {
            //     dispatch.localset.update({ theme: "dark" });
            //     window.localStorage.setItem('theme', 'dark');
            // }
            // else {
            //     dispatch.localset.update({ theme: "default" });
            //     window.localStorage.setItem('theme', 'default');
            // }
            dispatch.localset.update({ theme: _theme });
            window.localStorage.setItem('theme', _theme);
        }
    }),
    reducers: {
        update(prevState, payload) {
            return { ...prevState, ...payload };
        },
    },
};
