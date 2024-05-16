let APP_MODE = process.env.APP_MODE;
let _config = {
    env: 'default',
    baseURL: "http://127.0.0.1:7003/",
}

if (APP_MODE === 'dev') {
    _config = {
        env: 'dev',
        baseURL: "http://127.0.0.1:7003/",
    }
}
else if (APP_MODE === 'test') {
    _config = {
        env: 'test',
        baseURL: "/",
    }
}
else if (APP_MODE === 'prod') {
    _config = {
        env: 'prod',
        baseURL: "/",
    }
}

export default _config;