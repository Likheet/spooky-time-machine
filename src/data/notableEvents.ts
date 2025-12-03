import type { NotableEvent } from '../types';

/**
 * Curated collection of notable historical events spanning diverse periods and locations.
 * Includes Halloween-themed events for atmospheric exploration.
 */
export const NOTABLE_EVENTS: NotableEvent[] = [
  // Halloween-themed events
  {
    id: 'salem-witch-trials-1692',
    name: 'Salem Witch Trials',
    description:
      'The infamous witch trials in colonial Massachusetts, where mass hysteria led to the execution of 20 people accused of witchcraft.',
    location: {
      latitude: 42.5195,
      longitude: -70.8967,
      name: 'Salem, Massachusetts',
    },
    time: {
      year: 1692,
      month: 6,
      era: 'CE',
      displayName: 'June 1692 CE',
    },
    tags: ['halloween', 'colonial', 'witch-trials', 'america'],
  },
  {
    id: 'whitechapel-ripper-1888',
    name: 'Jack the Ripper Era',
    description:
      'The dark streets of Whitechapel during the infamous Jack the Ripper murders that terrorized Victorian London.',
    location: {
      latitude: 51.5194,
      longitude: -0.0601,
      name: 'Whitechapel, London',
    },
    time: {
      year: 1888,
      month: 9,
      era: 'CE',
      displayName: 'September 1888 CE',
    },
    tags: ['halloween', 'victorian', 'london', 'mystery'],
  },
  {
    id: 'bran-castle-medieval',
    name: "Dracula's Castle",
    description:
      'Bran Castle in Transylvania during medieval times, the legendary inspiration for Bram Stoker\'s Dracula.',
    location: {
      latitude: 45.515,
      longitude: 25.3673,
      name: 'Bran Castle, Romania',
    },
    time: {
      year: 1450,
      era: 'CE',
      displayName: '1450 CE',
    },
    tags: ['halloween', 'medieval', 'castle', 'dracula', 'romania'],
  },
  {
    id: 'day-of-dead-origins',
    name: 'Day of the Dead Origins',
    description:
      'Ancient Aztec celebration honoring the dead, the precursor to modern Día de los Muertos traditions.',
    location: {
      latitude: 19.4326,
      longitude: -99.1332,
      name: 'Tenochtitlan (Mexico City)',
    },
    time: {
      year: 1400,
      era: 'CE',
      displayName: '1400 CE',
    },
    tags: ['halloween', 'aztec', 'mexico', 'celebration', 'ancient'],
  },
  {
    id: 'edinburgh-vaults-1780',
    name: "Edinburgh's Haunted Vaults",
    description:
      'The underground vaults beneath Edinburgh\'s South Bridge, home to the city\'s poorest residents and now considered one of the most haunted locations in Scotland.',
    location: {
      latitude: 55.9486,
      longitude: -3.1864,
      name: 'Edinburgh, Scotland',
    },
    time: {
      year: 1780,
      era: 'CE',
      displayName: '1780 CE',
    },
    tags: ['halloween', 'scotland', 'underground', 'haunted'],
  },
  {
    id: 'paris-catacombs-1785',
    name: 'Catacombs of Paris',
    description:
      'The ossuary beneath Paris streets, where millions of skeletal remains were transferred from overflowing cemeteries.',
    location: {
      latitude: 48.8338,
      longitude: 2.3324,
      name: 'Paris, France',
    },
    time: {
      year: 1785,
      era: 'CE',
      displayName: '1785 CE',
    },
    tags: ['halloween', 'paris', 'catacombs', 'underground'],
  },
  {
    id: 'black-death-london-1348',
    name: 'Black Death in London',
    description:
      'London during the devastating bubonic plague pandemic, with plague doctors in their distinctive beaked masks treating the afflicted.',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      name: 'London, England',
    },
    time: {
      year: 1348,
      era: 'CE',
      displayName: '1348 CE',
    },
    tags: ['halloween', 'plague', 'medieval', 'london', 'pandemic'],
  },
  {
    id: 'egyptian-mummification-1250bce',
    name: 'Ancient Egyptian Mummification',
    description:
      'The sacred process of mummification in ancient Egypt, preparing pharaohs for their journey to the afterlife.',
    location: {
      latitude: 25.7189,
      longitude: 32.6573,
      name: 'Valley of the Kings, Egypt',
    },
    time: {
      year: 1250,
      era: 'BCE',
      displayName: '1250 BCE',
    },
    tags: ['halloween', 'ancient', 'egypt', 'mummification', 'pharaoh'],
  },

  // Ancient civilizations
  {
    id: 'rome-colosseum-80ce',
    name: 'Colosseum Opening',
    description:
      'The grand opening of the Flavian Amphitheatre in Rome, with 100 days of spectacular games and gladiatorial combat.',
    location: {
      latitude: 41.8902,
      longitude: 12.4922,
      name: 'Rome, Italy',
    },
    time: {
      year: 80,
      era: 'CE',
      displayName: '80 CE',
    },
    tags: ['ancient', 'rome', 'architecture', 'gladiators'],
  },
  {
    id: 'great-pyramid-construction-2560bce',
    name: 'Great Pyramid Construction',
    description:
      'The construction of the Great Pyramid of Giza, one of the Seven Wonders of the Ancient World.',
    location: {
      latitude: 29.9792,
      longitude: 31.1342,
      name: 'Giza, Egypt',
    },
    time: {
      year: 2560,
      era: 'BCE',
      displayName: '2560 BCE',
    },
    tags: ['ancient', 'egypt', 'architecture', 'wonder'],
  },
  {
    id: 'parthenon-construction-432bce',
    name: 'Parthenon Completion',
    description:
      'The completion of the Parthenon temple on the Athenian Acropolis, dedicated to the goddess Athena.',
    location: {
      latitude: 37.9715,
      longitude: 23.7267,
      name: 'Athens, Greece',
    },
    time: {
      year: 432,
      era: 'BCE',
      displayName: '432 BCE',
    },
    tags: ['ancient', 'greece', 'architecture', 'temple'],
  },
  {
    id: 'great-wall-construction-220bce',
    name: 'Great Wall of China',
    description:
      'The unification and expansion of defensive walls into the Great Wall during the Qin Dynasty.',
    location: {
      latitude: 40.4319,
      longitude: 116.5704,
      name: 'Badaling, China',
    },
    time: {
      year: 220,
      era: 'BCE',
      displayName: '220 BCE',
    },
    tags: ['ancient', 'china', 'architecture', 'defense'],
  },

  // Medieval period
  {
    id: 'viking-lindisfarne-793',
    name: 'Viking Raid on Lindisfarne',
    description:
      'The first major Viking raid on the monastery of Lindisfarne, marking the beginning of the Viking Age.',
    location: {
      latitude: 55.6689,
      longitude: -1.7975,
      name: 'Lindisfarne, England',
    },
    time: {
      year: 793,
      era: 'CE',
      displayName: '793 CE',
    },
    tags: ['medieval', 'viking', 'raid', 'monastery'],
  },
  {
    id: 'battle-hastings-1066',
    name: 'Battle of Hastings',
    description:
      'The decisive Norman victory over the Anglo-Saxons that changed the course of English history.',
    location: {
      latitude: 50.9115,
      longitude: 0.4915,
      name: 'Hastings, England',
    },
    time: {
      year: 1066,
      month: 10,
      day: 14,
      era: 'CE',
      displayName: 'October 14, 1066 CE',
    },
    tags: ['medieval', 'battle', 'norman', 'england'],
  },
  {
    id: 'silk-road-peak-1200',
    name: 'Silk Road at Its Peak',
    description:
      'The bustling trade routes of the Silk Road during the Mongol Empire, connecting East and West.',
    location: {
      latitude: 39.9042,
      longitude: 116.4074,
      name: 'Beijing, China',
    },
    time: {
      year: 1200,
      era: 'CE',
      displayName: '1200 CE',
    },
    tags: ['medieval', 'trade', 'silk-road', 'mongol'],
  },

  // Renaissance
  {
    id: 'florence-renaissance-1450',
    name: 'Florence Renaissance',
    description:
      'Florence at the height of the Renaissance, with artists like Botticelli and architects like Brunelleschi transforming the city.',
    location: {
      latitude: 43.7696,
      longitude: 11.2558,
      name: 'Florence, Italy',
    },
    time: {
      year: 1450,
      era: 'CE',
      displayName: '1450 CE',
    },
    tags: ['renaissance', 'art', 'florence', 'italy'],
  },
  {
    id: 'constantinople-fall-1453',
    name: 'Fall of Constantinople',
    description:
      'The Ottoman conquest of Constantinople, marking the end of the Byzantine Empire and the Middle Ages.',
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
      name: 'Istanbul (Constantinople), Turkey',
    },
    time: {
      year: 1453,
      month: 5,
      day: 29,
      era: 'CE',
      displayName: 'May 29, 1453 CE',
    },
    tags: ['renaissance', 'siege', 'ottoman', 'byzantine'],
  },

  // Age of Exploration
  {
    id: 'columbus-landing-1492',
    name: "Columbus's Landing",
    description:
      'Christopher Columbus landing in the Americas, initiating European exploration of the New World.',
    location: {
      latitude: 24.0,
      longitude: -74.5,
      name: 'San Salvador, Bahamas',
    },
    time: {
      year: 1492,
      month: 10,
      day: 12,
      era: 'CE',
      displayName: 'October 12, 1492 CE',
    },
    tags: ['exploration', 'columbus', 'americas', 'discovery'],
  },
  {
    id: 'machu-picchu-peak-1500',
    name: 'Machu Picchu at Its Peak',
    description:
      'The Incan citadel of Machu Picchu during its prime, before Spanish conquest.',
    location: {
      latitude: -13.1631,
      longitude: -72.545,
      name: 'Machu Picchu, Peru',
    },
    time: {
      year: 1500,
      era: 'CE',
      displayName: '1500 CE',
    },
    tags: ['inca', 'peru', 'architecture', 'pre-columbian'],
  },

  // Industrial Revolution
  {
    id: 'london-industrial-1850',
    name: 'Industrial Revolution London',
    description:
      'Victorian London at the height of the Industrial Revolution, with factories, steam engines, and rapid urbanization.',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      name: 'London, England',
    },
    time: {
      year: 1850,
      era: 'CE',
      displayName: '1850 CE',
    },
    tags: ['industrial', 'victorian', 'london', 'technology'],
  },

  // Modern history
  {
    id: 'moon-landing-1969',
    name: 'Apollo 11 Moon Landing',
    description:
      'The historic moment when humanity first set foot on the Moon at the Sea of Tranquility.',
    location: {
      latitude: 0.6744,
      longitude: 23.4731,
      name: 'Sea of Tranquility, Moon',
    },
    time: {
      year: 1969,
      month: 7,
      day: 20,
      era: 'CE',
      displayName: 'July 20, 1969 CE',
    },
    tags: ['modern', 'space', 'moon', 'apollo', 'nasa'],
  },
];
