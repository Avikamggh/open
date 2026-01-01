import { useEffect, useRef, useCallback } from 'react';

interface Star {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    pulse: number;
    pulseSpeed: number;
}

const StarBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | undefined>(undefined);

    const createStars = useCallback((width: number, height: number) => {
        const stars: Star[] = [];
        const count = Math.floor((width * height) / 8000);

        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.15,
                speedY: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
            });
        }
        return stars;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            starsRef.current = createStars(canvas.width, canvas.height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connection lines ONLY for a subset of stars to save CPU (every 2nd star)
            const stars = starsRef.current;
            for (let i = 0; i < stars.length; i += 2) {
                const star = stars[i];
                for (let j = i + 1; j < stars.length; j += 4) {
                    const other = stars[j];
                    const dx = star.x - other.x;
                    const dy = star.y - other.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 10000) { // 100 * 100
                        const distance = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw and update stars
            stars.forEach((star) => {
                // Pulse opacity
                star.pulse += star.pulseSpeed;
                const pulseOpacity = star.opacity + Math.sin(star.pulse) * 0.2;

                // Mouse interaction - faster distance check
                const dx = star.x - mouseRef.current.x;
                const dy = star.y - mouseRef.current.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 22500) { // 150 * 150
                    const distance = Math.sqrt(distSq);
                    const force = (150 - distance) / 150 * 0.5;
                    star.x += (dx / distance) * force;
                    star.y += (dy / distance) * force;
                }

                // Update position
                star.x += star.speedX;
                star.y += star.speedY;

                // Wrap around screen
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Draw star simplified (skip radial gradient for speed)
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.shadowBlur = 4;
                ctx.shadowColor = `rgba(168, 85, 247, ${pulseOpacity})`;
                ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset for next items
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [createStars]);

    return (
        <>
            {/* Aurora effect */}
            <div className="aurora-bg" />

            {/* Star canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ background: 'transparent' }}
            />

            {/* Gradient orbs */}
            <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow" />
            <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="fixed top-1/2 right-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </>
    );
};

export default StarBackground;
