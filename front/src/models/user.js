import { request } from 'ice';
import HttpClient from '@/utils/HttpClient';

export default {
    state: {
        id:null,
        username:"",
        mobile:"",
        status:null,
        role_id:null,
        role:"",
    },
    effects: (dispatch) => ({
        async fetchUserProfile() {
            const res = await HttpClient.get("/api/auth/info");
            if (res.status === 200) {
                dispatch.user.update(res.data);
            }
        },
    }),
    reducers: {
        update(prevState, payload) {
            return { ...prevState, ...payload };
        },
    },
};
