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

// Level content with translations
const LEVEL_CONTENT = {
  en: [
    {
      id: 1,
      title: 'Samson',
      bibleRef: 'Judges 13-16',
      verse: '"The Spirit of the Lord came powerfully upon him." - Judges 14:6',
      story: `Samson was a Nazirite dedicated to God from birth, blessed with supernatural strength. He fought against the Philistines who oppressed Israel. With God's power, he killed a lion with his bare hands, defeated 1,000 Philistines with a donkey's jawbone, and tore down the gates of Gaza. Though he was betrayed by Delilah and lost his strength when his hair was cut, Samson repented and God restored his power for one final act. In his death, he destroyed more Philistines than in his entire life, demonstrating God's mercy and redemption.`,
    },
    {
      id: 2,
      title: 'Jesus',
      bibleRef: 'Matthew 1-28',
      verse: '"For God so loved the world that he gave his one and only Son." - John 3:16',
      story: `Jesus Christ, the Son of God, came to earth to save humanity from sin. He taught about God's love, healed the sick, fed the hungry, and performed many miracles. He showed compassion to outcasts and challenged religious hypocrisy. Jesus willingly died on the cross as a sacrifice for our sins, was buried, and rose again on the third day. His resurrection offers forgiveness, eternal life, and hope to all who believe in Him. Jesus is the way, the truth, and the life.`,
    },
    {
      id: 3,
      title: 'The Word',
      bibleRef: 'Exodus 20',
      verse: '"You shall have no other gods before me." - Exodus 20:3',
      story: `The Ten Commandments were given by God to Moses on Mount Sinai, serving as fundamental moral laws for humanity. These commandments teach us to love God above all else, honor our parents, and respect others. They guide us in living righteous lives by prohibiting murder, adultery, theft, false witness, and coveting. Jesus summarized these laws with two great commandments: to love God with all our heart, soul, and mind, and to love our neighbor as ourselves. These timeless principles continue to guide believers in faith and conduct.`,
    },
    {
      id: 4,
      title: 'Creation',
      bibleRef: 'Genesis 1',
      verse: '"In the beginning God created the heavens and the earth." - Genesis 1:1',
      story: `In the beginning, God created the heavens and the earth. On the first day, God said "Let there be light," and light appeared, separating day from night. Over the next five days, God created the sky, the land, the sea, plants, animals, and finally, mankind in His image. On the seventh day, God rested, blessing this day and calling it holy. Creation was complete, and it was very good.`,
    },
    {
      id: 5,
      title: 'All The World',
      bibleRef: 'Genesis 2-3',
      verse: '"The Lord God made garments of skin for Adam and his wife and clothed them." - Genesis 3:21',
      story: `Adam and Eve were the first humans created by God, placed in the perfect Garden of Eden. They walked with God in harmony and had everything they needed. However, they were tempted by the serpent to disobey God's command not to eat from the Tree of Knowledge. Their sin brought shame, separation from God, and expulsion from the garden. Yet even in judgment, God showed mercy by promising a Savior and providing clothing. This story reminds us of human fallibility and God's unfailing grace and redemption plan.`,
    },
    {
      id: 6,
      title: 'Song To Jesus',
      bibleRef: 'Psalm 150',
      verse: '"Let everything that has breath praise the Lord." - Psalm 150:6',
      story: `Music and praise have always been integral to worship and spiritual expression. Throughout the Bible, we see people singing songs of praise to God, from David's psalms to the angels' announcement at Jesus' birth. Music lifts our spirits, helps us focus on God's goodness, and allows us to express emotions that words alone cannot capture. When we sing to Jesus, we join a timeless chorus of believers throughout history who have used melody and rhythm to honor God, share His love, and experience His presence in a profound way.`,
    },
  ],
  am: [
    {
      id: 1,
      title: 'ሳምሶን',
      bibleRef: 'መሳፍንት 13-16',
      verse: '"የእግዚአብሔር መንፈስ በኃይል በእርሱ ላይ መጣ።" - መሳፍንት 14:6',
      story: `ሳምሶን ከልደት ጀምሮ ለእግዚአብሔር የተሰጠ ናዝራዊ ነበር፣ በልዩ ኃይል የተባረከ። እስራኤልን የጨቋው ፊልስጥኤማውያንን ተዋጋ። በእግዚአብሔር ኃይል አንበሳን በክንዱ ገደለ፣ 1,000 ፊልስጥኤማውያንን በአህያ መንጋጋ አሸነፈ፣ እና የጋዛ በሮችን አፈረሰ። ደሊላ ባታዘው እና ፀጉሩ ሲቆረጥ ኃይሉን አጣ። ሆኖም ግን ሳምሶን ንስሃ መለሰ እና እግዚአብሔር ኃይሉን ለመጨረሻ ተግባር መለሰለት። በሞቱ በሙሉ ህይወቱ ያሸነፈውን ይበልጥ ብዙ ፊልስጥኤማውያንን አጠፋ፣ የእግዚአብሔርን ምሕረት እና ቤዛነት አሳየ።`,
    },
    {
      id: 2,
      title: 'ኢየሱስ',
      bibleRef: 'ማቴዎስ 1-28',
      verse: '"እግዚአብሔር ዓለምን በጣም ስለወደዳት አንድ ልጁን ሰጠ።" - ዮሐንስ 3:16',
      story: `ኢየሱስ ክርስቶስ፣ የእግዚአብሔር ልጅ፣ ሰው ልጅን ከኀጢአት ለማዳን ወደ ምድር መጣ። የእግዚአብሔርን ፍቅር አስተማረ፣ ታማሚዎችን አዳነ፣ ራቦችን መገበ፣ እና ብዙ ተአምራት አደረገ። ለተገለሉ ሰዎች ርኅሩኅ ነበር እና የሃይማኖት ግብዝነትን ተከራከረ። ኢየሱስ በፈቃዱ ለኀጢአታችን መሥዋዕት በመስቀል ላይ ሞተ፣ ተቀበረ፣ እና በሦስተኛው ቀን ተነሳ። የእርሱ ትንሣኤ ይቅርታ፣ ዘላለማዊ ሕይወት፣ እና ተስፋ በእርሱ ለሚያምኑ ሁሉ ይሰጣል። ኢየሱስ መንገድ፣ እውነት እና ሕይወት ነው።`,
    },
    {
      id: 3,
      title: 'ቃሉ',
      bibleRef: 'ዘጸአት 20',
      verse: '"ከእኔ በፊት ሌላ አምላክ አይኑርህ።" - ዘጸአት 20:3',
      story: `አሥሩ ትእዛዛት በእግዚአብሔር ለሙሴ በሲናይ ተራራ ላይ ተሰጡ፣ ለሰው ልጅ መሠረታዊ የሥነ ምግባር ሕጎች እንዲሆኑ። እነዚህ ትእዛዛት እግዚአብሔርን ከሁሉ በላይ እንድናፈቅር፣ ወላጆቻችንን እንድናከብር፣ እና ሌሎችን እንድናከብር ያስተምሩናል። ግድያን፣ ለመን፣ ስርቆትን፣ ሐሰተኛ ምስክር፣ እና መመኝን በማግደት ጻድቅ ሕይወት እንድንኖር ይመራሉን። ኢየሱስ እነዚህን ሕጎች በሁለት ታላላቅ ትእዛዛት አጠቃለለ፡ እግዚአብሔርን በሁሉ ልባችን፣ በሁሉ ነፍሳችን፣ እና በሁሉ አእምሮአችን እንድናፈቅር፣ እና ጎረቤታችንን እንደራሳችን እንድናፈቅር። እነዚህ የማይሟገቱ መርሆች አሁንም ያምናለና በእምነት እና በባህሪ ይመራሉ።`,
    },
    {
      id: 4,
      title: 'ፍጥረት',
      bibleRef: 'ዘፍጥረት 1',
      verse: '"መጀመሪያ ላይ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።" - ዘፍጥረት 1:1',
      story: `መጀመሪያ ላይ፣ እግዚአብሔር ሰማይንና ምድርን ፈጠረ። በመጀመሪያው ቀን፣ እግዚአብሔር "ብርሃን ይሁን" አለ፣ እና ብርሃን ታየ፣ ቀንና ሌሊትን አለየ። በሚቀጥሉት አምስት ቀናት፣ እግዚአብሔር ሰማይን፣ መሬትን፣ ባህርን፣ እፅዋትን፣ እንስሳትን፣ እና በመጨረሻም ሰውን በራሱ ምስል ፈጠረ። በሰባተኛው ቀን፣ እግዚአብሔር አረፈ፣ ይህንን ቀን ባረከ እና ቅዱስ አደረገው። ፍጥረት ተጠናቀቀ፣ እና በጣም ጥሩ ነበር።`,
    },
    {
      id: 5,
      title: 'ሁሉም ዓለም',
      bibleRef: 'ዘፍጥረት 2-3',
      verse: '"እግዚአብሔር ለአዳምና ለሚስቱ የቆዳ ልብስ ሰራላቸው እና አላበሳቸው።" - ዘፍጥረት 3:21',
      story: `አዳምና ሔዋን በእግዚአብሔር የተፈጠሩ የመጀመሪያ ሰዎች ነበሩ፣ በፍጹም የኤደን ገነት ተቀመጡ። ከእግዚአብሔር ጋር በስምምነት ተጓዙ እና የሚያስፈልጋቸውን ሁሉ ነበራቸው። ሆኖም፣ ከእውቀት ዛፍ እንዳይበሉ የእግዚአብሔርን ትእዛዝ እንዲጥሱ በእባብ ተጓለሉ። ኀጢአታቸው ፀፍ፣ ከእግዚአብሔር መለየት፣ እና ከገነት መባረር አመጣ። ሆኖም በፍርድም እንኳ፣ እግዚአብሔር መድኅንን በመተንበይ እና ልብስ በመስጠት ምሕረትን አሳየ። ይህ ታሪክ የሰው ልጅ ድክመት እና የእግዚአብሔር የማይለወጥ ቸርነት እና የቤዛነት እቅድ ያስታውሳናል።`,
    },
    {
      id: 6,
      title: 'ለኢየሱስ መዝሙር',
      bibleRef: 'መዝሙር 150',
      verse: '"እስትንፋስ ያለው ሁሉ እግዚአብሔርን ያመስግን።" - መዝሙር 150:6',
      story: `ሙዚቃና ምስጋና ሁልጊዜ ለአምልኮ እና መንፈሳዊ መግለጫ አስፈላጊ ነበሩ። በመጽሐፍ ቅዱስ ውስጥ፣ ሰዎች ለእግዚአብሔር የምስጋና መዝሙሮችን ሲዘፍኑ እናያለን፣ ከዳዊት መዝሙሮች እስከ መላእክት በኢየሱስ ልደት ማስታወቂያ። ሙዚቃ መንፈሳችንን ያነሳል፣ በእግዚአብሔር መልካም ላይ እንድናተኩር ያግዘናል፣ እና ቃላት ብቻ ሊገልጹ የማይችሉ ስሜቶችን እንድንገልጽ ያስችለናል። ለኢየሱስ ስንዘፍን፣ በታሪክ ውስጥ እግዚአብሔርን ለማክበር፣ ፍቅሩን ለማካፈል፣ እና መገኘቱን በጥልቅ ለመለማመድ ዜማና ምት በተጠቀሙ የማይጠፋ የአማኞች ቁጥር እንቀላቀላለን።`,
    },
  ],
};

