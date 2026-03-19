"use client";

import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
  baseX: number;
  baseY: number;
}

interface Particle {
  x: number;
  y: number;
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface MouseInteraction {
  x: number;
  y: number;
  radius: number;
  decay: number;
}

const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseInteraction>({ x: -1000, y: -1000, radius: 0, decay: 0 });
  const animationFrameRef = useRef<number>(undefined);

  // Configuration - adjust these for different effects

  const config = {
    nodeCount: 40,              // Number of network nodes
    nodeSize: 2,                // Base node radius
    connectionDistance: 200,     // Max distance for connections
    maxConnections: 3,          // Max connections per node
    particleCount: 25,          // Number of flow particles
    particleSpeed: 0.3,         // Speed of particle movement
    nodeDriftSpeed: 0.05,       // How fast nodes drift
    nodeDriftRange: 15,         // Max drift distance from origin
    baseOpacity: 0.04,          // Base network opacity
    activeOpacity: 0.12,        // Opacity when interacting
    interactionRadius: 150,     // Mouse interaction range
    pulseDecaySpeed: 0.05,      // Speed of click ripple decay
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeNetwork();
    };

    // Initialize network nodes
    const initializeNetwork = () => {
      const nodes: Node[] = [];

      // Create nodes in a semi-random grid pattern
      for (let i = 0; i < config.nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * config.nodeDriftSpeed,
          vy: (Math.random() - 0.5) * config.nodeDriftSpeed,
          connections: [],
        });
      }

      // Create connections between nearby nodes
      nodes.forEach((node, i) => {
        const distances: { index: number; distance: number }[] = [];

        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
              distances.push({ index: j, distance });
            }
          }
        });

        // Connect to closest nodes
        distances
          .sort((a, b) => a.distance - b.distance)
          .slice(0, config.maxConnections)
          .forEach(({ index }) => {
            if (!node.connections.includes(index)) {
              node.connections.push(index);
            }
          });
      });

      nodesRef.current = nodes;

      // Initialize particles
      const particles: Particle[] = [];
      for (let i = 0; i < config.particleCount; i++) {
        const randomNode = Math.floor(Math.random() * nodes.length);
        const connections = nodes[randomNode].connections;

        if (connections.length > 0) {
          particles.push({
            x: nodes[randomNode].x,
            y: nodes[randomNode].y,
            fromNode: randomNode,
            toNode: connections[Math.floor(Math.random() * connections.length)],
            progress: Math.random(),
            speed: config.particleSpeed * (0.5 + Math.random() * 0.5),
          });
        }
      }
      particlesRef.current = particles;
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Decay mouse interaction
      if (mouse.decay > 0) {
        mouse.decay -= config.pulseDecaySpeed;
        if (mouse.decay < 0) mouse.decay = 0;
        mouse.radius = mouse.decay * config.interactionRadius;
      } else {
        mouse.radius = 0;
      }

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Gentle drift
        node.x += node.vx;
        node.y += node.vy;

        // Boundary and return to base
        const dx = node.baseX - node.x;
        const dy = node.baseY - node.y;
        const distFromBase = Math.sqrt(dx * dx + dy * dy);

        if (distFromBase > config.nodeDriftRange) {
          node.vx += dx * 0.001;
          node.vy += dy * 0.001;
        }

        // Damping
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Calculate interaction
        const mouseDist = Math.sqrt(
          (mouse.x - node.x) ** 2 + (mouse.y - node.y) ** 2
        );
        const interactionStrength = Math.max(
          0,
          1 - mouseDist / mouse.radius
        );

        // Draw node
        const nodeOpacity = config.baseOpacity + interactionStrength * config.activeOpacity;
        const nodeSize = config.nodeSize + interactionStrength * 2;

        ctx.fillStyle = `rgba(0, 0, 0, ${nodeOpacity})`; // High contrast black
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        node.connections.forEach(targetIndex => {
          if (targetIndex > i) { // Draw each connection once
            const target = nodes[targetIndex];

            const targetMouseDist = Math.sqrt(
              (mouse.x - target.x) ** 2 + (mouse.y - target.y) ** 2
            );
            const targetInteraction = Math.max(
              0,
              1 - targetMouseDist / mouse.radius
            );

            const lineOpacity = (config.baseOpacity * 0.6) +
              Math.max(interactionStrength, targetInteraction) * config.activeOpacity;

            ctx.strokeStyle = `rgba(0, 0, 0, ${lineOpacity})`; // High contrast black
            ctx.lineWidth = 1.2 + Math.max(interactionStrength, targetInteraction) * 0.8;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.progress += particle.speed * 0.01;

        if (particle.progress >= 1) {
          // Move to next connection
          const currentNode = nodes[particle.toNode];
          if (currentNode.connections.length > 0) {
            particle.fromNode = particle.toNode;
            particle.toNode = currentNode.connections[
              Math.floor(Math.random() * currentNode.connections.length)
            ];
            particle.progress = 0;
            particle.speed = config.particleSpeed * (0.5 + Math.random() * 0.5);
          }
        }

        const from = nodes[particle.fromNode];
        const to = nodes[particle.toNode];

        if (from && to) {
          particle.x = from.x + (to.x - from.x) * particle.progress;
          particle.y = from.y + (to.y - from.y) * particle.progress;

          // Draw particle with trail effect
          const particleOpacity = Math.min(1, config.baseOpacity * 2.5);
          ctx.fillStyle = `rgba(0, 0, 0, ${particleOpacity})`; // High contrast black
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Mouse interaction handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.decay = 1;
      mouseRef.current.radius = config.interactionRadius;
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default NetworkBackground;