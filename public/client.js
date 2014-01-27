(function() {
  'use strict';

  var socket = io.connect()
    , target = document.getElementById('target')
    , debugContainer = document.getElementById('debug');

  function debug(message) {
    debugContainer.innerHTML = message;
  }

  function render(state) {
      // «alpha» - This is rotation about the Z axis.
      //           In other words left and right rotation.
      // «beta»  - This is rotation about the X axis.
      //           This means how much you are tilting the device towards you.
      // «gamma» - This is the rotation about the Y axis,
      //           or the angle of the device screen if you may.
      // From http://kinderas.blogspot.co.uk/
      //      2011/06/accessing-gyroscope-and-accelerometer.html
      target.style.webkitTransform = 'perspective(0) ' +
        'rotateZ(' + state.alpha + 'deg) ' +
        'rotateX(' + state.beta + 'deg) ' +
        'rotateY(' + state.gamma + 'deg)';
  }

  socket.on('message', function(data) {
    debug(data.message);

    var message = JSON.parse(data.message)
      , isGyro = ['alpha', 'beta', 'gamma'].every(function(key) {
          return message.hasOwnProperty(key);
        });

    if (isGyro) {
      render(message);
    }
  });

  gyro.frequency = 100;
  gyro.startTracking(function(o) {
    socket.emit('message', JSON.stringify(o));
    render(o);
  });
})();