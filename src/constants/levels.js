// Local image paths for React Native
import samsonImg from '../assets/images/samson.png';
// import eyesusImg from '../assets/images/eyesus.png';
import theWordImg from '../assets/images/the-word.png';
import creationImg from '../assets/images/creation.png';
import allTheWorldImg from '../assets/images/all-the-world.png';
import songToJesusImg from '../assets/images/song-to-jesus.png';
import jesusImg from '../assets/images/jesus.png';

// Fallback remote URLs for tunnel mode
const REMOTE_IMAGE_BASE = 'https://expo.dev/assets/assets/?platform=ios&hash='; // This would need actual asset hashes

// Local sound paths for React Native
// Use asset references for sounds
const sounds = {
  samson: require('../assets/sounds/samson.MP3'),
  // eyesus: require('../assets/sounds/eyesus.MP3'),
  'the-word': require('../assets/sounds/the-word.MP3'),
  creation: require('../assets/sounds/creation.mp3'),
  'all-the-world': require('../assets/sounds/all-the-world.MP3'),
  'song-to-jesus': require('../assets/sounds/song-to-jesus.MP3'),
  jesus: require('../assets/sounds/jesus.MP3'),
};

const images = {
  samson: samsonImg,
  // eyesus: eyesusImg,
  'the-word': theWordImg,
  creation: creationImg,
  'all-the-world': allTheWorldImg,
  'song-to-jesus': songToJesusImg,
  jesus: jesusImg,
};

// Sounds are already defined above

