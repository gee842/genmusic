"use strict";
var DRAW_MODE = "gl.LINE_STRIP";
var SHAPE_VERTEX = 2;
var EMIT_RATE = 1;
var AUTO_ROTATE = [0.2, -0.15	, 0.0];
var particleList = [];
var totalFrames = 0;
var startTime = 0;
var GRAVITY_STRENGTH = 0.00008;
const devianceg = 0.00013;
const deviancev = 0.0005
var bgcolor;
var PARTICLE_LIFE = 420;
var INITIAL_VELOCITY = 0;
var VELOCITY_VARIANCE = 0.1;
var AUTO_ROTATE_TOGGLE = 1;
var AUTO_GRAPHICS_TOGGLE = 1;
var goodcolors = [[0.756814044581918, 0.8998301402603323, 0.9679266571302458],[0.8830010161361136, 0.8199475112490423, 0.9502629477713341],[0.9101770417804709, 0.509333531425307, 0.7402336279114964],[0.7458331614436413, 0.931249527199252, 0.9192908886517672],[0.9287418808400079, 0.9694571582527529, 0.5279026182864326],[0.6195428831247664, 0.6009312616075064, 0.8069316302576754],[0.5138223750273381, 0.7710304427994619, 0.8864446101449144],[0.5600035985188228, 0.5626987170519117, 0.9172330501920598],[0.9323577448061456, 0.845939155944922, 0.8075200824523658]]

var Particle = function (x, y, z, c, t) {
  this.x = x;
  this.y = y + 1.5;
  this.z = z;
  this.v = [0.0, 0.0, 0.0];
  this.c = c;
  this.t = t;
}
var drawGraphics = true;

function clearParticles() {
  for (var i = 0; i <= particleList.length; i++) {
    removal.push(i);
  }
}

function pushParticle(x, y, z, [cr, cg, cb], lifespan) {
  return new Particle(x, y, z, [cr, cg, cb], lifespan);
}

//r * sin(theta) = x, r* sin(90-theta) = y, where theta is 360/voices, and r is radius
function circlePlace(number, min, max, voicelocation, lifespan, totalvoices, radius) {
  let theta = 360.0 / totalvoices;
  let x, y, z, cr, cg, cb;
  let outs = []
  if (voicelocation > PolyUnits.length) {
    voicelocation -= 1;
  }
  for (var i = 0; i < number; i++) {
    x = Math.sin((theta * voicelocation) * Math.PI / 180) * radius;
    y = Math.random() * (max - min) + min
    z = Math.sin((90 - (theta * voicelocation)) * Math.PI / 180) * radius;
    x = Math.random() * (max - min) + min + x
    z = Math.random() * (max - min) + min + z
    cr = PolyUnits[voicelocation].colorred;
    cg = PolyUnits[voicelocation].colorblue;
    cb = PolyUnits[voicelocation].colorgreen;
    outs.push(new Particle(x-0.5, y-1.5, z-0.5, [cr, cg, cb], lifespan));
  }

  return outs;


}

function emitLocation(voicelocation) {
  //get locations
  particleList = particleList.concat(circlePlace(EMIT_RATE, 0.5, -0.5, voicelocation, PARTICLE_LIFE, PolyUnits.length, 2));
}

function randomInitParticles(number, min, max) {
  let outs = [];
  let x, y, z, cr, cg, cb;
  for (var i = 0; i < number; i++) {
    x = Math.random() * (max - min) + min
    y = Math.random() * (max - min) + min
    z = Math.random() * (max - min) + min
    cr = Math.random()
    cg = Math.random()
    cb = Math.random()

    outs.push(new Particle(x, y, z, [cr, cg, cb], PARTICLE_LIFE));
  }
  return outs;
}

function updateParticles(g) {
  var returnlist = [];
  var addqueue = [];
  var removal = [];

  // var returnlist = particleList;
  for (let k = 0; k < particleList.length; k++)
  {
  	if ((particleList[k] != undefined) && (particleList[k] != null))
  	{
  		returnlist.push(particleList[k])
  	}
  }
  if (addqueue.length > 0) {
    returnlist = returnlist.concat(addqueue);
    addqueue = null;
    addqueue = [];
  }

  for (var i = 0; i < returnlist.length; i++) {
  	if (returnlist[i] !== undefined)
  	{
	    returnlist[i].v[1] -= g + (Math.random() - 0.5) * 2 * devianceg;
	    returnlist[i].v[0] -= (Math.random() - 0.5) * 2 * deviancev;
	    returnlist[i].v[2] -= (Math.random() - 0.5) * 2 * deviancev;

	    returnlist[i].x += returnlist[i].v[0];
	    returnlist[i].y += returnlist[i].v[1];
	    returnlist[i].z += returnlist[i].v[2];

	    returnlist[i].t -= 1;


	    if ((returnlist[i].t) <= 0) {
	      removal.push(i);
	    } 			
  	}

  }
  for (var j = 0; j < removal.length; j++) {
    for (var k = 0; k< SHAPE_VERTEX; k++)
    {
      returnlist[j + k] = null;
    }
    returnlist.splice(removal[j], SHAPE_VERTEX);

  }
  removal = null;
  removal = [];
  
  return returnlist;

}

