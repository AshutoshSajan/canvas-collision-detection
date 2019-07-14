// two object collision

// var canvas = document.querySelector("canvas");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// const c = canvas.getContext('2d');

// let mouse = {
// 	x: innerWidth / 2,
// 	y: innerHeight / 2
// };

// const colors = [];

// addEventListener('mousemove', function(e){
// 	mouse.x = e.clientX;
// 	mouse.y = e.clientY;
// });

// addEventListener('resize', function(){
// 	canvas.width = innerWidth;
// 	canvas.height = innerHeight

// 	init();
// });

// // utility functions

// function getDistance(x1, y1, x2, y2){
// 	let xDistance = x2 - x1;
// 	let yDistance = y2 - y1;

// 	return Math.sqrt(Math.pow (xDistance, 2) + Math.pow(yDistance, 2));
// }

// function Circle(x, y, radius, color){
// 	this.x = x;
// 	this.y = y;
// 	this.radius = radius;
// 	this.color = color;
// 	this.update = function(){
// 		this.draw();
// 	};

// 	this.draw = function(){
// 		c.beginPath();
// 		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
// 		c.fillStyle = this.color;
// 		c.fill();
// 		c.closePath();
// 	}
// }

// // implementation
// let circle1;
// let circle2;
// function init() {
// 	circle1= new Circle(300, 300, 100, "black");
// 	circle2= new Circle(undefined, undefined, 30, "green");
// }

// // animation loop
// function animate(){
// 	requestAnimationFrame(animate);
// 	c.clearRect(0, 0, canvas.width, canvas.height);
// 	// c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);
// 	circle1.update();
// 	circle2.x = mouse.x;
// 	circle2.y = mouse.y; 
// 	circle2.update();

// 	if(getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < circle1.radius + circle2.radius){
// 		circle1.color = 'red';
// 	}else {
// 		circle1.color = 'black';
// 	}
// }

// init();
// animate();

// multi paticles collision detection
// ========================================================
let particles;
let circle2;
const colors = [
'#2185c5',
'#7ecefd',
'#fff6e5',
'#ff7f66'
];

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

let mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
};


addEventListener('mousemove', function(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

addEventListener('resize', function(){
	canvas.width = innerWidth;
	canvas.height = innerHeight

	init();
});

// utility functions
function randomColor(color){
	return color[Math.floor(Math.random() * colors.length)];
}

function rotate(velocity, angle){
	const rotatedVelocities = {
		x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
		y: velocity.x * Math.sin(angle) - velocity.y * Math.cos(angle),
	}
	return rotatedVelocities;
}

function resolveCollision(particle, otherParticle){
	const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
	const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

	const xDist = otherParticle.x - particle.x;
	const yDist = otherParticle.y - particle.y;

	if(xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){

		const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x)
		
		const m1 = particle.mass;
		const m2 = otherParticle.mass;

		// velocity before equation
		const u1 = rotate(particle.velocity, angle);
		const u2 = rotate(otherParticle.velocity, angle);

		// velocity after 1d collision equation
		const v1 = {x: u1.x * (m1 -m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
		const v2 = {x: u2.x * (m1 -m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};

		// final velocity after rotating axis back to original location
		const vFinal1 = rotate(v1, -angle);
		const vFinal2 = rotate(v2, -angle);

		// swap particle velocities for realistic bounce effect
		particle.velocity.x = vFinal1.x;
		particle.velocity.y = vFinal1.y;

		otherParticle.velocity.x = vFinal2.x;
		otherParticle.velocity.y = vFinal2.y;
	}
}

function randomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function distance(x1, y1, x2, y2){
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	return Math.sqrt(Math.pow (xDistance, 2) + Math.pow(yDistance, 2));
}

// objects
function Paticle(x, y, radius, color){
	this.x = x;
	this.y = y;
	this.velocity = {
		x: (Math.random() - 0.5) * 5,
		y: (Math.random() - 0.5) * 5
	}
	this.radius = radius;
	this.color = color;
	this.mass = 1;
	this.opacity = 0;

	this.update = particles => {
		this.draw();

		for(let i =0; i < particles.length; i++){
			if (this === particles[i]) continue;
			if(distance(this.x, this.y, particles[i].x , particles[i].y) - this.radius * 2 < 0){
				resolveCollision(this, particles[i]);
			}
		}

		if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth){
			this.velocity.x = -this.velocity.x;
		}
		if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight){
			this.velocity.y = -this.velocity.y;
		}

		// mouse collision detection
		if(distance(mouse.x, mouse.y, this.x, this.y) < 120 && this.opacity < 0.2){
				this.opacity += 0.02;
		}else if (this.opacity > 0){
			this.opacity -= 0.02;
			this.opacity = Math.max(0, this.opacity);
		}
			this.x += this.velocity.x;
			this.y += this.velocity.y;
	}

	this.draw = function(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.save();
		c.globalAlpha = this.opacity;
		c.fillStyle = this.color;
		c.fill();
		c.restore();
		c.strokeStyle = this.color;
		c.stroke();
		c.closePath();
	}
}

// implementation

function init() {
	particles = [];

	for(var i = 0; i < 100; i++){
		const radius = 10;
		// let x = Math.random() * innerWidth;
		// to make sure that cicles are within the canvas
		let x = randomIntFromRange(radius, canvas.width - radius);

		// let y = Math.random() * innerHeight;
		let y = randomIntFromRange(radius, canvas.height - radius);

		color = randomColor(colors);

		if (i !== 0){
			for(let j = 0; j < particles.length; j++){
				if(distance(x, y, particles[j].x , particles[j].y) - radius * 2 < 0){
					// x = Math.random() * innerWidth;
					// y = Math.random() * innerHeight;
					x = randomIntFromRange(radius, canvas.width - radius);
					y = randomIntFromRange(radius, canvas.height - radius);

					j = -1;
				}
			}
		}
		particles.push(new Paticle(x, y , radius, color));
	}
}

// animation loop
function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	particles.forEach(particle => {
		particle.update(particles);
	})
}

init();
animate();
