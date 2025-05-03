let animationSpeed = 1;
let rotationCount = 0;
let lastTime = Date.now();

function toggleMadeInHeaven() {
    animationSpeed = animationSpeed === 1 ? 50 : 1;
    lastTime = Date.now();
    document.getElementById('madeInHeavenBtn').classList.toggle('active');
    document.body.classList.toggle('mih-effect');
}

function initAnimation() {
    const canvas = document.getElementById('animationCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    function getSunColor() {
        const now = new Date();
        const hours = now.getHours();
        
        // Yellow during peak hours (8AM-3PM), Orange rest of the time
        return (hours >= 8 && hours < 15) ? '#ffffff' : '#c97f00';
    }

    function drawSun() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background (always dark to see the ring)
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw concentric rings
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;

        // Draw orbit ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Calculate sun position with continuous rotation
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastTime) / 16; // Use consistent time step
        lastTime = currentTime;

        // Update rotation based on animation speed
        rotationCount += deltaTime * (animationSpeed / 100);

        // Calculate final angle
        const angle = (rotationCount % (Math.PI * 2)) + Math.PI/2;
        
        const sunX = centerX + Math.cos(angle) * radius;
        const sunY = centerY + Math.sin(angle) * radius;

        // Draw sun
        const sunRadius = 30;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = getSunColor();
        ctx.fill();

        requestAnimationFrame(drawSun);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    drawSun();
}

window.onload = () => {
    initAnimation();
    window.toggleMadeInHeaven = toggleMadeInHeaven;
};