function giveVertexBuffer(particles) {
  if (!particles) return [];
  let outp = [];
  try
  	{
	  for (var i = 0; i < particles.length; i++) {
	  	if (particles[i] !== undefined)
	  	{
	  	outp.push(particles[i].x);
	    outp.push(particles[i].y);
	    outp.push(particles[i].z);
	    outp.push(particles[i].c[0]);
	    outp.push(particles[i].c[1]);
	    outp.push(particles[i].c[2]);
	  	}
	 
	  }
	}
	catch(e)
	{
		return []
	}
  return outp;
}


function giveParticleOrder(particles) {
  if (!particles) return [];
  let out = [];
  for (var i = 0; i < particles.length; i++) {
    out.push(i);
  }
  return out;
}


function randomVelocities(particles, min, max) {
  for (var i = 0; i < particles.length; i++) {

    particles[i].v[0] = Math.random() * (max - min) + min;
    particles[i].v[1] = Math.random() * (max - min) + min;
    particles[i].v[2] = Math.random() * (max - min) + min;
  }
}



var vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{',
  'fragColor=vertColor;',
  'gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  'gl_PointSize = 4.0;',
  '}'
].join('\n');

var fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  'gl_FragColor=vec4(fragColor,1.0);',
  '}'
].join("\n");


var graphics_loop
var glmatrix_library = mat4;
var boxVertices;
var vertexShader;
var fragmentShader;
var InitDemo = function () {



  const canvas = document.querySelector('#glCanvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    gl = canvas.getContext('experimental-webgl');
  }



  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
  gl.lineWidth(1);

  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  //creates a program:

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR compiling program!', gl.getProgramInfoLog(program));
    return;
  }

  boxVertices = giveVertexBuffer(particleList);
  var boxIndices = giveParticleOrder(particleList);

  var boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

  var boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    positionAttribLocation, //attribute location
    3, //number of elements per attribute
    gl.FLOAT, //type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, //number of bytes 4*2
    //size of an indiviudal vertexShader
    0 //offset from beginning of a single vertex to this attribute
  )
  gl.vertexAttribPointer(
    colorAttribLocation, //attribute location
    3, //number of elements per attribute
    gl.FLOAT, //type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, //number of bytes 4*2
    //size of an indiviudal vertexShader
    3 * Float32Array.BYTES_PER_ELEMENT //offset from beginning of a single vertex to this attribute
  )

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.useProgram(program);

  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  glmatrix_library.identity(worldMatrix);
  glmatrix_library.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
  glmatrix_library.perspective(projMatrix, 0.7853981633974483, canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


  var identityMatrix = new Float32Array(16);
  glmatrix_library.identity(identityMatrix);
  bgcolor = goodcolors[Math.floor(Math.random()*goodcolors.length)];
  gl.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], 1.0);
  var angle = 0;
  //MAIN RENDER LOOP
  graphics_loop = function () {
    drawGraphics = document.getElementById('drawgraphics').checked;
    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    if (drawGraphics){
      if (AUTO_ROTATE_TOGGLE) {

        angle = performance.now() / 2000 / 6 * 2 * Math.PI;
        glmatrix_library.rotate(worldMatrix, identityMatrix, angle, [AUTO_ROTATE[0], AUTO_ROTATE[1], AUTO_ROTATE[2]]);
      }

      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      particleList = updateParticles(GRAVITY_STRENGTH);

      boxVertices = giveVertexBuffer(particleList);
      boxIndices = giveParticleOrder(particleList);

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

      gl.drawElements(eval(DRAW_MODE), boxIndices.length, gl.UNSIGNED_SHORT, 0);

    }
    else{
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }
      let graphicstimeout = setTimeout(() => {
        window.requestAnimationFrame(graphics_loop);
        angle = null;
        clearTimeout(graphicstimeout);
        graphicstimeout = null;
      }, 10);
    
    
  };
  window.requestAnimationFrame(graphics_loop);

};