export const LEVELS = [
  {
    id: 1,
    title: 'Samson',
    bibleRef: 'Judges 13-16',
    verse: '"The Spirit of the Lord came powerfully upon him." - Judges 14:6',
    image: images.samson,
    sound: sounds.samson,
    story: `Samson was a Nazirite dedicated to God from birth, blessed with supernatural strength. He fought against the Philistines who oppressed Israel. With God's power, he killed a lion with his bare hands, defeated 1,000 Philistines with a donkey's jawbone, and tore down the gates of Gaza. Though he was betrayed by Delilah and lost his strength when his hair was cut, Samson repented and God restored his power for one final act. In his death, he destroyed more Philistines than in his entire life, demonstrating God's mercy and redemption.`,
    moves: 50,
    gridSize: 4,
  },
  // {
  //   id: 2,
  //   title: 'Jesus',
  //   bibleRef: 'Matthew 1-28',
  //   verse: '"For God so loved the world that he gave his one and only Son." - John 3:16',
  //   image: images.eyesus,
  //   sound: sounds.eyesus,
  //   story: `Jesus Christ, the Son of God, came to earth to save humanity from sin. He taught about God's love, healed the sick, fed the hungry, and performed many miracles. He showed compassion to outcasts and challenged religious hypocrisy. Jesus willingly died on the cross as a sacrifice for our sins, was buried, and rose again on the third day. His resurrection offers forgiveness, eternal life, and hope to all who believe in Him. Jesus is the way, the truth, and the life.`,
  //   moves: 60,
  //   gridSize: 5,
  // },
  {
    id: 2,
    title: 'Jesus',
    bibleRef: 'Matthew 1-28',
    verse: '"For God so loved the world that he gave his one and only Son." - John 3:16',
    image: images.jesus,
    sound: sounds.jesus,
    story: `Jesus Christ, the Son of God, came to earth to save humanity from sin. He taught about God's love, healed the sick, fed the hungry, and performed many miracles. He showed compassion to outcasts and challenged religious hypocrisy. Jesus willingly died on the cross as a sacrifice for our sins, was buried, and rose again on the third day. His resurrection offers forgiveness, eternal life, and hope to all who believe in Him. Jesus is the way, the truth, and the life.`,
    moves: 60,
    gridSize: 5,
  },
  {
    id: 3,
    title: 'The Word',
    bibleRef: 'Exodus 20',
    verse: '"You shall have no other gods before me." - Exodus 20:3',
    image: images['the-word'],
    sound: sounds['the-word'],
    story: `The Ten Commandments were given by God to Moses on Mount Sinai, serving as fundamental moral laws for humanity. These commandments teach us to love God above all else, honor our parents, and respect others. They guide us in living righteous lives by prohibiting murder, adultery, theft, false witness, and coveting. Jesus summarized these laws with two great commandments: to love God with all our heart, soul, and mind, and to love our neighbor as ourselves. These timeless principles continue to guide believers in faith and conduct.`,
    moves: 55,
    gridSize: 4,
  },
  {
    id: 4,
    title: 'Creation',
    bibleRef: 'Genesis 1',
    verse: '"In the beginning God created the heavens and the earth." - Genesis 1:1',
    image: images.creation,
    sound: sounds.creation,
    story: `In the beginning, God created the heavens and the earth. On the first day, God said "Let there be light," and light appeared, separating day from night. Over the next five days, God created the sky, the land, the sea, plants, animals, and finally, mankind in His image. On the seventh day, God rested, blessing this day and calling it holy. Creation was complete, and it was very good.`,
    moves: 50,
    gridSize: 4,
  },
  {
    id: 5,
    title: 'All The World',
    bibleRef: 'Genesis 2-3',
    verse: '"The Lord God made garments of skin for Adam and his wife and clothed them." - Genesis 3:21',
    image: images['all-the-world'],
    sound: sounds['all-the-world'],
    story: `Adam and Eve were the first humans created by God, placed in the perfect Garden of Eden. They walked with God in harmony and had everything they needed. However, they were tempted by the serpent to disobey God's command not to eat from the Tree of Knowledge. Their sin brought shame, separation from God, and expulsion from the garden. Yet even in judgment, God showed mercy by promising a Savior and providing clothing. This story reminds us of human fallibility and God's unfailing grace and redemption plan.`,
    moves: 65,
    gridSize: 5,
  },
  {
    id: 6,
    title: 'Song To Jesus',
    bibleRef: 'Psalm 150',
    verse: '"Let everything that has breath praise the Lord." - Psalm 150:6',
    image: images['song-to-jesus'],
    sound: sounds['song-to-jesus'],
    story: `Music and praise have always been integral to worship and spiritual expression. Throughout the Bible, we see people singing songs of praise to God, from David's psalms to the angels' announcement at Jesus' birth. Music lifts our spirits, helps us focus on God's goodness, and allows us to express emotions that words alone cannot capture. When we sing to Jesus, we join a timeless chorus of believers throughout history who have used melody and rhythm to honor God, share His love, and experience His presence in a profound way.`,
    moves: 55,
    gridSize: 4,
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
    question: "Who built an ark to save his family and the animals from the flood?",
    options: ["Moses", "Noah", "Abraham", "Adam"],
    correctAnswer: 1,
    reference: "Genesis 6:13-22"
  },
  {
    question: "What did God create on the first day?",
    options: ["Animals", "Plants", "Light", "Human"],
    correctAnswer: 2,
    reference: "Genesis 1:3-5"
  },
  {
    question: "Who was swallowed by a big fish?",
    options: ["Jonah", "Daniel", "Peter", "Samson"],
    correctAnswer: 0,
    reference: "Jonah 1:17"
  },
  {
    question: "What was the name of the giant that David defeated?",
    options: ["Saul", "Goliath", "Samson", "Peter"],
    correctAnswer: 1,
    reference: "1 Samuel 17"
  },
  {
    question: "Who was known for his wisdom and wrote many proverbs?",
    options: ["David", "John", "Jacob", "Solomon"],
    correctAnswer: 3,
    reference: "1 Kings 4:29-34"
  },
  {
    question: "What did Jesus turn water into at the wedding in Cana?",
    options: ["Juice", "Wine", "Milk", "Tea"],
    correctAnswer: 1,
    reference: "John 2:1-11"
  },
  {
    question: "Who was the first man created by God?",
    options: ["Adam", "Noah", "Moses", "Joshua"],
    correctAnswer: 0,
    reference: "Genesis 2:7"
  },
  {
    question: "What food did God provide the Israelites in the desert?",
    options: ["Bread", "Manna", "Fish", "Pizza"],
    correctAnswer: 1,
    reference: "Exodus 16:14-15"
  },
  {
    question: "Who led the Israelites out of Egypt?",
    options: ["Joshua", "James", "Aaron", "Moses"],
    correctAnswer: 3,
    reference: "Exodus 3-14"
  },
  {
    question: "What animal spoke to Balaam?",
    options: ["A lion", "A donkey", "A goat", "A horse"],
    correctAnswer: 1,
    reference: "Numbers 22:21-39"
  }
];

export const getRandomQuestion = () => {
  return BIBLICAL_QUESTIONS[Math.floor(Math.random() * BIBLICAL_QUESTIONS.length)];
};
