export type Project = {
  id: string;
  index: string;
  title: string;
  client: string;
  year: string;
  disciplines: string[];
  blurb: string;
  /** drives the generated, type-led cover art */
  glow: string;
  ink: string;
  award?: string;
};

export const projects: Project[] = [
  {
    id: "kitsune",
    index: "01",
    title: "Kitsune Optics",
    client: "Kitsune Optics",
    year: "2025",
    disciplines: ["Identity", "Packaging", "Art Direction"],
    blurb:
      "A single continuous line, folded until it became a fox, a lens, and a wordmark — the same mark at 4mm on a temple arm and at 4m on a building.",
    glow: "#ff8a3d",
    ink: "#2a1206",
    award: "D&AD Wood Pencil",
  },
  {
    id: "nocturne",
    index: "02",
    title: "Nocturne",
    client: "Nocturne Audio",
    year: "2024",
    disciplines: ["Product Design", "Motion", "WebGL"],
    blurb:
      "A listening app designed for 2am. The interface has no bright states at all — it is drawn entirely in the light of whatever is playing.",
    glow: "#9b8cff",
    ink: "#150f33",
    award: "Awwwards Site of the Day",
  },
  {
    id: "hollow-co",
    index: "03",
    title: "Hollow & Co.",
    client: "Hollow & Co.",
    year: "2024",
    disciplines: ["Identity", "Editorial", "Environmental"],
    blurb:
      "A perfumery that only sells in the dark. Everything they make is printed in a pigment that charges under moonlight and fades by morning.",
    glow: "#6ee7b7",
    ink: "#062018",
  },
  {
    id: "solaris",
    index: "04",
    title: "Solaris Foundry",
    client: "Solaris Type",
    year: "2023",
    disciplines: ["Type Design", "Web", "Tooling"],
    blurb:
      "A variable typeface with an optical axis you can drag. We built the specimen site and the design tool in the same codebase, because the tool is the site.",
    glow: "#ffc98a",
    ink: "#2b1f07",
    award: "Type Directors Club",
  },
  {
    id: "atlas",
    index: "05",
    title: "Atlas Obscura",
    client: "Atlas Obscura",
    year: "2023",
    disciplines: ["Editorial", "Web", "Motion"],
    blurb:
      "A publishing platform for the places nobody visits. 4,000 entries, a map that never loads, and typography that does the navigating instead.",
    glow: "#ff5d7a",
    ink: "#2c0715",
    award: "FWA of the Day",
  },
  {
    id: "ember-ceramics",
    index: "06",
    title: "Ember Ceramics",
    client: "Ember Ceramics",
    year: "2022",
    disciplines: ["Identity", "E-commerce", "Photography"],
    blurb:
      "A stoneware studio whose entire identity is the temperature of the kiln. The logo is a gradient you can hold a match to and read the firing.",
    glow: "#f2651a",
    ink: "#25100a",
  },
];

export const disciplines = [
  "Brand Identity",
  "Art Direction",
  "Digital Product",
  "WebGL & Motion",
  "Type Design",
  "Packaging",
];

export const process = [
  {
    n: "01",
    title: "Light",
    body: "We start by finding the one idea worth building the whole thing around. Usually it is a single sentence nobody in the room has said out loud yet.",
  },
  {
    n: "02",
    title: "Fold",
    body: "Structure before surface. We take the idea apart, rebuild it as a system, and only then decide what colour it happens to be.",
  },
  {
    n: "03",
    title: "Shape",
    body: "Identity, interface, motion, object. Made together, not handed off in sequence — so the brand behaves the same in a browser as it does in the hand.",
  },
  {
    n: "04",
    title: "Release",
    body: "We ship it, we watch it, we stay on. A launch is the beginning of the feedback loop, not the end of the project.",
  },
];

export const recognition = [
  "D&AD Wood Pencil",
  "Awwwards Site of the Day",
  "FWA of the Day",
  "Type Directors Club",
  "Red Dot: Brands & Communication",
  "Webby Honoree",
  "The One Show Merit",
  "ADC Young Guns",
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Are.na", href: "https://are.na" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export const email = "hello@paperlantern.xyz";
