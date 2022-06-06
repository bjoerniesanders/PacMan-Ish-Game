const canvas = document.querySelector('canvas');
const elScore = document.getElementById('score');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
    static height = 40;
    static width = 40;
    constructor({position}) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    };

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
};

class Player { 
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    };
    draw() { 
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'green';
        c.fill();
        c.closePath();
    };
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
};

class Pellets { 
    constructor({ position }) {
        this.position = position;
       
        this.radius = 3;
    };
    draw() { 
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
    };
};

const pellets = [];
const boundaries = [];
const player = new Player({
    position: {
        x: Boundary.height + Boundary.height / 2,
        y: Boundary.width + Boundary.width / 2,
    },
    velocity: {
        x: 0,
        y: 0
    }
});
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
};

let lastKey = '';
let score = 0;

const map = [
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '-', '.', '-', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '-'],
    ['-', '-', '-', '-', '-', '-', '-'],
];

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.height * j,
                        y: Boundary.width * i
                    }
                }))
                break;
            case '.':
                   pellets.push(new Pellets({
                    position: {
                        x: Boundary.height * j + Boundary.width / 2,
                        y: Boundary.width * i + Boundary.height / 2
                    }
                }))
                break;
        }
    })
});

function pacmanCollidewithBorder({pacman, border}) {
    return (
        pacman.position.y - pacman.radius + pacman.velocity.y <= border.position.y + border.height &&
            pacman.position.x + pacman.radius + pacman.velocity.x >= border.position.x &&
            pacman.position.y + pacman.radius + pacman.velocity.y >= border.position.y &&
            pacman.position.x - pacman.radius + pacman.velocity.x <= border.position.x + border.width
    )
}

function CollideCheck(x, y) {
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (pacmanCollidewithBorder({
            pacman: {
                ...player,
                velocity: {
                    x: x,
                    y: y
                }
            },
            border: boundary
        })
        ) {
            if (y != 0) {
                player.velocity.y = 0;
            } else if (x != 0) {
                player.velocity.x = 0;
            }
            break;
            
            
        } else {
            if (y != 0) {
                player.velocity.y = y;
            } else if (x != 0) {
                player.velocity.x = x;
            }
        }
    }
}



function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (keys.w.pressed && lastKey === 'w') {
        CollideCheck(0, -5);
    };
    if (keys.s.pressed && lastKey === 's') {
        CollideCheck(0, 5);
    };
    if (keys.a.pressed && lastKey === 'a') {
        CollideCheck(-5, 0);
    };
    if (keys.d.pressed && lastKey === 'd') {
       CollideCheck(5, 0);
    };
    
    pellets.slice().reverse().forEach(pellet => {
        pellet.draw();
        

        if (Math.hypot(player.position.x - pellet.position.x, player.position.y - pellet.position.y) <= player.radius + pellet.radius) {
            pellets.splice(pellets.indexOf(pellet), 1);
            score++;
            elScore.innerHTML = score -1;
        
        }
    }
    );
  
  
    boundaries.forEach((boundary) => {
        boundary.draw()
        if (
            pacmanCollidewithBorder({
                pacman: player,
                border: boundary
            })
        ) 
        {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
});

    player.update();
 
   
};

animate();

addEventListener('keydown', ({key}) => {
    
    switch (key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
  
});

addEventListener('keyup', ({key}) => {
    
    switch (key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
  
});
