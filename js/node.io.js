    var socket = io.connect();
    var username = $('#usr');
    var users = $('#user-list');
    socket.io.emit('get users');
    $('#send-form').hide();
    $('.message-form').submit(function(){
          socket.emit('message', $('#message-in').val());
          $('#message-in').val('');
          return false;
        });
    socket.on('message', function(data){

      $('#'+data.user).append($('<div class="massage">'+ data.msg + '</div>')).fadeIn(1500);
      fade();
    });
    function fade(){
    $(".massage").delay(5000).fadeOut(300);
    }

    $("#user-form").submit(function(e){
      e.preventDefault();
      socket.emit('new user', $(username).val(), function(data){
      if (data) {
        $('#usr-spot').fadeOut(1500);
        $('#instructions').fadeOut(750);
        $('#send-form').fadeIn(1500);
      }
      });
      $(username).val('');
    });
    socket.on('get users', function(data){
      if(data != null){
      $('#message-spot').append($('<div class="col-sm-5 message-out" id="'+data+'">'+data+'</div>')).fadeIn(1500);
          }
    });