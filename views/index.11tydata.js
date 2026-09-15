const links = {
  github: "https://github.com/jamesthomasonjr",
  linkedin: "https://www.linkedin.com/in/jamesthomasonjr/",
  stations: "https://stations.dev",
  resume: "/resume/",
  email: "mailto:james@jamesthomasonjr.com",
};

const author = {
  name: "James Thomason, Jr.",
  shortName: "James Thomason, Jr.",
  email: "james@jamesthomasonjr.com",
  jobTitle: "Founding Engineer (Independent)",
  tagline: "Software engineer building developer tools and human + agent systems.",
};

const siteUrl = "https://jamesthomasonjr.com";

module.exports = function() {
  return {
    site: {
      url: siteUrl,
      year: new Date().getFullYear(),
      title: "James Thomason, Jr. — Developer tools and agent systems",
      description:
        "James Thomason, Jr. is a software engineer building developer tools and human + agent systems. Currently building Stations.dev as an independent founding engineer.",
      links,
    },

    author,

    // Rendered through Nunjucks' dump filter so values are JSON-encoded
    // rather than string-interpolated into the script block.
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: author.name,
      url: siteUrl + "/",
      email: author.email,
      jobTitle: author.jobTitle,
      description: author.tagline,
      sameAs: [links.github, links.linkedin, links.stations],
    },

    nav: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Outside", href: "#outside" },
    ],

    headerActions: [
      { label: "Building Stations.dev", href: links.stations, status: true },
      { label: "Résumé", href: links.resume },
      { label: "GitHub", href: links.github },
      { label: "LinkedIn", href: links.linkedin },
    ],

    hero: {
      narrative:
        "My work centers on developer interfaces, agent workflows and orchestration, context systems, guardrails, and reliable execution — the parts of agentic software that decide whether it can be trusted with real work.",
      links: [
        { label: "github/jamesthomasonjr", href: links.github },
        { label: "linkedin/jamesthomasonjr", href: links.linkedin },
        { label: "stations.dev", href: links.stations },
        { label: "Résumé", href: links.resume },
        { label: "james@jamesthomasonjr.com", href: links.email },
      ],
    },

    flagship: {
      name: "Stations.dev",
      status: "In active development",
      role: "Founding Engineer",
      tagline: "Executable workflows for humans + agents.",
      description:
        "Stations is an agent-native work execution platform where humans and agents work through the same structured processes, with explicit actors, artifacts, gates, dependencies, and approvals.",
      primitives: ["Actors", "Artifacts", "Gates", "Dependencies", "Approvals"],
      link: { label: "stations.dev", href: links.stations },
    },

    projects: [
      {
        name: "Supersuit",
        status: "public_repo",
        tagline: "Composable workflows for coding agents.",
        description:
          "An agent workflow platform for composing software-development processes without hard-coding a methodology into the harness. Its primitives are designed to express established approaches such as Superpowers, GSD, and SpecKit, as well as custom team workflows.",
        repo: { label: "github/jeighty/supersuit", href: "https://github.com/jeighty/supersuit" },
      },
      {
        name: "Agent Skills",
        status: "public_repo",
        tagline: "Reusable capabilities for coding agents.",
        description:
          "A collection of portable skills for codebase orientation, debugging, multi-agent code review, work prioritization, handoffs, and other software-engineering workflows.",
        repo: { label: "github/jamesthomasonjr/skills", href: "https://github.com/jamesthomasonjr/skills" },
      },
      {
        name: "Fleet",
        status: "private_preview",
        tagline: "Orchestration for fleets of coding agents.",
        description:
          "A harness-agnostic evolution of my multi-agent tooling for coordinating coding agents across repositories, tasks, and execution environments.",
        note: "Repository private // public release planned",
      },
      {
        name: "Vic — Visual Context",
        status: "in_development",
        tagline: "A headless agent harness and context editor inspired by Vim and Neovim.",
        description:
          "Vic explores what a Vim-like environment could look like for the agent age: context as an editable developer resource, a small headless core, semantic commands and actions, protocol-separated interfaces, pluggable providers, and extensibility built around agent workflows rather than text files.",
        note: "Repository private // public release planned",
      },
    ],

    about: {
      narrative:
        "I've spent my career building full-stack products, developer platforms, infrastructure, and tools. More recently, my work has moved toward agentic software — not only using AI to build software, but building the systems around agents that make them more useful to developers and teams.",
      trajectory: [
        {
          period: "Current",
          dates: "Aug 2026 — Present",
          role: "Founding Engineer (Independent)",
          org: "Stations.dev",
          summary:
            "Building an agent-native work execution platform for humans and autonomous agents.",
        },
        {
          period: "Previous",
          dates: "Jun 2022 — Aug 2026",
          role: "Software Development Engineer II",
          org: "Amazon",
          summary:
            "Built AI workflow platforms, experimentation systems, cloud infrastructure, and developer tooling.",
        },
      ],
      philosophy:
        "Strip friction away from cognitive work. Reliable engineering systems aren't built through opaque autonomous magic; they need explicit state, clear boundaries, observable behavior, and good ergonomics so humans and agents can work together effectively.",
    },

    profile: [
      {
        label: "Focus",
        values: [
          "Developer Tooling",
          "Agent Systems",
          "Platform Engineering",
          "Distributed Systems",
          "Full-Stack Architecture",
        ],
      },
      { label: "Languages & Runtimes", values: ["TypeScript", "Node.js", "Python", "Go", "Java"] },
      {
        label: "Platforms",
        values: ["AWS", "Kubernetes", "PostgreSQL", "Docker", "OpenTofu / Terraform", "GitHub Actions"],
      },
      {
        label: "Agent Systems",
        values: ["Multi-Agent Systems", "Human-in-the-Loop", "MCP", "Bedrock", "RAG"],
      },
      {
        label: "Current",
        values: ["Stations.dev", "Supersuit", "Agent Skills", "Fleet", "Vic"],
      },
    ],

    outside: {
      intro:
        "I'm a dad, gamer, homebrewer, and habitual tinkerer. Most of my side projects begin because I want a tool that doesn't quite exist yet.",
      cards: [
        {
          name: "Fatherhood",
          description: "Dad first — most of what happens outside of work happens with my family.",
        },
        {
          name: "Homebrewing",
          description: "Brewing beer at home: process tinkering with a drinkable result.",
        },
        {
          name: "Gaming",
          description: "A long-running hobby, and a reliable source of ideas for side projects.",
        },
        {
          name: "Tinkering",
          description: "Homelab hardware, self-hosted services, and small tools built for an audience of one.",
        },
      ],
    },

    footerLinks: [
      { label: "GitHub", href: links.github },
      { label: "LinkedIn", href: links.linkedin },
      { label: "Stations.dev", href: links.stations },
      { label: "Résumé", href: links.resume },
      { label: "Email", href: links.email },
    ],
  };
};