// Level metadata (same for all languages)
const LEVEL_METADATA = [
  { id: 1, imageKey: 'samson', soundKey: 'samson', moves: 50, gridSize: 4 },
  { id: 2, imageKey: 'jesus', soundKey: 'jesus', moves: 60, gridSize: 5 },
  { id: 3, imageKey: 'the-word', soundKey: 'the-word', moves: 55, gridSize: 4 },
  { id: 4, imageKey: 'creation', soundKey: 'creation', moves: 50, gridSize: 4 },
  { id: 5, imageKey: 'all-the-world', soundKey: 'all-the-world', moves: 65, gridSize: 5 },
  { id: 6, imageKey: 'song-to-jesus', soundKey: 'song-to-jesus', moves: 55, gridSize: 4 },
];

// Helper function to get levels for a specific language
export const getLevels = (language = 'en') => {
  const content = LEVEL_CONTENT[language] || LEVEL_CONTENT.en;
  return LEVEL_METADATA.map((meta, index) => ({
    ...meta,
    ...content[index],
    image: images[meta.imageKey],
    sound: sounds[meta.soundKey],
  }));
};

// Default export for backward compatibility
export const LEVELS = getLevels('en');

// Verses with translations
const VERSES_CONTENT = {
  en: [
    '"In the beginning God created the heavens and the earth." - Genesis 1:1',
    '"The Lord is my light and my salvation." - Psalm 27:1',
    '"For God so loved the world that he gave his one and only Son." - John 3:16',
    '"Trust in the Lord with all your heart." - Proverbs 3:5',
    '"I can do all this through him who gives me strength." - Philippians 4:13',
    '"Be strong and courageous. Do not be afraid." - Joshua 1:9',
    '"Let us run with perseverance the race marked out for us." - Hebrews 12:1',
    '"Peace I leave with you; my peace I give to you." - John 14:27',
  ],
  am: [
    '"መጀመሪያ ላይ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።" - ዘፍጥረት 1:1',
    '"እግዚአብሔር ብርሃኔና መድኃኒቴ ነው።" - መዝሙር 27:1',
    '"እግዚአብሔር ዓለምን በጣም ስለወደዳት አንድ ልጁን ሰጠ።" - ዮሐንስ 3:16',
    '"በሁሉ ልብህ እግዚአብሔርን እመን።" - ምሳሌ 3:5',
    '"ኃይል የሚሰጠኝ በእርሱ በኩል ሁሉን ማድረግ እችላለሁ።" - ፊልጵስዩስ 4:13',
    '"ጠንካራና ድፍረተኛ ሁን። አትፍራ።" - ኢያሱ 1:9',
    '"ለእኛ የተዘጋጀውን ውድድር በትእግስት እንሩጥ።" - ዕብራውያን 12:1',
    '"ሰላምን እተውላችኋለሁ፤ ሰላሜን እሰጣችኋለሁ።" - ዮሐንስ 14:27',
  ],
};

