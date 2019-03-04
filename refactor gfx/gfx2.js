
var DRAW_MODE = "gl.LINE_STRIP";
var SHAPE_VERTEX = 2;
var EMIT_RATE = 1;
var AUTO_ROTATE = [0.0,0.0,0.0];
var particleList = [];
var addqueue = [];
var totalFrames = 0;
var startTime = 0;
var GRAVITY_STRENGTH = 0.0009;
const devianceg = 0.0005;
const deviancev = 0.003
const seed = 25565;

var removal = [];
var PARTICLE_LIFE = 130;
var INITIAL_VELOCITY = 0;
var VELOCITY_VARIANCE = 0.015;
var EMIT_COLOR = [0.4,0.0,0.7];

var Particle = function(x,y,z,c,t){
  this.x = x;
  this.y = y;
  this.z = z;
  this.v = [0.0,0.0,0.0];
  this.c = c;
  this.t = t;
}


function emitTriangle()
{
  particleList = particleList.concat(randomInitParticles(EMIT_RATE,1.2,-1.2));
}



function randomInitParticles(number,min,max)
{

  outs = [];

  for (var i = 0; i < number; i++) {
    x = Math.random() * (max - min) + min
    y = Math.random() * (max - min) + min
    z = Math.random() * (max - min) + min
    cr = Math.random()
    cg = Math.random()
    cb = Math.random()

    outs.push(new Particle(x,y,z,[cr,cg,cb],PARTICLE_LIFE));
  }
  return outs;
}


function updateParticles(g)
{


  if (addqueue.length > 0)
  {
    particleList = particleList.concat(addqueue);
    addqueue = [];
  }

  for (var i = 0; i < particleList.length; i++) {
    particleList[i].v[1] -= g + (Math.random() - 0.5) * 2 * devianceg;
    particleList[i].v[0] -= (Math.random() - 0.5) * 2 * deviancev;
    particleList[i].v[2] -= (Math.random() - 0.5) * 2 * deviancev;

    particleList[i].x += particleList[i].v[0];
    particleList[i].y += particleList[i].v[1];
    particleList[i].z += particleList[i].v[2];

    particleList[i].t -= 1;


    if ((particleList[i].t) <= 0)
    {
      removal.push(i);
    }
  }
  for (var j = 0; j < removal.length; j++) {
    particleList.splice(removal[j],SHAPE_VERTEX);

  }
  removal = [];

}