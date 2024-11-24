import { auth, db } from './testFirebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const TEST_USERS = [
    {
      email: "tech1@test.com",
      password: "test123",
      username: "Alex_Tech",
      demographics: {
        age: 24,
        birthDate: 915148800000,
        city: "San Francisco",
        gender: "Male",
        state: "California"
      },
      onboarding: {
        responses: {
          location: {
            answer: "Grew up in San Jose - loved the tech energy but it was expensive. Moved to SF for work and honestly love it even more. The city has such a great mix of cultures and there's always something happening.",
            updatedAt: null
          },
          hobbies: {
            answer: "I'm really into building mechanical keyboards - love the satisfaction of putting together something unique. Also started rock climbing at Mission Cliffs last year and got hooked. It's like solving puzzles with your body.",
            updatedAt: null
          },
          relationships: {
            answer: "Super close with my sister - we game together online every week even though she's in Seattle. Have a core group of friends from college who all work in tech too, and we meet up for board game nights.",
            updatedAt: null
          },
          music: {
            answer: "Love electronic music when coding - artists like Tycho and Bonobo help me focus. Been getting into synthwave lately too, especially The Midnight and FM-84.",
            updatedAt: null
          },
          entertainment: {
            answer: "Big fan of sci-fi shows like Black Mirror and Severance - they really make you think about where tech is headed. Also loved Everything Everywhere All at Once, probably watched it 5 times now!",
            updatedAt: null
          },
          travel: {
            answer: "Visited Japan last year - Tokyo's tech scene was mind-blowing and the food was incredible. Also loved exploring the temples in Kyoto, such a cool contrast of old and new.",
            updatedAt: null
          },
          aspirations: {
            answer: "Really want to learn Japanese! Been using apps but would love to take proper classes. Also want to try surfing - keep seeing people at Ocean Beach but haven't built up the courage yet.",
            updatedAt: null
          }
        }
      }
    },
    {
      email: "artist1@test.com",
      password: "test123",
      username: "Maya_Art",
      demographics: {
        age: 22,
        birthDate: 978307200000,
        city: "Portland",
        gender: "Non-binary",
        state: "Oregon"
      },
      onboarding: {
        responses: {
          location: {
            answer: "Born and raised in Seattle which was great but too gloomy. Moved to Portland two years ago and it feels more like home. The creative community here is so welcoming and inspiring.",
            updatedAt: null
          },
          hobbies: {
            answer: "I do digital art and just started learning tattoo design which is super exciting. Also love taking street photos on my film camera - there's something magical about not knowing how they'll turn out.",
            updatedAt: null
          },
          relationships: {
            answer: "Really close to my mom - she's an artist too and always encouraged my creativity. Have an elderly cat named Pixel who's been with me since high school. Made some amazing friends at local art shows.",
            updatedAt: null
          },
          music: {
            answer: "Into indie folk and alternative rock - Big Thief, Phoebe Bridgers, and The National are on repeat. Love discovering new bands at secret shows around the city.",
            updatedAt: null
          },
          entertainment: {
            answer: "Studio Ghibli films are my comfort movies - Spirited Away never gets old. Currently reading 'Just Kids' by Patti Smith and it's so inspiring. Can't get enough of Everything Everywhere All at Once!",
            updatedAt: null
          },
          travel: {
            answer: "Did a solo trip to Europe last year - spent a month backpacking and sketching street scenes. Amsterdam's art museums blew my mind, and Berlin's street art scene was incredible.",
            updatedAt: null
          },
          aspirations: {
            answer: "Dream of learning ceramics - there's something so appealing about creating functional art. Would also love to learn screen printing to make my own merch someday.",
            updatedAt: null
          }
        }
      }
    },
    {
        email: "fitness1@test.com",
        password: "test123",
        username: "Chris_Fit",
        demographics: {
          age: 28,
          birthDate: 867715200000,
          city: "Miami",
          gender: "Male",
          state: "Florida"
        },
        onboarding: {
          responses: {
            location: {
              answer: "Originally from Chicago where winters kept everyone indoors. Moved to Miami three years ago and it's perfect - outdoor training year-round! Love the energy here and beach workouts are the best.",
              updatedAt: null
            },
            hobbies: {
              answer: "CrossFit is my main thing - compete locally and coach classes too. Also into beach volleyball and just started surfing. Something about challenging yourself physically just feels amazing.",
              updatedAt: null
            },
            relationships: {
              answer: "My gym community is like family - we suffer through workouts together! Have a golden retriever named Max who's my running buddy. Parents still in Chicago but visit often for the weather!",
              updatedAt: null
            },
            music: {
              answer: "Love high-energy stuff for workouts - EDM and hip-hop mostly. The Weeknd, Drake, and a lot of house music. Nothing better than a good gym playlist!",
              updatedAt: null
            },
            entertainment: {
              answer: "Big fan of sports documentaries - The Last Dance was incredible. Just finished watching all of Ted Lasso which was surprisingly motivating. Reading 'Atomic Habits' right now.",
              updatedAt: null
            },
            travel: {
              answer: "Did a fitness retreat in Costa Rica last year - amazing jungle workouts! Also loved hiking in Colorado, though the altitude was brutal. Want to try skiing there next.",
              updatedAt: null
            },
            aspirations: {
              answer: "Really want to learn Olympic weightlifting properly - those movements are so technical. Also interested in getting my nutrition certification to help my clients better.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "gamer1@test.com",
        password: "test123",
        username: "Sarah_Game",
        demographics: {
          age: 19,
          birthDate: 1041379200000,
          city: "Seattle",
          gender: "Female",
          state: "Washington"
        },
        onboarding: {
          responses: {
            location: {
              answer: "Seattle born and raised! The rainy weather is perfect for gaming. Thought about moving somewhere sunnier but the tech and gaming scene here is unbeatable.",
              updatedAt: null
            },
            hobbies: {
              answer: "Huge into competitive gaming - mainly Valorant and League. Started streaming on Twitch last year which has been super fun. Also collect gaming merch and figurines.",
              updatedAt: null
            },
            relationships: {
              answer: "Met my best friends through gaming - we've been playing together for years even though we're in different cities. Have a cat named Pixel who loves watching me play.",
              updatedAt: null
            },
            music: {
              answer: "Love listening to game soundtracks while studying - The Last of Us and Nier soundtracks are amazing. Also really into K-pop, especially BLACKPINK and BTS.",
              updatedAt: null
            },
            entertainment: {
              answer: "Obsessed with anime - just finished Cyberpunk: Edgerunners and it was incredible. Love watching esports tournaments too. The Arcane series was probably my favorite show ever.",
              updatedAt: null
            },
            travel: {
              answer: "Been to PAX West every year and went to TwitchCon in San Diego. Really want to visit Japan for the gaming cafes and anime culture!",
              updatedAt: null
            },
            aspirations: {
              answer: "Want to learn Japanese - would help with gaming and anime! Also interested in game development, thinking about taking some coding classes.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "music1@test.com",
        password: "test123",
        username: "Zack_Music",
        demographics: {
          age: 25,
          birthDate: 915148800000,
          city: "Nashville",
          gender: "Male",
          state: "Tennessee"
        },
        onboarding: {
          responses: {
            location: {
              answer: "Moved to Nashville from Indiana two years ago to pursue music. Best decision ever - the music scene here is incredible, there's live music everywhere. Love how friendly everyone is.",
              updatedAt: null
            },
            hobbies: {
              answer: "Guitar is my main thing - play in two local bands. Also into home recording and started teaching guitar lessons. Building a little home studio in my spare time.",
              updatedAt: null
            },
            relationships: {
              answer: "My bandmates are like brothers - we practice twice a week and hang out all the time. Got a rescue dog named Blues who loves when I practice guitar.",
              updatedAt: null
            },
            music: {
              answer: "Everything from blues to indie rock. John Mayer, Gary Clark Jr., and The War on Drugs are big influences. Love discovering local bands at small venues.",
              updatedAt: null
            },
            entertainment: {
              answer: "Really into music documentaries - Sound City and It Might Get Loud are favorites. Been reading Keith Richards' autobiography. The Bear perfectly captures kitchen life from my restaurant days.",
              updatedAt: null
            },
            travel: {
              answer: "Toured with my band through the Southeast last summer - small venues but amazing experience. Memphis and New Orleans were highlights, such rich music history.",
              updatedAt: null
            },
            aspirations: {
              answer: "Want to learn pedal steel guitar - such a beautiful sound in country music. Also interested in music production, would love to produce other local artists.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "foodie1@test.com",
        password: "test123",
        username: "Sophia_Food",
        demographics: {
          age: 27,
          birthDate: 867715200000,
          city: "Chicago",
          gender: "Female",
          state: "Illinois"
        },
        onboarding: {
          responses: {
            location: {
              answer: "Chicago native and proud of it! Tried living in LA for a year but missed the food scene here too much. Each neighborhood has its own amazing restaurants and markets to explore.",
              updatedAt: null
            },
            hobbies: {
              answer: "Love cooking - especially trying recipes from different cultures. Started a food blog last year. Also into food photography and growing my own herbs. Weekend farmers markets are my happy place.",
              updatedAt: null
            },
            relationships: {
              answer: "Super close with my mom - we cook together every Sunday using my grandma's recipes. Have a group of friends who love trying new restaurants as much as I do.",
              updatedAt: null
            },
            music: {
              answer: "Jazz while cooking - lots of Miles Davis and Ella Fitzgerald. Also love world music, especially when cooking dishes from different cultures.",
              updatedAt: null
            },
            entertainment: {
              answer: "Chef's Table is my favorite show - so beautifully shot. Salt Fat Acid Heat changed how I think about cooking. Currently reading Anthony Bourdain's books.",
              updatedAt: null
            },
            travel: {
              answer: "Food tours in Italy were amazing - learned real pasta-making in Bologna. Japan was mind-blowing for ramen and sushi. Planning a trip to Thailand for street food.",
              updatedAt: null
            },
            aspirations: {
              answer: "Really want to learn proper knife skills from a professional chef. Also interested in fermentation - want to make my own kimchi and kombucha.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "outdoor1@test.com",
        password: "test123",
        username: "Jake_Adventure",
        demographics: {
          age: 23,
          birthDate: 946684800000,
          city: "Denver",
          gender: "Male",
          state: "Colorado"
        },
        onboarding: {
          responses: {
            location: {
              answer: "Grew up in flat Kansas, moved to Denver for the mountains and never looked back. The access to outdoor activities here is incredible. Love being able to hit the trails right after work.",
              updatedAt: null
            },
            hobbies: {
              answer: "Rock climbing is my passion - both indoor and outdoor. Also into trail running and backcountry skiing. Just started learning photography to capture the adventures.",
              updatedAt: null
            },
            relationships: {
              answer: "Made most of my friends through climbing - we're a tight group that climbs together every weekend. Have a husky named Summit who's my hiking buddy.",
              updatedAt: null
            },
            music: {
              answer: "Folk and indie while driving to climb spots - lot of Bon Iver and Fleet Foxes. Also into bluegrass since moving to Colorado.",
              updatedAt: null
            },
            entertainment: {
              answer: "Free Solo and 14 Peaks were incredible. Been reading a lot of Jon Krakauer. The Last of Us hit different being set in Colorado.",
              updatedAt: null
            },
            travel: {
              answer: "Climbed in Yosemite last summer - El Cap was humbling. Did some mountaineering in the Alps. Dream trip is climbing in Patagonia.",
              updatedAt: null
            },
            aspirations: {
              answer: "Want to learn ice climbing - looks terrifying but amazing. Also interested in getting my wilderness first responder certification.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "startup1@test.com",
        password: "test123",
        username: "Ava_Founder",
        demographics: {
          age: 29,
          birthDate: 820454400000,
          city: "Austin",
          gender: "Female",
          state: "Texas"
        },
        onboarding: {
          responses: {
            location: {
              answer: "From NYC originally but moved to Austin three years ago - better weather, lower cost of living, and amazing startup scene. Love the mix of tech and creativity here.",
              updatedAt: null
            },
            hobbies: {
              answer: "Big into mentoring other founders - run a weekly startup meetup. Also love tennis and recently got into pickleball. Painting helps me decompress from startup stress.",
              updatedAt: null
            },
            relationships: {
              answer: "My co-founder is my best friend from college. Close with other founders in Austin - we support each other through the startup rollercoaster.",
              updatedAt: null
            },
            music: {
              answer: "Need instrumental music while working - lot of post-rock like Explosions in the Sky. Love discovering new bands at SXSW.",
              updatedAt: null
            },
            entertainment: {
              answer: "Succession is too real sometimes! Loved WeCrashed and Super Pumped. Currently reading Bad Blood - fascinating startup story.",
              updatedAt: null
            },
            travel: {
              answer: "Regular trips to SF and NYC for investors. Loved exploring the startup scenes in Singapore and Tel Aviv. Want to check out Stockholm next.",
              updatedAt: null
            },
            aspirations: {
              answer: "Want to learn Mandarin - expanding to Asian markets soon. Also interested in learning to kiteboard - see people doing it on Lady Bird Lake.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "creative1@test.com",
        password: "test123",
        username: "Leo_Create",
        demographics: {
          age: 21,
          birthDate: 1009843200000,
          city: "Brooklyn",
          gender: "Non-binary",
          state: "New York"
        },
        onboarding: {
          responses: {
            location: {
              answer: "Born in Queens but Brooklyn feels more like home. The creative energy in Bushwick is unreal - murals everywhere, people making art on every corner. Can't imagine living anywhere else.",
              updatedAt: null
            },
            hobbies: {
              answer: "Motion design is my main thing - love combining 2D and 3D animation. Make zines in my free time and run a small risograph press. Started experimenting with AR filters too.",
              updatedAt: null
            },
            relationships: {
              answer: "Found my creative family at a local zine fair - we collaborate on projects and support each other's work. My roommate is a musician and we're always bouncing ideas off each other.",
              updatedAt: null
            },
            music: {
              answer: "Really into experimental electronic - Arca, Sophie, Oneohtrix Point Never. The weirder the better. Local DIY shows are always interesting.",
              updatedAt: null
            },
            entertainment: {
              answer: "Everything A24 puts out. Midsommar and The Lighthouse blew my mind visually. Been reading a lot of graphic novels lately - Chris Ware's work is incredible.",
              updatedAt: null
            },
            travel: {
              answer: "Did an art residency in Berlin last summer - amazing underground art scene. Tokyo was mind-blowing for design inspiration. Want to explore Mexico City's art world next.",
              updatedAt: null
            },
            aspirations: {
              answer: "Want to learn Blender properly - been following tutorials but need to dive deeper. Also interested in projection mapping for installations.",
              updatedAt: null
            }
          }
        }
      },
      {
        email: "books1@test.com",
        password: "test123",
        username: "Tom_Books",
        demographics: {
        age: 24,
        birthDate: 930355200000,
        city: "Minneapolis",
        gender: "Male",
        state: "Minnesota"
        },
        onboarding: {
        responses: {
        location: {
        answer: "Minnesota native - grew up in a tiny town where the library was my sanctuary. Moved to Minneapolis for college and fell in love with all the indie bookstores and literary events here.",
        updatedAt: null
        },
        hobbies: {
        answer: "Writing is my main hobby - working on a novel and some short stories. Love going to poetry slams and open mics. Started a small book club that meets in different coffee shops.",
        updatedAt: null
        },
        relationships: {
        answer: "Really close with my writing group - we workshop each other's stories weekly. Have a shy rescue cat named Gatsby who keeps me company while writing.",
        updatedAt: null
        },
        music: {
        answer: "Need ambient or classical while writing - Max Richter and Nils Frahm are favorites. Folk music when not working - The Decemberists tell amazing stories.",
        updatedAt: null
        },
        entertainment: {
        answer: "Love anything based on books - Station Eleven adaptation was perfect. Currently obsessed with House of the Dragon. Always rereading Donna Tartt's The Secret History.",
        updatedAt: null
        },
        travel: {
        answer: "Did the literary pub crawl in Dublin - amazing to walk where Joyce did. Loved visiting Shakespeare and Company in Paris. Dream trip is following Murakami's path in Japan.",
        updatedAt: null
        },
        aspirations: {
        answer: "Want to learn letterpress printing - love the idea of making beautiful physical books. Also interested in literary translation, especially Japanese literature.",
        updatedAt: null
        }
        }
        }
        },
        {
        email: "eco1@test.com",
        password: "test123",
        username: "Jade_Earth",
        demographics: {
        age: 28,
        birthDate: 851990400000,
        city: "Pittsburgh",
        gender: "Male",
        state: "Pennsylvania"
        },
        onboarding: {
        responses: {
        location: {
        answer: "Raised in suburban Phoenix - felt disconnected from nature there. Found my place in Portland's eco-conscious community. Love how green everything is and how people care about sustainability.",
        updatedAt: null
        },
        hobbies: {
        answer: "Urban farming is my passion - turned my backyard into a food forest. Lead community garden workshops. Getting into beekeeping and composting.",
        updatedAt: null
        },
        relationships: {
        answer: "Part of a wonderful permaculture community - we share harvests and gardening tips. Live with three housemates who are all into sustainable living.",
        updatedAt: null
        },
        music: {
        answer: "Listen to folk punk and environmental activist musicians. Love Nahko and Medicine for the People. Also enjoy nature sounds while gardening.",
        updatedAt: null
        },
        entertainment: {
        answer: "Kiss the Ground documentary changed my life. Love reading books on permaculture and environmental justice. Just finished The Overstory - hit hard.",
        updatedAt: null
        },
        travel: {
        answer: "Worked on organic farms in New Zealand through WWOOF. Studied sustainable communities in Costa Rica. Want to learn from indigenous land practices in Peru.",
        updatedAt: null
        },
        aspirations: {
        answer: "Want to learn about natural building - dream of building an earthship someday. Also interested in mushroom cultivation and mycology.",
        updatedAt: null
        }
        }
        }
        },
        {
            email: "comedy1@test.com",
            password: "test123",
            username: "Josh_Comedy",
            demographics: {
            age: 26,
            birthDate: 888883200000,
            city: "Chicago",
            gender: "Male",
            state: "Illinois"
            },
            onboarding: {
            responses: {
            location: {
            answer: "Born and raised in suburban Chicago, but moved to the city for the comedy scene. Second City and iO are like my second homes now. The comedy community here is incredible - so much history and talent.",
            updatedAt: null
            },
            hobbies: {
            answer: "Improv is my main thing - perform with two different teams. Started doing standup last year which is terrifying but addictive. Also help run a comedy podcast about bad movies.",
            updatedAt: null
            },
            relationships: {
            answer: "My improv team is basically family at this point - we hang out even when not performing. Have an amazing girlfriend who's also in comedy. Parents still come to most of my shows.",
            updatedAt: null
            },
            music: {
            answer: "Love comedy music - Flight of the Conchords, Bo Burnham, Lonely Island. Also play piano for improv musical shows which is super fun.",
            updatedAt: null
            },
            entertainment: {
            answer: "Nathan Fielder is my hero - The Rehearsal was mind-blowing. Love Community and What We Do in the Shadows. Reading Tina Fey and Mike Birbiglia's books for inspiration.",
            updatedAt: null
            },
            travel: {
            answer: "Been to comedy festivals in New York and Toronto. Did a road trip hitting comedy clubs across the Midwest. Dream is to perform at Edinburgh Fringe Festival.",
            updatedAt: null
            },
            aspirations: {
            answer: "Want to learn character work better - taking sketch writing classes at Second City. Also interested in comedy directing, maybe make some short films.",
            updatedAt: null
            }
            }
            }
            },
            {
            email: "beach1@test.com",
            password: "test123",
            username: "Liam_Beach",
            demographics: {
            age: 21,
            birthDate: 1009843200000,
            city: "San Diego",
            gender: "Male",
            state: "California"
            },
            onboarding: {
            responses: {
            location: {
            answer: "Grew up in Arizona - always dreamed of living by the ocean. Moved to San Diego for college and never leaving. Perfect weather, laid-back vibe, and beach life is exactly what I wanted.",
            updatedAt: null
            },
            hobbies: {
            answer: "Surfing is my life - try to catch waves every morning before work. Getting into beach volleyball and spearfishing too. Learning to sail at Mission Bay.",
            updatedAt: null
            },
            relationships: {
            answer: "Made most of my friends through surfing - have a great dawn patrol crew. Really close with my roommate who taught me to surf. Dating someone I met at a beach cleanup.",
            updatedAt: null
            },
            music: {
            answer: "Beach rock and reggae - Slightly Stoopid, Rebelution, Stick Figure. Love live music at beach bars and bonfires.",
            updatedAt: null
            },
            entertainment: {
            answer: "Big fan of surf documentaries - Momentum Generation was awesome. Point Break is a classic. Reading books about ocean conservation lately.",
            updatedAt: null
            },
            travel: {
            answer: "Surfed in Hawaii and Mexico - North Shore waves were humbling. Planning trips to Indonesia and Costa Rica for the legendary breaks.",
            updatedAt: null
            },
            aspirations: {
            answer: "Want to learn to shape my own surfboards - taking a workshop soon. Also interested in underwater photography to capture ocean life.",
            updatedAt: null
            }
            }
            }
            },
            {
                email: "fashion1@test.com",
                password: "test123",
                username: "Zoe_Style",
                demographics: {
                age: 22,
                birthDate: 978307200000,
                city: "Miami",
                gender: "Female",
                state: "Florida"
                },
                onboarding: {
                responses: {
                location: {
                answer: "Originally from Boston where fashion was all about layers and practicality. Miami is such a refreshing change - the style here is bold and expressive. Love how the city's culture influences fashion.",
                updatedAt: null
                },
                hobbies: {
                answer: "Sustainable fashion is my passion - love thrifting and upcycling clothes. Learning pattern making and sewing. Started a clothing swap group that meets monthly.",
                updatedAt: null
                },
                relationships: {
                answer: "Best friends with my fashion school classmates - we're always collaborating on projects. Mom taught me to sew and we still design together. Have a very patient dog who models my accessories.",
                updatedAt: null
                },
                music: {
                answer: "House music and Latin pop - perfect for Miami vibes. Bad Bunny and Kaytranada are on repeat. Love discovering new music at Art Basel parties.",
                updatedAt: null
                },
                entertainment: {
                answer: "Project Runway got me into fashion! Love Next in Fashion and Making the Cut. Currently reading fashion sustainability books and Diana Vreeland's memoirs.",
                updatedAt: null
                },
                travel: {
                answer: "Fashion weeks in NY and Paris were dream trips. Loved exploring vintage shops in Tokyo. Want to visit textile markets in Morocco.",
                updatedAt: null
                },
                aspirations: {
                answer: "Want to learn textile design - especially interested in sustainable fabrics. Also want to take a proper couture sewing course in Paris.",
                updatedAt: null
                }
                }
                }
                },
                {
                  email: "wanderlust18@test.com",
                  password: "explore123",
                  username: "Lily_Adventurer",
                  demographics: {
                    age: 22,
                    birthDate: 1015209600000,
                    city: "Dallas",
                    gender: "Female",
                    state: "Texas"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Boulder, Colorado. Loved the mountains and the outdoors, but I wanted to experience a bigger city vibe, so I moved to Austin for college. Austin's music and food scene have been a dream, but I do miss the snowy winters back home.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I’m passionate about hiking and photography—there’s nothing like capturing a sunset on a trail. I’ve also started getting into watercolor painting recently, which has been surprisingly relaxing.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m really close to my mom, who’s been my biggest supporter. I also have a golden retriever named Sunny—he’s my adventure buddy for hikes and road trips.",
                        updatedAt: null
                      },
                      music: {
                        answer: "Love indie and folk music. Artists like Phoebe Bridgers, Bon Iver, and The Lumineers are on repeat. Their lyrics feel like they tell stories I can relate to.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "My favorite shows are The Great British Bake Off and Schitt's Creek—one’s soothing, the other hilarious. For movies, I’m a sucker for Studio Ghibli films, especially Spirited Away. They’re magical!",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I visited Iceland last summer, and it was breathtaking—the waterfalls, glaciers, and hot springs were like nothing I’ve ever seen. I’d love to go back and explore more.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I’ve always wanted to learn how to play the guitar. It would be amazing to write and play my own songs one day.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "bookworm22@test.com",
                  password: "readingisfun",
                  username: "Emma_Reads",
                  demographics: {
                    age: 21,
                    birthDate: 1022736000000,
                    city: "Boston",
                    gender: "Female",
                    state: "Massachusetts"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Providence, Rhode Island, and it was a quaint little place to call home. I moved to Boston for college and love the mix of history and innovation here.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I love reading fiction, especially historical and fantasy novels. Writing short stories is another favorite pastime—I find it so fulfilling to create my own worlds.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my younger brother, and we bond over our love of fantasy novels. I’ve also made some wonderful friends at my local book club.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I enjoy classical music and movie soundtracks. They help me focus while reading or writing.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "My favorite book series is 'The Song of Achilles,' and I adore shows like 'Downton Abbey' and 'The Crown.' I’m fascinated by character-driven stories.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I visited Edinburgh last year and fell in love with its literary history. Walking the streets where J.K. Rowling found inspiration was magical.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I’d love to learn calligraphy. It would be amazing to create beautiful handwritten letters and decorations.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "gamerlife19@test.com",
                  password: "levelup456",
                  username: "Chris_TheGamer",
                  demographics: {
                    age: 19,
                    birthDate: 1055030400000,
                    city: "Seattle",
                    gender: "Male",
                    state: "Washington"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I’m from Portland, Oregon, and it’s such a cool place to grow up. I moved to Seattle recently to join a game development bootcamp.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "Gaming is my passion—I love both playing and creating games. I also dabble in coding and designing my own characters and levels.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my cousin, who’s also a gamer. We team up for tournaments. I also met some amazing friends online through multiplayer games.",
                        updatedAt: null
                      },
                      music: {
                        answer: "Big fan of EDM and gaming soundtracks. Artists like Deadmau5 and Porter Robinson inspire me.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I love shows like 'Arcane' and 'The Witcher,' which blend great stories with fantasy and action. Favorite game? Definitely 'Zelda: Breath of the Wild.'",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I visited Tokyo for a gaming expo—it was like stepping into another world. The arcades were incredible!",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to develop my own indie game someday. Learning advanced 3D modeling would be a great step forward.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "yogi27@test.com",
                  password: "namaste123",
                  username: "Sam_Yogi",
                  demographics: {
                    age: 27,
                    birthDate: 915148800000,
                    city: "Los Angeles",
                    gender: "Non-Binary",
                    state: "California"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Denver, Colorado, and it was a great place to connect with nature. I moved to LA for work, and I love the sunshine and creative energy here.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "Yoga and meditation are my go-to activities for relaxation. I also enjoy cooking vegan meals and experimenting with new recipes.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my dog, Luna, and my roommate, who’s also a yoga enthusiast. We host weekly yoga sessions together.",
                        updatedAt: null
                      },
                      music: {
                        answer: "Love listening to chill instrumental music and indie artists like Sufjan Stevens and Iron & Wine.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "Favorite shows include 'Queer Eye' and 'The Good Place.' I love uplifting content that makes me smile.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I went to Bali for a yoga retreat, and it was life-changing. The beaches and spiritual vibe were incredible.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I’d love to learn pottery—it seems like a relaxing and creative outlet.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "chef25@test.com",
                  password: "cookmaster",
                  username: "Jamie_Cooks",
                  demographics: {
                    age: 25,
                    birthDate: 946684800000,
                    city: "Chicago",
                    gender: "Male",
                    state: "Illinois"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Madison, Wisconsin, where I first fell in love with cooking. I moved to Chicago for culinary school and stayed for the amazing food scene.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "Cooking is both my passion and my career. I enjoy experimenting with fusion recipes and hosting dinner parties for friends.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m very close to my mom, who taught me how to cook. I also have a group of fellow chefs I regularly collaborate with on pop-up events.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I listen to a lot of jazz while cooking—it keeps me in the zone. Miles Davis and John Coltrane are my go-to artists.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I love watching 'Chef’s Table' and documentaries about food culture. For movies, 'Ratatouille' will always have a special place in my heart.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I’ve been to Paris and fell in love with the patisseries. I’d love to explore more of Europe’s food scene someday.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to open my own restaurant. Learning pastry-making is next on my list to master.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "fitguy24@test.com",
                  password: "gymtime456",
                  username: "Mark_FitLife",
                  demographics: {
                    age: 24,
                    birthDate: 1009843200000,
                    city: "Atlanta",
                    gender: "Male",
                    state: "Georgia"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Tampa and loved the beach lifestyle. I moved to Miami to pursue a career in fitness coaching.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I’m into weightlifting, swimming, and meal prepping. Helping others reach their fitness goals is something I find really rewarding.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my best friend, who’s also a trainer. We motivate each other to push harder every day.",
                        updatedAt: null
                      },
                      music: {
                        answer: "My gym playlist is full of upbeat hip-hop and EDM tracks to keep the energy high.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I don’t watch a ton of TV, but I enjoy sports documentaries like 'The Last Dance.'",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I loved visiting Hawaii—swimming in the crystal-clear waters was unforgettable.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to learn how to surf! It looks like such a fun and challenging activity.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "artist21@test.com",
                  password: "createart",
                  username: "Sophie_Draws",
                  demographics: {
                    age: 21,
                    birthDate: 1041379200000,
                    city: "Brooklyn",
                    gender: "Female",
                    state: "New York"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in rural Vermont, surrounded by nature. I moved to Brooklyn for art school and the creative vibe of the city.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I love sketching and painting, especially landscapes and portraits. Recently, I’ve been experimenting with digital art too.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m super close to my twin sister—we share everything. I’ve also made great friends in my art collective.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I’m into lo-fi and indie music. Artists like Clairo and Tame Impala are staples in my studio playlist.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I love animated movies like 'Spider-Man: Into the Spider-Verse' for their visual artistry. Also a huge fan of 'BoJack Horseman.'",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I went to Florence last year and was awestruck by the art and architecture. It’s a dream destination for any artist.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to learn pottery and create functional art like mugs and bowls.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "techlover26@test.com",
                  password: "innovate456",
                  username: "Devon_Codes",
                  demographics: {
                    age: 26,
                    birthDate: 942019200000,
                    city: "San Jose",
                    gender: "Non-Binary",
                    state: "California"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in San Diego and moved to San Jose for work in the tech industry. It’s exciting to be in the heart of innovation!",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I’m into coding and building side projects—currently working on a personal finance app. I also enjoy playing chess online.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my mentor at work, who’s guided me through my career. I also have a tight-knit group of friends from hackathons.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I listen to ambient and electronic music—great for focusing. Brian Eno and Odesza are my favorites.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I love sci-fi shows like 'Westworld' and 'Altered Carbon.' They fuel my imagination about the future of technology.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I visited Singapore for a tech conference and was amazed by its innovation and architecture.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to learn machine learning to create smarter apps.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "skatergirl18@test.com",
                  password: "olliekickflip",
                  username: "Rachel_Rides",
                  demographics: {
                    age: 18,
                    birthDate: 1075507200000,
                    city: "Santa Monica",
                    gender: "Female",
                    state: "California"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Santa Monica and love the beach vibes. I’ve thought about moving, but there’s something magical about being by the ocean.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "Skateboarding is my life! I spend most of my time at the skatepark. I also love surfing when the waves are good.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m super close to my dad, who taught me how to skate when I was five. My crew from the park is like my second family.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I’m into punk rock and alternative bands like Blink-182 and Paramore. Their energy really gets me hyped.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I love skateboarding documentaries and movies like 'Lords of Dogtown.' They remind me why I started skating.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I went to Barcelona for a skate trip, and it was a dream! The city has some of the best spots in the world.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I’d love to learn how to film and edit skate videos to capture our best tricks.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "entrepreneur29@test.com",
                  password: "bizbuilder123",
                  username: "Eli_Entrepreneur",
                  demographics: {
                    age: 29,
                    birthDate: 788918400000,
                    city: "Austin",
                    gender: "Male",
                    state: "Texas"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Dallas and moved to Austin to launch my startup. The entrepreneurial energy here is unmatched.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I enjoy brainstorming business ideas, networking, and reading about successful founders. In my downtime, I love playing tennis.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "My mentor has been a huge influence on my career. I’m also close with my co-founder—we make a great team.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I like listening to motivational podcasts and instrumental playlists while working. Hans Zimmer is my go-to.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I’m a big fan of Shark Tank—it’s inspiring to see innovative ideas and pitches.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I visited Silicon Valley for a conference, and it was incredible to be surrounded by so many innovative minds.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I’d love to learn public speaking to improve my pitches and presentations.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "plantlover22@test.com",
                  password: "greenthumb123",
                  username: "Olivia_Grows",
                  demographics: {
                    age: 22,
                    birthDate: 1020211200000,
                    city: "Cleveland",
                    gender: "Female",
                    state: "Ohio"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Eugene and moved to Portland for college. Portland’s greenery and eco-friendly vibe really resonate with me.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I’m passionate about gardening and houseplants. Watching something grow from a seed is so rewarding.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my roommate—we’ve created an indoor jungle in our apartment together. My cat, Basil, is my constant companion.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I love acoustic and folk music. Fleet Foxes and Ben Howard are on my playlist while I tend to my plants.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "My favorite show is 'Big Dreams, Small Spaces'—Monty Don is a hero. I also enjoy documentaries about nature and sustainability.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I visited Costa Rica and fell in love with its rainforests and biodiversity. It’s a paradise for plant lovers.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to learn how to make terrariums—they’re like little worlds in glass.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "musician20@test.com",
                  password: "strumchords",
                  username: "Zane_Plays",
                  demographics: {
                    age: 20,
                    birthDate: 1049155200000,
                    city: "Nashville",
                    gender: "Male",
                    state: "Tennessee"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Memphis but moved to Nashville to pursue music. The city’s vibe is perfect for aspiring musicians.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I play the guitar and write my own songs. Music is how I express myself. I also enjoy attending open mic nights.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "My bandmates are like family to me. We’ve been playing together since high school.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I’m inspired by artists like John Mayer, Ed Sheeran, and Eric Clapton. Their storytelling through music resonates with me.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "I love watching live music documentaries—it’s inspiring to see how legends made it.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I traveled to Austin for South by Southwest. It was amazing to see so many artists in one place.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I’d love to learn music production to produce my own tracks.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "techgirl30@test.com",
                  password: "innovate123",
                  username: "Sophia_Tech",
                  demographics: {
                    age: 30,
                    birthDate: 757382400000,
                    city: "San Francisco",
                    gender: "Female",
                    state: "California"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Sacramento but moved to San Francisco for the tech opportunities. It’s been the perfect place to grow my career.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I enjoy coding, mentoring junior developers, and learning about emerging technologies like AI and blockchain.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "I’m close to my best friend from college, who’s also in tech. We collaborate on side projects.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I love listening to chillwave and synthwave while working. It keeps me energized and focused.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "Shows like 'Mr. Robot' and 'Silicon Valley' are my favorites—they capture the tech world in interesting ways.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I went to South Korea for a tech summit and loved the mix of tradition and innovation.",
                        updatedAt: null
                      },
                      aspirations: {
                        answer: "I want to learn about cybersecurity—it’s such a critical field right now.",
                        updatedAt: null
                      }
                    }
                  }
                },
                {
                  email: "adventurer28@test.com",
                  password: "hikingrocks",
                  username: "Kyle_Trails",
                  demographics: {
                    age: 28,
                    birthDate: 795801600000,
                    city: "Denver",
                    gender: "Male",
                    state: "Colorado"
                  },
                  onboarding: {
                    responses: {
                      location: {
                        answer: "I grew up in Salt Lake City but moved to Denver for its incredible access to hiking and skiing.",
                        updatedAt: null
                      },
                      hobbies: {
                        answer: "I’m an outdoor enthusiast. Hiking, skiing, and trail running are my top activities.",
                        updatedAt: null
                      },
                      relationships: {
                        answer: "My hiking buddies are my closest friends. We’ve tackled some tough trails together.",
                        updatedAt: null
                      },
                      music: {
                        answer: "I enjoy classic rock and folk music—something about it fits perfectly with the mountains.",
                        updatedAt: null
                      },
                      entertainment: {
                        answer: "Documentaries about explorers and adventure sports are my favorites. 'Free Solo' is a must-watch.",
                        updatedAt: null
                      },
                      travel: {
                        answer: "I backpacked through Patagonia last year. The landscapes were absolutely breathtaking.",
                        updatedAt: null
                      },
                      aspirations: {      
                        answer: "I want to learn mountaineering to tackle some serious peaks.",
                        updatedAt: null
                      }
                    }
                  }
                },
                
    
  // Add more test users with different interests for matching
];

export async function createTestAccounts() {
  for (const user of TEST_USERS) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      const userData = {
        uid: userCredential.user.uid,
        email: user.email,
        username: user.username,
        createdAt: serverTimestamp(),
        demographics: user.demographics,
        questionnaire: {
          interests: [],
          preferences: {},
          personalityTraits: [],
          onboarding: {
            responses: user.onboarding.responses,
            status: {
              isComplete: true,
              completedAt: serverTimestamp(),
              lastUpdated: serverTimestamp()
            }
          }
        },
        stats: {
          messagesSent: 0,
          conversationsStarted: 0,
          aiInteractions: 0
        },
        subscription: {
          type: "free",
          validUntil: null
        },
        avatar: {
          currentOutfit: {},
          unlockedItems: ["basic_outfit"]
        }
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log(`Created test user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to create ${user.email}:`, error);
    }
  }
}