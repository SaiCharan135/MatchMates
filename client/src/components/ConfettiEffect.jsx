import confetti from 'canvas-confetti';

export function triggerConfetti(intensity = 'normal') {
  if (intensity === 'victory') {
    // Big Victory blast
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF9800', '#FF3D71', '#FFD700'] });
    fire(0.2, { spread: 60, colors: ['#2ED573', '#9B51E0', '#FF4757'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } else {
    // Quick Match pop
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FF9800', '#2ED573', '#FF3D71', '#FFD700', '#9B51E0']
    });
  }
}

export default triggerConfetti;
