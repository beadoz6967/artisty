// Character config for Matt Murdock / Daredevil — Marvel Comics, 1964.
import type { CharacterConfig } from '@/lib/types';

export const daredevil: CharacterConfig = {
  id: 'daredevil',
  slug: 'daredevil',
  displayName: 'Matt Murdock / Daredevil',

  palette: {
    bg: '#0a0a0c',
    surface: '#111116',
    card: '#1a1a20',
    accent: '#cc1f1f',
    text: '#e8e4dc',
    muted: '#6b6b7a',
    border: '#2a2a35',
  },

  meta: {
    origin: "Hell's Kitchen, New York — Marvel Comics, 1964",
    tags: ['Marvel', 'blind', 'lawyer', 'Catholic', 'noir', 'street-level'],
    aliases: ['The Man Without Fear', 'The Devil of Hell\'s Kitchen', 'Black Suit'],
  },

  lore: [
    {
      heading: 'The accident',
      body:
        "Age 9. A radioactive chemical truck. He pushed an old man out of the way. " +
        "The canister hit him in the face and took his sight. " +
        "Every other sense amplified beyond human range. " +
        "Radar sense maps everything in 360 degrees — he perceives more blind than most people see.",
    },
    {
      heading: "Battlin' Jack Murdock",
      body:
        "His father was a boxer. Refused to throw a fight for the Fixer — " +
        "won the match that night, was murdered for it outside Fogwell's Gym. " +
        "Matt found him. That wound is the load-bearing structure under everything else.",
    },
    {
      heading: 'Stick',
      body:
        "Blind sensei. Brutal, methodical, used Matt as a weapon against the Hand. " +
        "Abandoned him when Matt got too human — when he started treating Stick like a father. " +
        "Spent the rest of his childhood in an orphanage. " +
        "Stick never apologized. Neither of them expected him to.",
    },
    {
      heading: 'Catholic guilt as operating system',
      body:
        "He confesses what he does at night. Believes it is a sin. " +
        "Does it anyway. " +
        "Never kills — not because he can't, but because killing is the line " +
        "he has decided separates him from what he fights. " +
        "He holds that line under conditions designed to break it.",
    },
    {
      heading: 'Kingpin — Wilson Fisk',
      body:
        "The most personal enemy. Knows his identity. " +
        "Prefers psychological war over physical confrontation — " +
        "dismantle the man before you dismantle the symbol. " +
        "Born Again is what happens when he succeeds.",
    },
    {
      heading: 'Bullseye',
      body:
        "Never misses. Sociopath who requires structure to function. " +
        "Has worn the Daredevil suit. " +
        "The danger is not just that he can kill anyone — " +
        "it is that he enjoys it and Matt cannot.",
    },
  ],

  arcs: [
    {
      title: 'Born Again — Miller/Mazzucchelli',
      year: 1986,
      note:
        'Karen sells his identity for heroin. Kingpin dismantles his entire life. ' +
        'Matt breaks and rebuilds from nothing. The definitive story.',
      image: 'https://upload.wikimedia.org/wikipedia/en/6/67/Daredevil_Born_Again.jpg',
    },
    {
      title: 'The Man Without Fear — Miller/JRJR',
      year: 1993,
      note:
        'Definitive origin. Stick, Elektra, first black suit. ' +
        'Every adaptation draws from this.',
      image: 'https://upload.wikimedia.org/wikipedia/en/7/72/TheManWithoutFear.jpg',
    },
    {
      title: 'Netflix Season 1',
      year: 2015,
      note: 'Charlie Cox, Vincent D\'Onofrio. Best MCU TV.',
      image: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Daredevil_Season_1.jpg',
    },
    {
      title: 'Netflix Season 3',
      year: 2018,
      note: 'Born Again adaptation. Bullseye in the DD suit.',
      image: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Daredevil_Season_3.jpg',
    },
    {
      title: 'Disney+ Born Again Season 1',
      year: 2025,
      note: 'Fisk as mayor. Anti-Vigilante Task Force. Full Netflix cast returns.',
      image: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Daredevil_Born_Again_Season_1.jpg',
    },
    {
      title: 'Disney+ Born Again Season 2',
      year: 2026,
      note: 'Concurrent with Punisher: One Last Kill.',
      image: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Daredevil_Born_Again_Season_1.jpg',
    },
  ],

  gallery: [
    { title: 'Born Again (1986)', image: 'https://upload.wikimedia.org/wikipedia/en/6/67/Daredevil_Born_Again.jpg' },
    { title: 'The Man Without Fear (1993)', image: 'https://upload.wikimedia.org/wikipedia/en/7/72/TheManWithoutFear.jpg' },
    { title: 'Daredevil #1 (1964)', image: 'https://upload.wikimedia.org/wikipedia/en/3/39/Daredevil_Vol_1_1.jpg' },
    { title: 'Netflix Season 1 (2015)', image: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Daredevil_Season_1.jpg' },
    { title: 'Netflix Season 2 (2016)', image: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Daredevil_season_2.jpg' },
    { title: 'Netflix Season 3 (2018)', image: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Daredevil_Season_3.jpg' },
    { title: 'Daredevil (2003 film)', image: 'https://upload.wikimedia.org/wikipedia/en/7/70/Daredevil_film.jpg' },
    { title: 'Kingpin', image: 'https://upload.wikimedia.org/wikipedia/en/4/42/Kingpin_%28comics%29.jpg' },
    { title: 'Elektra', image: 'https://upload.wikimedia.org/wikipedia/en/1/10/Elektra_%28comics%29.jpg' },
  ],
};
