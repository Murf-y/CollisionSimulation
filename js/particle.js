class Particle{
    constructor(context, x, y, radius, color, vel_x_factor, vel_y_factor){
        this.position = {
            x: x,
            y: y
        };
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: Math.random() * vel_x_factor + 1,
            y: Math.random() * vel_y_factor + 1
        }
        this.accerleration = {
            x: 0,
            y: 0
        }
        this.mass = radius;
        this.context = context;
    }
    draw(){
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
    update(delta_t){
        this.velocity.x += this.accerleration.x * delta_t;
        this.velocity.y += this.accerleration.y * delta_t;
        this.position.x += this.velocity.x * delta_t;
        this.position.y -= this.velocity.y * delta_t;
    }
}

export default Particle;