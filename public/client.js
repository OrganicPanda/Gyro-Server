(function() {
  'use strict';

  var socket = io.connect()
    , target = document.querySelector('body')
    , debugContainer = document.getElementById('debug')
    , debugMax = 10
    , debugCurrent = 0;

  function debug(message) {
    //debugContainer.innerHTML = message;
    console.log(debugCurrent, message);

    if (debugCurrent++ > debugMax) {
      debugCurrent = 0;
      console.clear();
    }
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
      var transform = 'perspective(0) ' +
        'rotateZ(' + state.alpha + 'deg) ' + // This is right
        'rotateX(' + (state.gamma * -1) + 'deg) ' +
        'rotateY(' + (state.beta * -1) + 'deg)';

      debug(transform);

      target.style.webkitTransform = transform;
  }

  socket.on('message', function(data) {
    var message = JSON.parse(data.message)
      , keys = ['alpha', 'beta', 'gamma']
      , isGyro = keys.every(function(key) {
          return message.hasOwnProperty(key) && !isNaN(parseFloat(message[key]));
        });

    if (isGyro) {
      render(keys.map(function(key) {
        return parseFloat(message[key]);
      }));
    }
  });

  gyro.frequency = 100;
  gyro.startTracking(function(o) {
    socket.emit('message', JSON.stringify(o));
    //render(o);
  });
})();