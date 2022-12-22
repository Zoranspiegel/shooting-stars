const canvas = document.getElementById("layer1");
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");

///CLASSES
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
}

class Projectile {
  constructor(x, y, radius, color, mX, mY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mX = mX;
    this.mY = mY;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
    this.x += this.mX;
    this.y += this.mY;
  }
}

class Enemy {
  constructor(x, y, radius, color, mX, mY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mX = mX;
    this.mY = mY;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
    this.x += this.mX;
    this.y += this.mY;
  }
}

class Particle {
  constructor(x, y, radius, color, mX, mY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mX = mX;
    this.mY = mY;
    this.alpha = 1;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.draw();
    this.alpha -= 0.01;
    this.x += this.mX;
    this.y += this.mY;
  }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 20, "yellow");
const projectiles = [];
const enemies = [];
const particles = [];

//SPAWN_ENEMIES
let spawnId;
function spawnEnemies() {
  spawnId = setInterval(() => {
    const radius = Math.random() * (40 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360},40%,40%)`;
    const angle = Math.atan2(player.y - y, player.x - x);
    const mX = Math.cos(angle);
    const mY = Math.sin(angle);
    enemies.push(new Enemy(x, y, radius, color, mX, mY));
  }, 2000);
}
spawnEnemies();

///ANIMATION_FRAMES
function animate() {
  const animationFrameId = requestAnimationFrame(animate);
  //Clean Canvas
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //Render Projectiles
  projectiles.forEach((p, i) => {
    //Projectile/Enemy collision//////////////////////
    enemies.forEach((e, j) => {
      const dist = Math.hypot(p.x - e.x, p.y - e.y);
      if (dist - p.radius - e.radius <= 0) {
        //SPAWN_PARTICLES////////////////////
        for (let i = 0; i < e.radius * 2; i++) {
          const radius = Math.random() * (3 - 1) + 1;
          const mX = (Math.random() - 0.5) * 3;
          const mY = (Math.random() - 0.5) * 3;
          particles.push(new Particle(p.x, p.y, radius, e.color, mX, mY));
        }
        /////////////////////////////////////
        projectiles.splice(i, 1);
        enemies.splice(j, 1);
      }
    });
    //////////////////////////////////////////////////
    //Clean or Render
    if (
      p.x < 0 ||
      p.x > canvas.width ||
      p.y < 0 ||
      p.y > canvas.height
    ) {
      projectiles.splice(i, 1);
    } else {
      p.update();
    }
  });
  //Render Enemies
  enemies.forEach((e, j) => {
    //Enemy/Player collision/////////////////////////////////
    const dist = Math.hypot(e.x - player.x, e.y - player.y);
    if (dist - e.radius - player.radius <= 0) {
      cancelAnimationFrame(animationFrameId);
    }
    /////////////////////////////////////////////////////////
    e.update();
  })
  //Render Particles
  particles.forEach((pt, i) => {
    if (pt.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      pt.update();
    }
  })
  //Render Player
  player.draw();
}
animate();

///EVENT_LISTENERS
addEventListener("click", (e) => {
  const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
  const mX = Math.cos(angle) * 5;
  const mY = Math.sin(angle) * 5;
  projectiles.push(new Projectile(player.x, player.y, 5, "red", mX, mY));
});