import Particle from "../js/particle.js";
import getRandomColor from "../js/colors.js";
const canvas = document.getElementById("canvas");
const navbar = document.getElementById("navbar");
const particle_numbers_box = document.getElementById("particlesNumberBox");
const particle_numbers_range = document.getElementById("particlesNumberSlider");
const particle_xvel_range = document.getElementById("particlesXVelSlider");
const particle_xvel_box = document.getElementById("particlesXVelBox");
const particle_yvel_range = document.getElementById("particlesYVelSlider");
const particle_yvel_box = document.getElementById("particlesYVelBox");
const gravity_checkbox = document.getElementById("gravity");
const FPS = 60


var context = canvas.getContext("2d");
var particles = [];
var random_x_velocity_factor = particle_xvel_box.value;
var random_y_velocity_factor = particle_yvel_box.value;
function handleBoxCollision(particle){
    // continous collision detection
    if(particle.position.x - particle.radius < 0){
        particle.position.x = particle.radius;
        particle.velocity.x *= -1;
    }
    if(particle.position.x + particle.radius > canvas.width){
        particle.position.x = canvas.width - particle.radius;
        particle.velocity.x *= -1;
    }
    if(particle.position.y - particle.radius < 0){
        particle.position.y = particle.radius;
        particle.velocity.y *= -1;
    }
    if(particle.position.y + particle.radius > canvas.height){
        particle.position.y = canvas.height - particle.radius;
        particle.velocity.y *= -1;
    }

}
function dot_product(vector_1, vector_2){
    return vector_1.x * vector_2.x + vector_1.y * vector_2.y;
}
function handleParticleCollision(particle1, particle2){
    var normal_vector = {
        x: particle2.position.x - particle1.position.x,
        y: particle2.position.y - particle1.position.y
    }
    var un_vector = {
        x: normal_vector.x / Math.sqrt(Math.pow(normal_vector.x, 2) + Math.pow(normal_vector.y, 2)),
        y: normal_vector.y / Math.sqrt(Math.pow(normal_vector.x, 2) + Math.pow(normal_vector.y, 2))
    }
    var ut_vector = {
        x: -un_vector.y,
        y: un_vector.x
    }

    var v1_n = dot_product(particle1.velocity, un_vector);
    var v2_n = dot_product(particle2.velocity, un_vector);
    var v1_t = dot_product(particle1.velocity, ut_vector);
    var v2_t = dot_product(particle2.velocity, ut_vector);

    var v1_n_new = (v1_n * (particle1.mass - particle2.mass) + 2 * particle2.mass * v2_n) / (particle1.mass + particle2.mass);
    var v2_n_new = (v2_n * (particle2.mass - particle1.mass) + 2 * particle1.mass * v1_n) / (particle1.mass + particle2.mass);

    particle1.velocity.x = v1_n_new * un_vector.x + v1_t * ut_vector.x;
    particle1.velocity.y = v1_n_new * un_vector.y + v1_t * ut_vector.y;
    particle2.velocity.x = v2_n_new * un_vector.x + v2_t * ut_vector.x;
    particle2.velocity.y = v2_n_new * un_vector.y + v2_t * ut_vector.y;
}

        
function update(delta_t){
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < particles.length; i++){
        // collision detection between a particle and the walls
        handleBoxCollision(particles[i]);

        // collision detection between particles
        for(var j = 0; j < particles.length; j++){
            if(i != j){
                var distance = Math.sqrt(Math.pow(particles[i].position.x - particles[j].position.x, 2) + Math.pow(particles[i].position.y - particles[j].position.y, 2));
                if(distance < particles[i].radius + particles[j].radius){
                    handleParticleCollision(particles[i], particles[j]);
                }
            }
        }
        particles[i].update(delta_t);
        particles[i].draw();
    }
}

function init_particles(){
    var particle_numbers = particle_numbers_box.value;
    particles = []
    for(var i = 0; i < particle_numbers; i++){
        particles.push(new Particle(
            context, 
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 10 + 5,
            getRandomColor(), 
            random_x_velocity_factor,
            random_y_velocity_factor)
        );
    }
}
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - navbar.clientHeight;
}
function change_x_vel(){
    var new_x_vel = particle_xvel_range.value;
    for(var i = 0; i < particles.length; i++){
        particles[i].velocity.x = (Math.random() * new_x_vel) + 1;
    }
    random_x_velocity_factor = new_x_vel;
}
function change_y_vel(){
    var new_y_vel = particle_yvel_range.value;
    for(var i = 0; i < particles.length; i++){
        particles[i].velocity.y = (Math.random() * new_y_vel) + 1;
    }
    random_y_velocity_factor = new_y_vel;
}
function change_gravity(){
    console.log("changing gravity" + gravity_checkbox.checked);
    if(gravity_checkbox.checked){
        for(var i = 0; i < particles.length; i++){
            particles[i].accerleration.y = -500;
        }
    }
    else{
        for(var i = 0; i < particles.length; i++){
            particles[i].accerleration.y = 0;
        }
    }
}
function main(){
    var delta_t = 1/FPS;
    resize();
    init_particles();
    setInterval(() => update(delta_t), delta_t * 1000);
}
particle_numbers_range.addEventListener("input", () => {
    init_particles();
});
particle_numbers_box.addEventListener("input", () => {
    init_particles();
});
particle_xvel_range.addEventListener("input" , () => {
    change_x_vel();
})
particle_xvel_box.addEventListener("input", () => {
    change_x_vel();
})
particle_yvel_range.addEventListener("input" , () => {
    change_y_vel();
})
particle_yvel_box.addEventListener("input", () => {
    change_y_vel();
})
gravity_checkbox.addEventListener("change", () => {
    change_gravity();
})
window.addEventListener('resize', resize, false); 
main()