export const VERSES = VERSES_CONTENT.en;

export const getRandomVerse = (language = 'en') => {
  const verses = VERSES_CONTENT[language] || VERSES_CONTENT.en;
  return verses[Math.floor(Math.random() * verses.length)];
};

// Biblical questions with translations
const BIBLICAL_QUESTIONS_CONTENT = {
  en: [
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
  ],
  am: [
    {
      question: "ቤተሰቡንና እንስሳትን ከጎርፉ ለማዳን መርከብ የገነባው ማን ነው?",
      options: ["ሙሴ", "ኖኅ", "አብርሃም", "አዳም"],
      correctAnswer: 1,
      reference: "ዘፍጥረት 6:13-22"
    },
    {
      question: "እግዚአብሔር በመጀመሪያው ቀን ምን ፈጠረ?",
      options: ["እንስሳት", "እጽዋት", "ብርሃን", "ሰው"],
      correctAnswer: 2,
      reference: "ዘፍጥረት 1:3-5"
    },
    {
      question: "በትልቅ ዓሳ የተዋጠው ማን ነው?",
      options: ["ዮናስ", "ዳንኤል", "ጴጥሮስ", "ሳምሶን"],
      correctAnswer: 0,
      reference: "ዮናስ 1:17"
    },
    {
      question: "ዳዊት የደበደበው ግዙፍ ስሙ ምን ነበር?",
      options: ["ሳኡል", "ጎልያድ", "ሳምሶን", "ጴጥሮስ"],
      correctAnswer: 1,
      reference: "1 ሳሙኤል 17"
    },
    {
      question: "በጥበቡ የታወቀና ብዙ ምሳሌዎችን የጻፈው ማን ነው?",
      options: ["ዳዊት", "ዮሐንስ", "ያዕቆብ", "ሰሎሞን"],
      correctAnswer: 3,
      reference: "1 ነገሥት 4:29-34"
    },
    {
      question: "ኢየሱስ በቃና ሰርግ ላይ ውሃን ወደ ምን ቀየረ?",
      options: ["ጁስ", "ወይን", "ወተት", "ሻይ"],
      correctAnswer: 1,
      reference: "ዮሐንስ 2:1-11"
    },
    {
      question: "በእግዚአብሔር የተፈጠረው የመጀመሪያ ሰው ማን ነው?",
      options: ["አዳም", "ኖኅ", "ሙሴ", "ኢያሱ"],
      correctAnswer: 0,
      reference: "ዘፍጥረት 2:7"
    },
    {
      question: "እግዚአብሔር ለእስራኤላውያን በምድረ በዳ የሰጠ ምግብ ምን ነበር?",
      options: ["እንጀራ", "ማና", "ዓሣ", "ፒዛ"],
      correctAnswer: 1,
      reference: "ዘጸአት 16:14-15"
    },
    {
      question: "እስራኤላውያንን ከግብጽ የመራው ማን ነው?",
      options: ["ኢያሱ", "ያዕቆብ", "አሮን", "ሙሴ"],
      correctAnswer: 3,
      reference: "ዘጸአት 3-14"
    },
    {
      question: "ከባላም ጋር የተነጋገረው እንስሳ ምንድን ነው?",
      options: ["አንበሳ", "አህያ", "ፍየል", "ፈረስ"],
      correctAnswer: 1,
      reference: "ዘኁልቁ 22:21-39"
    }
  ],
};

export const BIBLICAL_QUESTIONS = BIBLICAL_QUESTIONS_CONTENT.en;

export const getRandomQuestion = (language = 'en') => {
  const questions = BIBLICAL_QUESTIONS_CONTENT[language] || BIBLICAL_QUESTIONS_CONTENT.en;
  return questions[Math.floor(Math.random() * questions.length)];
};
