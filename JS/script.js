if (window.OffscreenCanvas) {
    const canvas = document.getElementById("spaceCanvas");
    // Transfert du contrôle du canvas vers le worker
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker("js/animationWorker.js");

    // Envoi initial du canvas et de ses dimensions
    worker.postMessage({ canvas: offscreen, width: window.innerWidth, height: window.innerHeight }, [offscreen]);

    // Gestion du redimensionnement du canvas
    window.addEventListener("resize", () => {
        worker.postMessage({ type: "resize", width: window.innerWidth, height: window.innerHeight });
    });
} else {
    console.error("OffscreenCanvas n'est pas supporté par ce navigateur.");
    // Ici, tu peux appeler ta méthode d'animation classique en fallback
}
