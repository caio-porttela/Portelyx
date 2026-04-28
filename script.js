// Atualiza ano automaticamente no footer.
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Reveal ao scroll usando IntersectionObserver.
const revealElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Microinteracao de ripple nos botoes.
const rippleButtons = document.querySelectorAll(".ripple");
rippleButtons.forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const wave = document.createElement("span");
    wave.className = "ripple-wave";
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${event.clientX - rect.left - size / 2}px`;
    wave.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove(), { once: true });
  });
});

// Efeito parallax leve no hero para dar profundidade.
const hero = document.querySelector(".hero");
const heroGrid = document.querySelector(".hero-grid");
if (hero && !reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      const offset = window.scrollY * 0.14;
      hero.style.backgroundPositionY = `${offset}px`;
    },
    { passive: true }
  );
}

// Parallax por cursor no elemento decorativo do hero.
if (hero && heroGrid && !reduceMotion) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    heroGrid.style.transform = `translate3d(${relativeX * 14}px, ${relativeY * 12}px, 0)`;
  });

  hero.addEventListener("pointerleave", () => {
    heroGrid.style.transform = "translate3d(0, 0, 0)";
  });
}

// Spotlight suave seguindo o cursor para reforcar o visual premium.
if (!reduceMotion) {
  const spotlight = document.createElement("div");
  spotlight.className = "spotlight";
  document.body.appendChild(spotlight);
  document.body.classList.add("has-spotlight");

  window.addEventListener(
    "pointermove",
    (event) => {
      spotlight.style.left = `${event.clientX}px`;
      spotlight.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

// Particulas leves no fundo, com baixo custo de renderizacao.
const canvas = document.getElementById("particles");
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationFrame = 0;

  const setupCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth * ratio;
    canvas.height = clientHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createParticles = () => {
    const count = Math.max(26, Math.floor(window.innerWidth / 42));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.6,
      alpha: Math.random() * 0.55 + 0.2
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.clientWidth) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.clientHeight) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(89, 170, 255, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const alpha = ((100 - dist) / 100) * 0.22;
          ctx.strokeStyle = `rgba(63, 123, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationFrame = window.requestAnimationFrame(draw);
  };

  if (!reduceMotion) {
    setupCanvas();
    createParticles();
    draw();
    window.addEventListener("resize", () => {
      setupCanvas();
      createParticles();
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      return;
    }
    if (!reduceMotion) {
      draw();
    }
  });
}

// Simulacao simples de envio no formulario (sem backend).
const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const projectType = form.querySelector("#tipoProjeto");
    const budget = form.querySelector("#orcamento");
    const deadline = form.querySelector("#prazo");
    const message = form.querySelector("#mensagem");
    const allRequiredFilled =
      projectType?.value &&
      budget?.value &&
      deadline?.value &&
      message?.value.trim().length >= 10;

    if (submitButton) {
      if (!allRequiredFilled) {
        submitButton.textContent = "Preencha os campos obrigatorios";
        setTimeout(() => {
          submitButton.textContent = "Falar comigo";
        }, 1500);
        return;
      }
      submitButton.textContent = "Mensagem enviada!";
      submitButton.setAttribute("disabled", "true");
      setTimeout(() => {
        submitButton.textContent = "Falar comigo";
        submitButton.removeAttribute("disabled");
        form.reset();
      }, 1800);
    }
  });
}

// Simulador simples para engajar e orientar o cliente.
const simulatorButton = document.getElementById("simuladorBtn");
const simulatorType = document.getElementById("simuladorTipo");
const simulatorGoal = document.getElementById("simuladorObjetivo");
const simulatorDeadline = document.getElementById("simuladorPrazo");
const simulatorResult = document.getElementById("simuladorResultado");

if (
  simulatorButton &&
  simulatorType &&
  simulatorGoal &&
  simulatorDeadline &&
  simulatorResult
) {
  simulatorButton.addEventListener("click", () => {
    const type = simulatorType.value;
    const goal = simulatorGoal.value;
    const deadline = simulatorDeadline.value;

    const typeMap = {
      institucional: "Site institucional completo",
      landing: "Landing page de alta conversao",
      catalogo: "Site com catalogo e destaque de produtos"
    };

    const budgetMap = {
      institucional: "faixa de R$ 3.000 a R$ 7.000",
      landing: "faixa de R$ 2.000 a R$ 5.000",
      catalogo: "faixa de R$ 5.000 a R$ 12.000"
    };

    const goalMap = {
      contatos: "foco em formularios e WhatsApp para gerar mais contatos",
      autoridade: "foco em credibilidade, prova social e posicionamento da marca",
      vendas: "foco em conversao comercial e ofertas estrategicas"
    };

    const deadlineMap = {
      rapido: "prioridade de producao com etapas semanais",
      normal: "cronograma padrao com validacao por fases",
      flexivel: "execucao com mais iteracoes para refinamento visual"
    };

    simulatorResult.textContent = `Recomendacao: ${typeMap[type]}, com ${goalMap[goal]}. Investimento sugerido na ${budgetMap[type]} e ${deadlineMap[deadline]}. Se quiser, posso montar uma proposta personalizada agora.`;
  });
}
