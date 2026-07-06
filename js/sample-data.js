/* ============================================================
 * sample-data.js — Dự án mẫu hoàn chỉnh
 * "Theo & Cloudy — Ngôi Nhà Mới" (60s = 6 cảnh × 10s, stop motion)
 * Nhân vật khớp với 4 character sheet: Theo, Cloudy, Mom, Dad.
 * ============================================================ */

const SAMPLE_PROJECT = {
  name: "Theo & Cloudy — Ngôi Nhà Mới",
  story:
    "Gia đình Theo chuyển đến ngôi nhà mới. Cậu bé Theo (7 tuổi) đang lo lắng vì phải xa nơi ở cũ " +
    "thì phát hiện một đám mây nhỏ biết sống tên Cloudy đang trốn sau ống khói. Cloudy làm mưa kẹo " +
    "để làm quen với Theo, rồi giúp cả nhà khuân đồ đạc bay lơ lửng vào nhà. Nhưng khi lỡ tay làm ướt " +
    "thùng đồ, Cloudy tủi thân xịt xuống thành cơn mưa buồn. Theo ôm lấy Cloudy an ủi, cả nhà cùng nhau " +
    "dọn dẹp, và Cloudy tạo ra cầu vồng rực rỡ trên mái nhà mới — nơi cả gia đình và người bạn mây " +
    "chính thức gọi là NHÀ.",
  styleKey: "stopmotion",
  styleCustom: "",
  durationSec: 60,

  characters: [
    {
      id: "ch-theo",
      name: "Theo",
      role: "main character",
      hasSheet: true,
      description:
        "a 7-year-old boy handcrafted like a stop-motion puppet, fluffy wavy chestnut-brown hair, big warm " +
        "brown eyes, light skin with subtle freckles, wearing an open blue hoodie over a cream T-shirt, " +
        "mustard-yellow shorts, orange sneakers with white socks, and a small grey-blue backpack; curious, " +
        "expressive, cheerful body language"
    },
    {
      id: "ch-cloudy",
      name: "Cloudy",
      role: "main companion",
      hasSheet: true,
      description:
        "a living magical cloud about the size of a beach ball, soft volumetric white cotton-like vapor with " +
        "semi-translucent edges and a subtle inner glow, big friendly blue eyes and a cute smiling mouth on " +
        "the front of the cloud; it can sprout puffy little arms, reshape into umbrellas, ladders and stairs, " +
        "rains colorful miniature candies when happy and gentle grey rain when sad"
    },
    {
      id: "ch-mom",
      name: "Theo's Mom",
      role: "supporting character",
      hasSheet: true,
      description:
        "a warm woman in her mid-30s built like a felt-and-clay stop-motion puppet, shoulder-length wavy dark " +
        "brown hair, gentle smile, wearing a sage-green knit cardigan over an ivory T-shirt, blue rolled-up " +
        "jeans, white sneakers and a simple pendant necklace; calm, loving, reassuring gestures"
    },
    {
      id: "ch-dad",
      name: "Theo's Dad",
      role: "supporting character",
      hasSheet: true,
      description:
        "a tall broad-shouldered man in his late 30s built like a stop-motion puppet, short dark hair, light " +
        "stubble, friendly grin, wearing a rust-orange plaid flannel shirt over a grey T-shirt, dark blue " +
        "jeans, brown leather boots and a wristwatch; playful, animated gestures"
    }
  ],

  locations: [
    {
      id: "loc-street",
      name: "New house exterior",
      description:
        "a cozy miniature two-story family house with cream walls, a brick chimney, a small front yard with a " +
        "tiny mailbox and a moving truck parked at the curb, quiet suburban street, handcrafted diorama look, " +
        "warm golden morning light"
    },
    {
      id: "loc-living",
      name: "Living room",
      description:
        "an empty new living room in the miniature house, cardboard moving boxes everywhere, a blue armchair " +
        "and a sofa wrapped in plastic, a paper-lantern lamp, dust motes in soft window light, handcrafted " +
        "miniature furniture with visible fabric and clay textures"
    },
    {
      id: "loc-roof",
      name: "Rooftop at sunset",
      description:
        "the rooftop and chimney of the miniature house against a hand-painted sunset sky with cotton-wool " +
        "clouds, tiny glowing windows below, warm orange and pink light, whimsical storybook diorama feel"
    }
  ],

  storyFrame: [
    "Act 1 — Arrival: the family arrives at the new house; anxious Theo discovers a shy living cloud hiding behind the chimney.",
    "Act 2 — Friendship & chaos: Cloudy wins Theo over with candy rain and helps the family move in, until an accident makes Cloudy burst into a sad rainstorm.",
    "Act 3 — Home: Theo comforts Cloudy, the family finishes the move together, and Cloudy crowns the new home with a rainbow."
  ],

  scenes: [
    {
      title: "Arrival at the new house",
      location: "New house exterior",
      characters: ["Theo", "Theo's Mom", "Theo's Dad"],
      shots: [
        {
          start: 0.0, end: 2.5,
          description:
            "Wide establishing shot of the miniature suburban street in golden morning light. A small moving " +
            "truck rolls up in front of the cozy handcrafted house and stops with a little bounce. The camera " +
            "slowly pushes in over the tiny front yard."
        },
        {
          start: 2.5, end: 5.0,
          description:
            "Theo hops down from the truck cab clutching his grey-blue backpack, lands with both orange " +
            "sneakers together, and looks up at the new house. Medium shot, low angle from behind him, the " +
            "house towering softly above. His shoulders are tense — he is nervous."
        },
        {
          start: 5.0, end: 7.5,
          description:
            "Dad walks past carrying a comically tall stack of three cardboard boxes that wobbles left and " +
            "right; Mom follows with one box and pats Theo's head reassuringly. Side tracking shot with " +
            "stepped stop-motion movement."
        },
        {
          start: 7.5, end: 10.0,
          description:
            "Theo's gaze drifts up to the roof. Behind the brick chimney, a small white cloud with big blue " +
            "eyes peeks out shyly and instantly ducks back. Close-up on Theo's face turning from nervous to " +
            "wide-eyed amazement. Freeze on his surprised expression."
        }
      ],
      visual_requirements:
        "Warm golden-hour palette, tactile clay and felt textures, miniature diorama depth of field, gentle " +
        "frame-by-frame jitter.",
      audio: {
        ambience: "quiet suburban morning, soft birdsong, distant wind chime",
        sfx:
          "truck engine puttering then stopping with a squeaky handbrake, truck door clunk, Theo's sneakers " +
          "landing on pavement, cardboard boxes shuffling and wobbling creak, a tiny magical 'fwip' when the " +
          "cloud ducks behind the chimney",
        music:
          "playful ukulele and glockenspiel theme starts softly, curious and warm, light tempo",
        dialogue: "No dialogue."
      }
    },
    {
      title: "Candy rain hello",
      location: "New house exterior",
      characters: ["Theo", "Cloudy"],
      shots: [
        {
          start: 0.0, end: 2.0,
          description:
            "Theo tiptoes across the front yard staring up at the chimney, hugging his backpack strap. Over-the-" +
            "shoulder shot from behind Theo toward the roof. Cloudy slowly rises from behind the chimney like a " +
            "shy balloon."
        },
        {
          start: 2.0, end: 4.5,
          description:
            "Cloudy floats down to Theo's eye level and hovers an arm's length away. The two study each other. " +
            "Alternating close-ups: Theo's cautious blinking, Cloudy's big curious blue eyes and nervous wobble."
        },
        {
          start: 4.5, end: 7.5,
          description:
            "Cloudy suddenly giggles, puffs up, and rains a gentle shower of tiny colorful candies over Theo. " +
            "Theo flinches, then catches a candy, tastes it, and bursts out laughing. Slow-motion feel as candies " +
            "bounce off his fluffy hair in stepped stop-motion arcs."
        },
        {
          start: 7.5, end: 10.0,
          description:
            "Theo spreads his arms and spins happily in the candy rain while Cloudy loops a joyful circle around " +
            "him leaving a soft vapor trail. The camera orbits them once and ends on the two new friends face to " +
            "face, both beaming."
        }
      ],
      visual_requirements:
        "Bright cheerful palette with confetti-colored candies, soft volumetric cloud material with inner glow, " +
        "miniature yard set, macro depth of field.",
      audio: {
        ambience: "soft breeze, faint birdsong",
        sfx:
          "shy cloud squeak like a rubber toy, magical shimmer as Cloudy descends, popcorn-like patter of tiny " +
          "candies hitting the ground and bouncing off Theo's hair, Theo's bright giggle, whoosh of Cloudy " +
          "circling",
        music:
          "the ukulele theme blooms with pizzicato strings and celesta sparkles, joyful and bouncy",
        dialogue: "No dialogue."
      }
    },
    {
      title: "Moving day, the magical way",
      location: "New house exterior",
      characters: ["Theo", "Cloudy", "Theo's Mom", "Theo's Dad"],
      shots: [
        {
          start: 0.0, end: 2.5,
          description:
            "Wide shot of the front yard: Cloudy sprouts two puffy vapor arms, lifts a stack of cardboard boxes " +
            "off the truck and floats them in a neat line toward the front door. Theo marches proudly alongside " +
            "like a tiny foreman pointing the way."
        },
        {
          start: 2.5, end: 5.0,
          description:
            "Dad steps out of the doorway and freezes, jaw dropped, as the blue armchair drifts past him in " +
            "mid-air. He rubs his eyes, then shrugs and gives Cloudy a thumbs-up. Medium shot, comic timing with " +
            "stepped movement."
        },
        {
          start: 5.0, end: 7.5,
          description:
            "Mom leans out of the window laughing and points where the furniture should go; Cloudy salutes with " +
            "a vapor arm and gently lowers a lamp through the window. Theo rides sitting on a floating box, " +
            "legs swinging happily."
        },
        {
          start: 7.5, end: 10.0,
          description:
            "Low-angle hero shot: the whole family stands in the yard as the last boxes float overhead in a " +
            "line, Cloudy proudly puffed up above them, little sparkles trailing. Dad high-fives Theo."
        }
      ],
      visual_requirements:
        "Busy but readable staging, floating props on invisible rigs like classic stop-motion trickery, warm " +
        "midday light, consistent puppet designs.",
      audio: {
        ambience: "light neighborhood ambience, a lawn sprinkler ticking far away",
        sfx:
          "boxes creaking as they lift off, airy whoosh of floating furniture, Dad's comedic gasp, window " +
          "squeak, soft magical chime sparkles, crisp high-five slap",
        music:
          "the main theme turns into a cheerful working-montage groove with whistling, hand claps and upright " +
          "bass, medium tempo",
        dialogue: "No dialogue."
      }
    },
    {
      title: "The sad little rainstorm",
      location: "Living room",
      characters: ["Theo", "Cloudy", "Theo's Mom"],
      shots: [
        {
          start: 0.0, end: 2.5,
          description:
            "Inside the new living room full of boxes. Cloudy proudly carries a box labeled with a drawn star, " +
            "but bumps into the paper-lantern lamp; the box tumbles and books spill across the floor. Medium " +
            "wide shot."
        },
        {
          start: 2.5, end: 5.0,
          description:
            "Cloudy gasps, turns pale grey, and shrinks. Dark little storm swirls form on its top. It starts " +
            "drizzling on the spilled books. Close-up of Cloudy's eyes welling up with big glassy tears, " +
            "trembling lip."
        },
        {
          start: 5.0, end: 7.5,
          description:
            "The drizzle becomes a tiny localized rainstorm following Cloudy as it drifts to the corner of the " +
            "room, hiding its face. Mom enters, sees the mess, and softens — she picks up a book and smiles " +
            "kindly. Rain patters on the plastic-wrapped sofa."
        },
        {
          start: 7.5, end: 10.0,
          description:
            "Theo slowly approaches the raining corner holding an umbrella Mom hands him, kneels beside Cloudy " +
            "under the rain, and gently touches the little cloud. Close-up: Cloudy peeks out between its vapor " +
            "arms, sniffling. Hold on the quiet, tender moment."
        }
      ],
      visual_requirements:
        "Cooler blue-grey grade inside the rain area contrasting the warm room, glistening wet miniature props, " +
        "delicate practical-looking rain threads, emotional close-ups.",
      audio: {
        ambience: "muffled indoor quiet, rain pattering on cardboard and plastic wrap",
        sfx:
          "soft bump and tumbling books, a sad squeaky whimper from Cloudy, rising drizzle turning into rain, " +
          "tiny thunder grumble, umbrella popping open, Theo's knees on the wooden floor",
        music:
          "the theme slows to a gentle melancholic music box and soft strings, sparse and tender",
        dialogue: "No dialogue."
      }
    },
    {
      title: "A hug and a team",
      location: "Living room",
      characters: ["Theo", "Cloudy", "Theo's Mom", "Theo's Dad"],
      shots: [
        {
          start: 0.0, end: 2.5,
          description:
            "Theo sets the umbrella down and hugs Cloudy tight; the little cloud melts into the hug. The rain " +
            "above them thins into drifting sparkles. Close two-shot, warm light slowly returning to the room."
        },
        {
          start: 2.5, end: 5.0,
          description:
            "Cloudy brightens back to white, wipes its eyes, and playfully reshapes into a small staircase; " +
            "Theo runs up the cloud-stairs to place a toy plane on the top shelf. Mom claps, Dad whistles, " +
            "impressed."
        },
        {
          start: 5.0, end: 7.5,
          description:
            "Cheerful clean-up montage in one continuous camera move across the room: Dad unrolls a rug, Mom " +
            "hangs a family photo, Cloudy blow-dries the wet books with a warm gentle breeze while Theo lines " +
            "them on a shelf."
        },
        {
          start: 7.5, end: 10.0,
          description:
            "The living room is transformed — cozy, lamp glowing, boxes gone. The family flops onto the sofa " +
            "together and Cloudy settles on Theo's lap like a purring pet. Slow push-in on the happy group."
        }
      ],
      visual_requirements:
        "Warmth gradually replacing the blue-grey grade, cozy lamplight, seamless montage transitions, " +
        "consistent character puppets and props.",
      audio: {
        ambience: "quiet room tone warming up, last rain drips fading",
        sfx:
          "soft fluffy hug squish, sparkle chimes as rain stops, boing of cloud-stairs forming, quick footsteps " +
          "up the steps, rug unrolling thump, picture nail tap-tap, warm breeze whoosh, sofa flop",
        music:
          "music box melody swells back into the full warm ukulele-and-strings theme, hopeful and rising",
        dialogue: "No dialogue."
      }
    },
    {
      title: "A rainbow over home",
      location: "Rooftop at sunset",
      characters: ["Theo", "Cloudy", "Theo's Mom", "Theo's Dad"],
      shots: [
        {
          start: 0.0, end: 2.5,
          description:
            "Sunset. The family sits together on the rooftop ridge with mugs, silhouetted against the hand-" +
            "painted orange-pink sky. Theo pats the spot beside him and Cloudy nestles in. Wide warm shot."
        },
        {
          start: 2.5, end: 5.0,
          description:
            "Theo whispers to Cloudy and points at the sky. Cloudy nods, inhales deeply, puffing up twice its " +
            "size — cheeks comically full. Close-up on the determined little cloud face."
        },
        {
          start: 5.0, end: 8.0,
          description:
            "Cloudy exhales a magnificent arching rainbow that unfurls over the whole house, shimmering with " +
            "tiny sparkles; candy confetti drizzles down the far end. The camera pulls back and cranes up, " +
            "revealing the glowing home under the rainbow."
        },
        {
          start: 8.0, end: 10.0,
          description:
            "Final family portrait: Mom and Dad hug Theo, Theo hugs Cloudy, all laughing under the rainbow as " +
            "the sky deepens to twinkling dusk. Gentle fade out on the warm windows of the new home."
        }
      ],
      visual_requirements:
        "Storybook sunset palette, glowing rim light on the puppets, sparkling handcrafted rainbow made of " +
        "translucent ribbon-like material, emotional finale framing.",
      audio: {
        ambience: "evening crickets beginning, soft warm wind",
        sfx:
          "mugs clinking, Cloudy's big comical inhale, a majestic soft 'whooosh-shimmer' as the rainbow " +
          "unfurls, faint candy confetti patter, family laughter",
        music:
          "full orchestral-folk finale of the main theme — ukulele, strings, glockenspiel and light choir, " +
          "swelling then resolving into a gentle lullaby ending",
        dialogue: "No dialogue."
      }
    }
  ]
};
