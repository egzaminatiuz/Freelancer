$(function(){
  $("#addClass").click(function () {
      $('#message_popup').addClass('popup-box-on');
      var from_user_id=$("#message_popup").data('auth');
      var to_user_id=$("#message_popup").data('userpost');
      socket.emit('list-message',{from_user_id:from_user_id,to_user_id:to_user_id});
  });

  $("#removeClass").click(function () {
      $('#message_popup').removeClass('popup-box-on');
  });
})

var socket=io.connect( 'http://localhost:8080' );

$("#messageForm").submit(function(){
    var from_user_id=$("#message_popup").data('auth');
    var to_user_id=$("#message_popup").data('userpost');
    var username=$("#welcome_user").text();
    var msg=$("#messageInput").val();
    var avatar=$("#user_avatar").attr('src');
    socket.emit('message',
    {
        name:username,message:msg,avatar:avatar,
        from_user_id:from_user_id,to_user_id:to_user_id
    });

    return false;
});

$("#messageInput").on('keydown', function(event) {
    var id=$("#message_popup").data('auth');
    var timeOutTyping=null;
    socket.emit('friend-typing', id);
    clearTimeout();
    timeOutTyping=setTimeout(function(){
        socket.emit('friend-stop-typing',id);
    },2000);

});

socket.on('message' ,function(data){
    var actualContent=$("#messages").html();
    var cur_time=new Date().toTimeString().split(" ")[0];
    var newContent='<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data.name+'</span></div><img alt="message user image" src="'+data.avatar+'" class="direct-chat-img"><div class="direct-chat-text">'+data.message+'</div><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-right">'+cur_time+'</span></div>';
    $("#messages").append(newContent);
});

socket.on('friend-typing' ,function(data){
    $("#message_popup").find('#isTyping').show();
   /* $("#isTyping").show();
*/  setTimeout(2000);
});
socket.on('friend-stop-typing' ,function(data){
    $("#message_popup").find('#isTyping').hide();
    /*$("#isTyping").hide();*/
});