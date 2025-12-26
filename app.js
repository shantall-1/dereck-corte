  // Animación inicial del botón
        window.onload = () => {
            gsap.from("#start-btn", { scale: 0, duration: 0.8, ease: "back.out(1.7)" });
        };

        document.getElementById('start-btn').addEventListener('click', function() {
            const btn = this;
            const overlay = document.getElementById('intro-overlay');
            const main = document.getElementById('main-content');
            
            gsap.to(btn, { scale: 0, opacity: 0, duration: 0.3 });
            gsap.to(overlay, { 
                opacity: 0, 
                duration: 0.5, 
                onComplete: () => {
                    overlay.style.display = 'none';
                    main.style.display = 'flex';
                    initThreeLeaves();
                    
                    // --- LANZAR RÁFAGA DE CONFETI ---
                    lanzarConfetiExpress();

                    const tl = gsap.timeline();
                    tl.to("#card", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" })
                      .to("#photo", { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "-=0.5")
                      .to(".floating-animal", { opacity: 1, duration: 1, stagger: 0.2 }, "-=0.5");
                    
                    gsap.to("#cta-btn", { scale: 1.05, repeat: -1, yoyo: true, duration: 0.8 });
                    gsap.to("#monkey", { y: "+=20", repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });
                    gsap.to("#tiger", { y: "-=20", repeat: -1, yoyo: true, duration: 2.5, ease: "sine.inOut" });
                }
            });
        });

        // --- FUNCIÓN DE CONFETI EXPRESS (2 SEGUNDOS) ---
        function lanzarConfetiExpress() {
            const duration = 2 * 1000; // 2 segundos exactos
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100, colors: ['#2ecc71', '#e67e22', '#f1c40f', '#ffffff'] };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // Lanzar desde posiciones aleatorias superiores
                confetti(Object.assign({}, defaults, { 
                    particleCount, 
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
                }));
                confetti(Object.assign({}, defaults, { 
                    particleCount, 
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
                }));
            }, 250);
        }

        // --- SISTEMA DE HOJAS CAYENDO (3D) ---
        function initThreeLeaves() {
            const container = document.getElementById('leaf-canvas');
            if (container.children.length > 0) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            const leafGeo = new THREE.BoxGeometry(8, 12, 1);
            const colors = [0x2ecc71, 0x27ae60, 0xf1c40f];
            const leaves = [];

            for (let i = 0; i < 30; i++) {
                const mat = new THREE.MeshBasicMaterial({ 
                    color: colors[Math.floor(Math.random() * colors.length)],
                    side: THREE.DoubleSide 
                });
                const leaf = new THREE.Mesh(leafGeo, mat);
                leaf.position.set(Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 100);
                leaf.userData = { speed: Math.random() * 0.5 + 0.2, rot: Math.random() * 0.02 };
                scene.add(leaf);
                leaves.push(leaf);
            }

            camera.position.z = 200;

            function animate() {
                requestAnimationFrame(animate);
                leaves.forEach(l => {
                    l.position.y -= l.userData.speed;
                    l.rotation.x += l.userData.rot;
                    l.rotation.y += l.userData.rot;
                    if (l.position.y < -200) l.position.y = 200;
                });
                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        }