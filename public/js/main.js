$(document).ready(function() {
  console.log('ready');

  var canvas = document.getElementById('game');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  function Vec2(x,y) {
    this.x = x || 0.0;
    this.y = y || x || 0.0; 
  }

  function Color(r,g,b,a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  function Ball(pos, radius, velocity, color) {
    this.pos = pos;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
    this.size = radius * 0.000000000000000000000000001;
  }

  Ball.prototype = {
    update: function(time, deltaTime) {
      this.pos.x += this.velocity.x / deltaTime;
      this.pos.y += this.velocity.y / deltaTime;

      if(this.pos.x >= 1.0) {
        this.pos.x = 1.0;
        this.velocity.x *= -1.0;
      }
      if(this.pos.y >= 1.0) {
        this.pos.y = 1.0;
        this.velocity.y *= -1.0;
      }
      if(this.pos.x <= 0.0) {
        this.pos.x = 0.0;
        this.velocity.x *= -1.0;
      }
      if(this.pos.y <= 0.0) {
        this.pos.y = 0.0;
        this.velocity.y *= -1.0;
      }
    }
  };


  var colors = {
    RED: new Color(1.0, 0.0, 0.0, 1.0),
    GREEN: new Color(0.0, 1.0, 0.0, 1.0),
    BLUE: new Color(0.0, 0.0, 1.0, 1.0),
    MAGENTA: new Color(1.0, 0.0, 1.0, 1.0),
    BLACK: new Color(0.0,0.0,0.0,1.0)
  };

  var pos, radius, velocity;



  

  
  var balls = _.map(_.range(0,4), function(i) {
    pos = new Vec2(Math.random(), Math.random());
    radius = Math.random() / 10.0;
    velocity = new Vec2(Math.random()/ 20.0, Math.random() / 20.0);
    console.log('pos:',pos);
    return new Ball(pos, radius, velocity, colors[_.keys(colors)[i]]);
  });
  
  var mouseBall = new Ball(new Vec2(0.5), 0.10, new Vec2(0.5), colors.BLACK);
  
  console.log('balls:', _.pluck(balls, 'color'));
  
  
  $.ajax({
    url: 'glsl/hello-world.glsl',
    dataType: 'text',
    success: function(data) {
      loadGLSL(data);
    }
  });

  $(document).on('mousemove', function(event) {
    mouseBall.pos.x = (event.pageX/window.innerWidth);
    mouseBall.pos.y = 1 - (event.pageY / window.innerHeight);
  });

  function loadGLSL(shader) {
    Glsl({
      canvas: document.getElementById('game'),
      fragment: shader,
      variables: {
        time: 0,
        mouseBall: mouseBall,
        balls: balls
      },
      update: function(time, delta) {
        
        balls.forEach(function(ball) {
          ball.update(time, delta);  
        });
        
        this.set('time', time);
        this.set('balls', balls);
        this.set('mouseBall', mouseBall);
        

      }
    })
    .start();
  }
});

console.log('not ready');