import Axios from "axios";
import { ElMessage } from "element-plus";

let baseURL = import.meta.env.VITE_APP_BASE_API

const axios = Axios.create({
    timeout: 30000,
    baseURL,
    withCredentials: false,
    crossDomain: true,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// 请求拦截
axios.interceptors.request.use(
    (req) => {
        req.headers.target = req.target || 'mobileInteract'
        if (req.url !== '/admin/account/login.post') {
            const token = sessionStorage.getItem('token')
            req.headers.Authorization = token
        }
        if (req.method === 'get') {
            let dataStr = ''
            let { data } = req
            Object.keys(data).forEach((key) => {
                // if (data[key] !== '') {
                //     dataStr += `${key}=${data[key]}&`
                // }
                dataStr += `${key}=${data[key]}&`
            })
            if (dataStr !== '') {
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                req.url = req.url + '?' + dataStr
            }
        }
        return req
    },
    (error) => {
        console.error("error:", error) // for debug
        Promise.reject(error)
    }
);

// 响应拦截
axios.interceptors.response.use(
    (res) => {
        const data = res.data
        if (data.errorCode === 'fail') {
            ElMessage.warning(data.errorMsg)
        }
        return res
    },
    (error) => Promise.reject(error)
)

export default axios