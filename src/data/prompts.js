export const PROMPTS = {
  "Romantic ❤️": [
    "Draw our dream weekend getaway cabin.",
    "Draw the proposal or future anniversary of our dreams.",
    "Draw us watching the sunset on our favorite beach.",
    "Draw the moment you knew you had feelings for me.",
    "Draw us 10 years from today with our favorite pets.",
    "Draw our dream breakfast in bed date."
  ],
  "Funny 😂": [
    "Draw me trying to wake up on a Monday morning.",
    "Draw what happens when I say 'I am not hungry' and your fries arrive.",
    "Draw our relationship as an action movie poster.",
    "Draw my cooking skills without burning the canvas.",
    "Draw what I look like when I get hangry.",
    "Draw us trying to assemble flat-pack furniture together."
  ],
  "Cute 🥹": [
    "Draw our comfort date night: blankets, snacks, and movies.",
    "Draw the first thing you noticed about my smile.",
    "Draw a cute animal that matches my true personality.",
    "Draw your happiest small moment with me this year.",
    "Draw our secret handshake or special hugs."
  ],
  "Guess Me 🧠": [
    "Draw what you think is my all-time favorite comfort food.",
    "Draw my ultimate dream vacation spot.",
    "Draw what I would instantly impulse-buy with $1,000.",
    "Draw the superpower I wish I had every day.",
    "Draw my absolute dream car or cozy ride."
  ]
};

export function getRandomPrompt(category) {
  const list = category && PROMPTS[category] ? PROMPTS[category] : Object.values(PROMPTS).flat();
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}