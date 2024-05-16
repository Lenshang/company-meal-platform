import { request } from 'ice';
import HttpClient from '@/utils/HttpClient';

export default {
    state: {
        item:[]
    },
    effects: (dispatch) => ({
        async fetch() {
            const res = await HttpClient.get("/api/auth/menu-list");
            if (res.status === 200) {
                dispatch.menu.update({item:res.data});
            }
        },
    }),
    reducers: {
        update(prevState, payload) {
            return { ...prevState, ...payload };
        },
    },
};
