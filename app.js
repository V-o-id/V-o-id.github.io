import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

const NavBar = {
  props: {
    current: {
      type: String,
      required: true,
    },
  },
  template: `
    <nav class="navbar">
      <div class="navbar-links">
        <a class="nav-link" :class="{ active: current === 'home' }" href="index.html">Home</a>
        <a class="nav-link" :class="{ active: current === 'game' }" href="game.html">Game</a>
        <a class="nav-link" href="https://v-o-id.github.io/WeatherDependentCommits/" target="_blank" rel="noopener noreferrer">Weather App</a>
        <a class="nav-link" href="https://github.com/V-o-id" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="nav-link" href="https://www.linkedin.com/in/manuel-hochreiter" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </nav>
  `,
};

const SiteFooter = {
  template: `<footer><p>(c) 2025 Manuel Hochreiter - Built with curiosity and the occasional confusion</p></footer>`,
};

const HomePage = {
  components: { NavBar, SiteFooter },
  template: `
    <div class="site-wrap">
      <NavBar current="home" />

      <header>
        <h1>Void</h1>
        <h2>Student - Software Engineer - Hobby Game Developer</h2>
      </header>

      <section>
        <p>
          Hello there - I'm a Computer Science student and software engineer based in Austria.
          In my free time, I enjoy creating small, experimental games and exploring the intersection
          between <strong>technology</strong> and <strong>storytelling</strong>.
        </p>

        <p>
          Take a look at the project for my <strong>Bachelor's Thesis</strong> -
          <em>Little Ninja Adventure</em>.
          It explores <strong>Generative NPC Dialogues</strong> and their impact on player experience.
        </p>

        <a href="game.html" class="btn">Play My Thesis Game</a>
      </section>

      <section>
        <h3>Other Projects</h3>
        <p>Some of my past projects include:</p>
        <p>
          <strong>Uni-Rogue</strong> - A university team project for "Multimedia Systems,"
          inspired by the classic 1980s <em>Rogue</em>, but featuring emoticons as the main characters.
        </p>
        <p>
          <strong>WeatherDependentCommits</strong> - A not-so-serious Python script that analyzes
          whether you make more commits on sunny or rainy days.
        </p>
        <a href="https://v-o-id.github.io/WeatherDependentCommits/" class="btn" target="_blank" rel="noopener noreferrer">Try WeatherDependentCommits Web</a>
        <p>
          You can find more of my work and code experiments on GitHub or connect with me on LinkedIn.
        </p>

        <a href="https://github.com/V-o-id" class="btn" target="_blank" rel="noopener noreferrer">View My GitHub</a>
        <a href="https://www.linkedin.com/in/manuel-hochreiter" class="btn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </section>

      <SiteFooter />
    </div>
  `,
};

const GamePage = {
  components: { NavBar, SiteFooter },
  data() {
    return {
      apiUrl: "https://little-ninja-api.onrender.com/",
      gameUrl: "game_build/little-ninja-adventure.html",
      loadingMessage: "Waking up the backend... This may take up to a minute.",
      gameReady: false,
      pollCount: 0,
      pollIntervalId: null,
      initialTimeoutId: null,
      INITIAL_DELAY_MS: 40000,
      POLL_INTERVAL_MS: 10000,
      MAX_POLLS: 6,
    };
  },
  methods: {
    async pollApi() {
      this.pollCount += 1;

      try {
        const response = await fetch(this.apiUrl);
        if (response.ok) {
          this.stopPolling();
          this.gameReady = true;
          return;
        }
      } catch (_) {
        // ignored while backend wakes up
      }

      if (this.pollCount >= this.MAX_POLLS) {
        this.stopPolling();
        this.loadingMessage =
          "The backend is taking longer than expected. Please refresh the page in a moment.";
      }
    },
    startPolling() {
      this.loadingMessage = "Backend warming up... almost there.";
      this.pollIntervalId = window.setInterval(() => this.pollApi(), this.POLL_INTERVAL_MS);
      this.pollApi();
    },
    stopPolling() {
      if (this.pollIntervalId) {
        clearInterval(this.pollIntervalId);
        this.pollIntervalId = null;
      }
    },
  },
  mounted() {
    this.initialTimeoutId = window.setTimeout(() => this.startPolling(), this.INITIAL_DELAY_MS);
  },
  beforeUnmount() {
    if (this.initialTimeoutId) {
      clearTimeout(this.initialTimeoutId);
    }
    this.stopPolling();
  },
  template: `
    <div class="site-wrap">
      <div v-if="!gameReady" id="loading-overlay">
        <div class="spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>

      <NavBar current="game" />

      <header>
        <h1>Little Ninja Adventure</h1>
        <h2>A Bachelor's Thesis Project by Manuel Hochreiter</h2>
      </header>

      <section class="wide">
        <p>
          <em>Little Ninja Adventure</em> was created in <strong>Godot</strong> as part of my Bachelor's Thesis.
          You play as a young kid who dreams of becoming a ninja - but the guard of the dojo won't let you in so easily.
        </p>

        <p>
          The villagers you meet along the way are powered by <strong>ChatGPT</strong>, giving each interaction a unique,
          generative dialogue experience.
        </p>

        <iframe v-if="gameReady" :src="gameUrl" title="Little Ninja Adventure game"></iframe>

        <p>
          The game will remain online as long as the project's hosting budget allows.
          A user study was conducted to explore whether LLM-powered NPC dialogues
          enhance <strong>player immersion and experience</strong>. Results will be published soon.
        </p>

        <p>
          Special thanks to <em>pixel-boy</em> for the asset pack -
          available on
          <a href="https://pixel-boy.itch.io/ninja-adventure-asset-pack" target="_blank" rel="noopener noreferrer" style="color: var(--text-light); text-decoration: underline;">Itch.io</a>.
        </p>

        <a href="index.html" class="btn">Back to Home</a>
      </section>

      <SiteFooter />
    </div>
  `,
};

const page = document.body.dataset.page;
createApp(page === "game" ? GamePage : HomePage).mount("#app");
