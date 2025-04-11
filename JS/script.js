if (window.OffscreenCanvas) {
    const canvas = document.getElementById("spaceCanvas");
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker("../js/animationWorker.js");

    worker.postMessage({ canvas: offscreen, width: window.innerWidth, height: window.innerHeight }, [offscreen]);

    window.addEventListener("resize", () => {
        worker.postMessage({ type: "resize", width: window.innerWidth, height: window.innerHeight });
    });
} else {
    console.error("OffscreenCanvas n'est pas supporté par ce navigateur.");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contactSection");
    const allInputs = form.querySelectorAll("input, textarea");
    const sendBtn = form.querySelector(".sendBtn");

    sendBtn.addEventListener("click", (e) => {
        e.preventDefault();

        let isValid = true;

        form.querySelectorAll(".errorMsg").forEach(msg => msg.remove());

        allInputs.forEach(input => {
            const labelText = input.previousElementSibling?.textContent || "";

            input.classList.remove("invalid");

            if (labelText.includes("(*)") && input.value.trim() === "") {
                isValid = false;
                afficherErreur(input, "Ce champ est requis");
            }

            if (input.type === "email" && input.value.trim() !== "" && !emailValide(input.value)) {
                isValid = false;
                afficherErreur(input, "Adresse mail invalide");
            }
        });

        if (isValid) {
            allInputs.forEach(input => input.value = "");
            alert("Message envoyé !");
        }
    });

    function afficherErreur(input, message) {
        const error = document.createElement("p");
        error.classList.add("errorMsg");
        error.textContent = message;
        error.style.color = "red";
        error.style.margin = "5px 0 10px 0";
        input.insertAdjacentElement("afterend", error);
        input.classList.add("invalid");
    }

    function emailValide(email) {
        // Regex simple et suffisante pour un usage basique
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});

