import '../assets/styles/bootstrap.css';
import '../assets/styles/site.css';
import '../assets/styles/index.css';
import '../assets/scripts/utils.js';
import '../components/x-tag/x-insert';
import '../components/x-tag/x-books';


$(function(){
    const new_book_id = $('#new_book_id');
    const new_book_name = $('#new_book_name');
    const new_author = $('#new_author');
    const new_publisher = $('#new_publisher');
    const new_publish_date = $('#new_publish_date');

    const newAddConfirm = () => {
        if (new_book_id.val() && new_book_name.val() && new_author.val() && new_publisher.val() && new_publish_date.val()) {
            return true;
        }
    };

    const request = (req, cb, fail) => {
        $.ajax({
            type: req.type || 'GET',
            url: req.url,
            dataType: "json",
            data: JSON.stringify(req.data),
            success: (res) => {
                debugger;
                cb(res);
            },
            error: (err) => {
                debugger;
                fail(err);
            }
        });
    }


    // 节流点击控制500ms以内一次
    // document.addEventListener('click', _.throttle(() => {
    //     console.log(Math.random());
    // }));

    // function throttle(method, duration){
    //     var  begin = new Date();
    //     console.log('begin:' + begin);
    //     return function(){
    //         var context=this, args=arguments, current=new Date();
    //         console.log('current:' + current);
    //         if(current-begin>=duration){
    //             method.apply(context,args);
    //             begin=current;
    //         }
    //     }
    // }

    // function resizehandler(){
    //     console.log(123);
    // }

    // let ctrlThrottle = throttle(resizehandler, 1000);

    // 节流点击
    $('#newAddBook').click(_.throttle((e) => {
        // $('#newAddBook').click((e) => {
        //     ctrlThrottle();

            
        //     // // if (!newAddConfirm()) {
        //     // //     alert('请完整录入信息！');
        //     // //     return;
        //     // // }
        //     // const url = 'http://192.168.64.2/basic/web/index.php?r=book%2Fcreate';
        //     // const data = {
        //     //     book_id: new_book_id.val(),
        //     //     book_name: new_book_name.val(),
        //     //     author: new_author.val(),
        //     //     publisher: new_publisher.val(),
        //     //     publish_date: new_publish_date.val()
        //     // };
        //     // const reqData = {
        //     //     url: url,
        //     //     data: data,
        //     //     type: 'POST'
        //     // };
        //     // // axios.post(url, data)
        //     // // .then(function (response) {
        //     // //     debugger;
        //     // //     console.log(response);
        //     // // })
        //     // // .catch(function (error) {
        //     // //     debugger;
        //     // //     console.log(error);
        //     // // });

        //     // request(reqData, (res) => {
        //     //     alert(res.message);
        //     // }, (err) => {
        //     //     alert(err.message);
        //     // });
        // });
    }));

    const jump = (path) => {
        location.href = path; 
    }

    $('#tbody a').click((e) => {
        const curr = e.currentTarget;
        const id = curr.attributes['data-id'].value;
        // debugger;
        if (curr.title === 'View') {
            // curr.attributes.data-id
            jump('/view/' + id);
            return;
        }
        if (curr.title === 'Update') {
            jump('/update/' + id);
            return;
        }
        if (curr.title === 'Delete') {
            $.ajax({
                url : "http://192.168.64.2/basic/web/index.php?r=book%2Fdelete",
                type : 'POST',
                data : {"id": id},
                dataType : 'json',
                async : false,
                success : function(data){
                    if(data.status) {
                        window.location.reload();
                    }
                    else {
                        alert("删除失败");
                    }
                },
                error : function(){
                    alert("根本没有传过去");
                }
            });

            // const req = {
            //     url: 'http://192.168.64.2/basic/web/index.php?r=book%2Fdelete',
            //     data: {
            //         id: id
            //     },
            //     type: 'POST'
            // }
            // request(req, (res) => {
            //     alert(1);
            // }, (err) => {
            //     alert(0);
            // });

            // axios.post('http://192.168.64.2/basic/web/index.php?r=book%2Fdelete', {
            //     id: id
            // })
            // .then(function (response) {
            //     debugger;
            //     console.log(response);
            // })
            // .catch(function (error) {
            //     debugger;
            //     console.log(error);
            // });
            return;
        }
    });
});