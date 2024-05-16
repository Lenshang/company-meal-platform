import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';
import config from "@/config";
// import {config} from "ice";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 60000;
axios.defaults.baseURL = config.baseURL;
console.log(config)
export default class HttpClient {
    static beforeRequest = null;
    static beforeResponse = null;
    static onError = null;
    static async get(url, data = null, other = {}) {
        let request = {
            method: 'get',
            url: url,
            ...other
        };
        if (data) {
            request.params = data;
        }
        return await this.createRequest(request);
    }

    static async post(url, data = null, other = {}) {
        let request = {
            method: 'post',
            url: url,
            data: data,
            ...other
        };

        return await this.createRequest(request);
    }

    static async put(url, data = null, other = {}) {
        let request = {
            method: 'put',
            url: url,
            data: data,
            ...other
        };

        return await this.createRequest(request);
    }

    static async download(url, data = null, method = "get", file_name = "download", other = {}) {
        let res = null;
        if (method.toLowerCase() === "get") {
            res = await this.get(url, data, {
                responseType: 'blob',
                ...other
            });
        }
        else if (method.toLowerCase() === "put") {
            res = await this.put(url, data, {
                responseType: 'blob',
                ...other
            });
        }
        else {
            res = await this.post(url, data, {
                responseType: 'blob',
                ...other
            });
        }
        if (res.status === 200) {
            const blob = new Blob([res.data])
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = file_name; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        }
        return res;
    }

    static async oauth2(url, username, password, other = {}) {
        const loginInfo = {
            username: username.trim(),
            password: password,
            grant_type: 'password'
        };

        let request = {
            method: 'post',
            url: url,
            data: qs.stringify(loginInfo),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            ...other
        };

        return await this.createRequest(request);
    }

    static async request(url, method, other = {}) {
        let request = {
            method: method,
            url: url,
            ...other
        };
        return await this.createRequest(request);
    }

    static async createRequest(request) {
        let resp = null;
        try {
            let _request = this.beforeRequest ? this.beforeRequest(request) : request;
            resp = await axios.request(_request);
        }
        catch (error) {
            //当设置了onError时过滤错误类型
            if (this.onError && error.isAxiosError) {
                resp = this.onError(error);
            }
            else {
                resp = error.response;
            }
        }
        return this.beforeResponse ? this.beforeResponse(resp) : resp;
    }
}