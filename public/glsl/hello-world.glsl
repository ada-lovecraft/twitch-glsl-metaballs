#define MAX_BALLS 100

precision highp float;
uniform vec2 resolution;
uniform float time;


struct Ball {
  vec2 pos;
  float radius;
  vec2 velocity;
  vec4 color;
  float size;
};


uniform Ball balls[4];
uniform Ball mouseBall;


const float threshold = 0.0004;
const float goo = 20.0;
Ball errorBall = Ball(vec2(-100.0), -1.0, vec2(0.0), vec4(-1.), -1.0);

vec2 ratio = resolution.xy / resolution.x;

bool inCircle(vec2 p, Ball b) {
  if(distance(p, b.pos * ratio) < b.radius) {
    return true;
  }
  return false;
}

void inField(vec2 p, Ball ball1, out Ball ball2) {
  
  for(int i = 0; i < 5; i++) {
    if(i == 4) {
      ball2 = mouseBall;
    } else {
      ball2 = balls[i];
      if(ball2 == ball1) {
        continue;
      }
    }
    float dx1 = (ball1.pos.x * ratio.x - p.x) * (ball1.pos.x * ratio.x - p.x);
    float dy1 = (ball1.pos.y * ratio.y - p.y) * (ball1.pos.y * ratio.y - p.y);
    float dx2 = (ball2.pos.x * ratio.x- p.x) * (ball2.pos.x * ratio.x - p.x);
    float dy2 = (ball2.pos.y * ratio.y - p.y) * (ball2.pos.y * ratio.y - p.y);
    float div1 = pow(sqrt(dx1 + dy1), goo);
    float div2 = pow(sqrt(dx2 + dy2), goo);
    if((ball1.size / div1) + (ball2.size / div2) > threshold) {
      return;
    }
  }
  ball2 = errorBall;
}

void main() {
  
  vec4 col = vec4(1.0,1.0,1.0,1.0);
  vec2 p = gl_FragCoord.xy/resolution.xy * ratio;

  Ball ball;
  
  vec4 outColor = vec4(1., 1., 1.,1.);
  for(int i = 0; i <= 4; i++) {
    ball = balls[i];
    Ball ball2;  
    inField(p, ball, ball2);
    if(ball2 != errorBall) {
      col = mix(ball.color, ball2.color, distance(ball.pos, ball2.pos));
      break;
    }
    
  }
  gl_FragColor = col;

}