module.exports = [
  {
    patterns: [/hello/i, /hi/i],
    response: "Hello! I'm your travel planner assistant. Where are you planning to go?",
  },
  {
    patterns: [/suggest.*place/i],
    response: "Sure! Tell me your interests (beaches, mountains, cities) and preferred climate.",
  },
  {
    patterns: [/budget.*trip/i],
    response: "Great! Please share your destination and your approximate budget.",
  },
  {
    patterns: [/thank/i],
    response: "You're welcome! Let me know if you need more help with planning.",
  },
];
