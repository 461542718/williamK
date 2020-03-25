/**发表评论**/
function post() {
    var questionId = $("#question_id").val();
    var content = $("#comment_content").val();
    commennt2target(questionId,1,content);
}

function commennt2target(targetId,type,content) {
    if (!content){
        alert("不能为空内容~~~");
        return;
    }
    $.ajax({
        type:"POST",
        url:"/comment",
        contentType:'application/json',
        data:JSON.stringify({
            "parentID":targetId,
            "content":content,
            "type":type
        }),
        success:function (response) {
            if (response.code==200){
                window.location.reload();
            }else{
                if(response.code==2003){
                    var isAccepted = confirm(response.message);
                    if(isAccepted){
                        window.open("https://github.com/login/oauth/authorize?client_id=20955ef064c438d1d877&redirect_uri=http://localhost:8080/callback&scope=user&state=1");
                        window.localStorage.setItem("closable",true);
                    }
                }else{
                    alert(response.message);
                }
            }
            console.log(response);
        },
        dataType:"json"
    });
}

function comment(e) {
    var commentId = e.getAttribute("data-id");
    var content = $("#input-"+commentId).val();
    commennt2target(commentId,2,content);
}

/**展开收起二级评论**/
function collapseComments(e) {
    var id = e.getAttribute("data-id");
    var comments = $("#comment-"+id);
    //获取二级评论状态
    var collapse=e.getAttribute("data-collapse");
    if(collapse){
        //折叠二级评论
        comments.removeClass("in");
        e.removeAttribute("data-collapse");
        e.classList.remove("active");
    }else{
    $.getJSON("/comment/"+id,function (data) {
        console.log(data);
        var commentBody=$("comment-body-"+id);
        var items=[];
        $.each( data.data, function( comment ) {
            var c=$("<div/>",{
                "class":"col-lg-12 col-md-12 col-sm-12 col-xs-12 comment-cs",
                html: comment.content
            });

            items.push(c);
        });
        commentBody.append( $("<div/>",{
            "class":"col-lg-12 col-md-12 col-sm-12 col-xs-12 collapse sub-comments",
            "id":"comment-"+id,
            html: items.join( "" )
        }));


        //展开二级评论
        comments.addClass("in");
        //标记展开状态
        e.setAttribute("data-collapse","in");
        e.classList.add("active");
    })
    }
}