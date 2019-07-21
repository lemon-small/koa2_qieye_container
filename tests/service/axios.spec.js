const axios = require('axios');
describe('node接口', function () {
    it('interface test', function (done) {
        axios.get('http://192.168.64.2/basic/web/index.php?r=book%2Findex').then(function (response) {
            if (response.data[0].book_id === '123') {
                done();
            } else {
                done(new Error('数据请求出错1'));
            }
        }).catch(function (error) {
            done(new Error('数据请求出错2'));
        });
    });

    it('interface test2', function (done) {
        axios.get('http://192.168.64.2/basic/web/index.php?r=book%2Fview&id=123').then(function (response) {
            if (response.data) {
                done();
            } else {
                done(new Error('数据请求出错3'));
            }
        }).catch(function (error) {
            done(new Error('数据请求出错4'));
        });
    });
});