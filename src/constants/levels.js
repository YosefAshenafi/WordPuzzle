// Local image paths for React Native
import creationImg from '../assets/images/creation.png';
import noahArkImg from '../assets/images/noah-ark.png';
import davidGoliathImg from '../assets/images/david-goliath.png';
import danielLionsImg from '../assets/images/daniel-lions.png';
import jesusStormImg from '../assets/images/jesus-storm.png';
import resurrectionImg from '../assets/images/resurrection.png';

const images = {
  creation: creationImg,
  'noah-ark': noahArkImg,
  'david-goliath': davidGoliathImg,
  'daniel-lions': danielLionsImg,
  'jesus-storm': jesusStormImg,
  resurrection: resurrectionImg,
};

export const LEVELS = [
  {
    id: 1,
    title: 'Creation',
    bibleRef: 'Genesis 1',
    image: images.creation,
    story: `In the beginning, God created the heavens and the earth. On the first day, God said "Let there be light," and light appeared, separating day from night. Over the next five days, God created the sky, the land, the sea, plants, animals, and finally, mankind in His image. On the seventh day, God rested, blessing this day and calling it holy. Creation was complete, and it was very good.`,
    moves: 50,
    gridSize: 4,
  },
  {
    id: 2,
    title: "Noah's Ark",
    bibleRef: 'Genesis 6-9',
    image: images['noah-ark'],
    story: `God saw that the earth was filled with wickedness and decided to send a great flood. He commanded Noah, a righteous man, to build an ark and bring two of every kind of animal into it, along with his family. For 40 days and 40 nights, rain fell upon the earth. When the waters receded, the ark rested on the mountains of Ararat. God made a covenant with Noah, placing a rainbow in the sky as a sign that He would never destroy the earth by flood again.`,
    moves: 55,
    gridSize: 4,
  },
  {
    id: 3,
    title: 'David and Goliath',
    bibleRef: '1 Samuel 17',
    image: images['david-goliath'],
    story: `The giant Goliath challenged the Israelites to send a champion to fight him. All the soldiers were afraid, but young David, a shepherd boy, accepted the challenge. Armed only with his sling and five smooth stones, David faced the mighty Goliath. With faith in God, David hurled a stone that struck Goliath in the forehead, and the giant fell. David's courage and trust in the Lord showed that size and strength are nothing compared to faith in God.`,
    moves: 60,
    gridSize: 5,
  },
  {
    id: 4,
    title: "Daniel's Faith",
    bibleRef: 'Daniel 6',
    image: images['daniel-lions'],
    story: `King Darius made a law that no one could pray to any god except him. Daniel, a faithful servant of God, continued to pray to the Lord three times daily. He was thrown into a den of lions as punishment. But God sent an angel to shut the lions' mouths, and they did not harm Daniel. The next morning, Daniel emerged unharmed. King Darius saw the power of God and issued a new decree honoring the God of Daniel.`,
    moves: 65,
    gridSize: 5,
  },
{
    id: 5,
    title: 'Jesus Calms the Storm',
    bibleRef: 'Mark 4:35-41',
    image: images['jesus-storm'],
    story: `Jesus and His disciples were crossing the Sea of Galilee when a fierce storm arose, with waves crashing over the boat. The disciples were afraid and woke Jesus, who was sleeping. Jesus rose and rebuked the wind, saying "Peace, be still." Immediately, the storm ceased, and there was great calm. Jesus asked His disciples why they had no faith, and they marveled, saying "What kind of man is this, that even the wind and sea obey Him?"`,
    moves: 70,
    gridSize: 5,
  },
  {
    id: 6,
    title: 'Resurrection',
    bibleRef: 'Luke 24',
    image: images.resurrection,
    story: `After Jesus was crucified, His body was placed in a tomb. On the third day, women came to anoint Him with spices, but found the stone rolled away. An angel told them: "He is not here; He has risen!" Jesus appeared to His disciples and many others over 40 days, proving He was alive. His resurrection defeated death and sin, offering all who believe in Him eternal life and hope.`,
    moves: 75,
    gridSize: 6,
  },
];

export const VERSES = [
  '"In the beginning God created the heavens and the earth." - Genesis 1:1',
  '"The Lord is my light and my salvation." - Psalm 27:1',
  '"For God so loved the world that he gave his one and only Son." - John 3:16',
  '"Trust in the Lord with all your heart." - Proverbs 3:5',
  '"I can do all this through him who gives me strength." - Philippians 4:13',
  '"Be strong and courageous. Do not be afraid." - Joshua 1:9',
  '"Let us run with perseverance the race marked out for us." - Hebrews 12:1',
  '"Peace I leave with you; my peace I give to you." - John 14:27',
];

export const getRandomVerse = () => {
  return VERSES[Math.floor(Math.random() * VERSES.length)];
};

export const BIBLICAL_QUESTIONS = [
  {
    question: "Who built the ark?",
    options: ["Abraham", "Noah", "Moses", "David"],
    correctAnswer: 1,
    reference: "Genesis 6:13-22"
  },
  {
    question: "What was the first miracle Jesus performed?",
    options: ["Walking on water", "Turning water into wine", "Healing the blind", "Raising Lazarus"],
    correctAnswer: 1,
    reference: "John 2:1-11"
  },
  {
    question: "Who defeated Goliath?",
    options: ["Saul", "Jonathan", "David", "Samuel"],
    correctAnswer: 2,
    reference: "1 Samuel 17"
  },
  {
    question: "How many days did God take to create the world?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    reference: "Genesis 1"
  },
  {
    question: "Who was thrown into the lions' den?",
    options: ["Jeremiah", "Ezekiel", "Daniel", "Isaiah"],
    correctAnswer: 2,
    reference: "Daniel 6"
  },
  {
    question: "What is the Golden Rule?",
    options: ["Love your neighbor as yourself", "Honor your father and mother", "Keep the Sabbath holy", "You shall not steal"],
    correctAnswer: 0,
    reference: "Matthew 7:12"
  },
  {
    question: "Who led the Israelites out of Egypt?",
    options: ["Abraham", "Joseph", "Moses", "Joshua"],
    correctAnswer: 2,
    reference: "Exodus 3-14"
  },
  {
    question: "What is the last book of the Bible?",
    options: ["Revelation", "Jude", "3 John", "Malachi"],
    correctAnswer: 0,
    reference: "Revelation 1:1"
  },
  {
    question: "How many disciples did Jesus have?",
    options: ["7", "10", "12", "15"],
    correctAnswer: 2,
    reference: "Matthew 10:1-4"
  },
  {
    question: "Who denied Jesus three times?",
    options: ["Judas", "Peter", "John", "Thomas"],
    correctAnswer: 1,
    reference: "Matthew 26:69-75"
  }
];

export const getRandomQuestion = () => {
  return BIBLICAL_QUESTIONS[Math.floor(Math.random() * BIBLICAL_QUESTIONS.length)];
};
