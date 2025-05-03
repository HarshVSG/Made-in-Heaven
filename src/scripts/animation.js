let animationSpeed = 1;
let rotationCount = 0;
let lastTime = Date.now();
let targetSpeed = 1;
let currentSpeed = 1;
let accelerating = false;
let startAngle = 0;
let totalRotations = 0;

function getTimeAngle() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Adjust calculation so that:
    // 6 AM (6) = 0 (extreme left)
    // 12 PM (12) = PI/2 (top)
    // 6 PM (18) = PI (extreme right)
    // 12 AM (0) = 3PI/2 (bottom)
    return ((hours + minutes/60 - 6) * (Math.PI / 12));
}

function toggleMadeInHeaven() {
    if (targetSpeed === 1) {
        // Starting Made in Heaven
        startAngle = getTimeAngle();
        rotationCount = 0;
        totalRotations = 0;
        targetSpeed = 50;
    } else {
        // Ending Made in Heaven
        targetSpeed = 1;
    }
    
    accelerating = true;
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
        
        if (hours >= 10 && hours < 14) {
            return '#FFE87C'; // Bright yellow at midday
        } else if (hours >= 6 && hours < 10) {
            return '#FFB246'; // Morning orange
        } else if (hours >= 14 && hours < 18) {
            return '#FFB246'; // Afternoon orange
        } else {
            return '#FF7F50'; // Deep orange/red for evening/night
        }
    }

    function drawSun() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        // Move the center Y position closer to the bottom of the screen
        const centerY = canvas.height + Math.min(canvas.width, canvas.height) * 0.25;
        const radius = Math.min(canvas.width, canvas.height) * 0.9;  // Increased radius for bigger orbit

        // Draw orbit ring (only the visible part)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;  // Made the orbit line slightly thicker
        ctx.stroke();

        // Calculate base angle from current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Update speed with smooth acceleration
        if (accelerating) {
            const speedDiff = targetSpeed - currentSpeed;
            if (Math.abs(speedDiff) > 0.1) {
                currentSpeed += speedDiff * 0.01; // Adjust this value to change acceleration rate
            } else {
                currentSpeed = targetSpeed;
                accelerating = false;
            }
        }

        // Use currentSpeed instead of animationSpeed
        let angle;
        if (currentSpeed === 1) {
            angle = getTimeAngle();
        } else {
            const currentTime = Date.now();
            const deltaTime = (currentTime - lastTime) / 16;
            lastTime = currentTime;
            
            if (accelerating) {
                const speedDiff = targetSpeed - currentSpeed;
                if (Math.abs(speedDiff) > 0.1) {
                    currentSpeed += speedDiff * 0.02;
                } else {
                    currentSpeed = targetSpeed;
                    if (targetSpeed === 1) {
                        // Returning to normal speed
                        angle = getTimeAngle();
                        accelerating = false;
                    }
                }
            }
            
            rotationCount += deltaTime * (currentSpeed / 100);
            angle = startAngle + rotationCount;
        }

        // Calculate the sun's angle and ensure it's in the correct range
        const sunAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        
        // Draw sun
        const sunX = centerX - Math.cos(sunAngle) * radius;  // Note the negative cosine to flip the direction
        const sunY = centerY - Math.sin(sunAngle) * radius;  // Note the negative sine to maintain correct height
        
        // Only draw the sun if it's in the visible part of the orbit (above the horizon)
        if (sunY < canvas.height) {
            // Draw sun with glow
            const sunRadius = 45;  // Increased sun size
            const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 1.5);
            gradient.addColorStop(0, getSunColor());
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
            ctx.fillStyle = getSunColor();
            ctx.fill();
        }

        // Calculate moon's angle (exactly opposite to sun)
        const moonAngle = (sunAngle + Math.PI) % (2 * Math.PI);
        const moonX = centerX - Math.cos(moonAngle) * radius;  // Note the negative cosine to flip the direction
        const moonY = centerY - Math.sin(moonAngle) * radius;  // Note the negative sine to maintain correct height

        // Only draw the moon if it's in the visible part of the orbit (above the horizon)
        if (moonY < canvas.height) {
            const moonRadius = 40;  // Increased moon size

            // Moon glow
            const moonGradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 1.5);
            moonGradient.addColorStop(0, '#ffffff');
            moonGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(moonX, moonY, moonRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = moonGradient;
            ctx.fill();

            // Moon body
            ctx.beginPath();
            ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#f4f4f4';
            ctx.fill();
        }

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
