import axios from 'axios';
import serverPath from '../configs/urls.js';
/**
 * @fileoverview 实现book数据模型
 * @author lemon
 */
class Request {
    /**
     * Books类
     * @class
     */
    /**
     * @constructor
     * @param {string} url KOA2执行上下文
     */
    constructor (url) {
        this.reqUrl = serverPath.basicDir + url;
    }
    /**
     * 获取后台全部图书列表
     * @param {object} data 配置项
     * @example 例子
     * 
     * fetch(data) 调用
     * return new Promise 返回值
     */
    fetch (data) {
        // console.log(this.reqUrl);
        // console.log(data);
        return axios.get(this.reqUrl, {
            data
        }).then(function(response){
            // console.info(response);
            // console.info(response.data);
            return response.data;
        }).catch(function(error){
            console.info(error);
        });

        // async await两种使用接收返回值
        // var ab = async function(){
        //     var abc = await new Promise(function (resolve, reject) {
        //         resolve(1);
        //     });
        //     console.log(abc + 'hello');
        // }
        // ab(); // 1hello

        // var ab = async function(){
        //     var abc = await new Promise(function (resolve, reject) {
        //         resolve(10);
        //     }).then(function (data){
        //         return data * 90;
        //     });
        //     console.log(abc + 'hello');
        // }
        // 900hello

        // axios.get(this.reqUrl,{
        //     params:{
        //     }
        // }).then(function(response){
        //     // console.info(response);
        //     // console.info(response.data);
        //     return response.data;
        // }).catch(function(error){
        //     console.info(error);
        // });
    }
}
export default Request;