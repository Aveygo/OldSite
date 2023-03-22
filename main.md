
# Disabled javascript effects
 - No rain 
 - No news articles
 - No stock/crypto prices

# "Past" draft
## High School: import *
I have an awful tendency to break the unbreakable, and when I learnt that my high school blocked
minecraft, I couldnt resist. I learnt the basics of web development when I was 15 to make a realistic looking website 
and tricked a teacher into whitelisting the address. Little did they know about the little proxy that ran on port 8080.
After satisfying my taste of blood and getting the principle to address the "concerning rise of gaming on school property",
I moved onto chatrooms and simple login experiments, where I discovered python and eventually machine learning.

## HSCs: panic!
Being bold, I learnt keras and dipped my toes into mnist and this weird thing called GPT2. I eventually took what I learned and
wrote my first ml paper for an Extension Science assignment, analysing how well feature hashing works.
I saw myself enjoying what I was doing and applied for Computer Science at UTS, where after a few nail biting months, I eventually
got into their systems!

## University: O(nlogn)
Which leads to the present day; Year 2, semester one, writing this very website! I have learnt and read a lot more, following
facebook, google, and microsoft's research paper trails. I even applied to get the LLaMA weights and got accepted (even though
it was leaked a couple days later). I continue experimenting even to this day, my most recent work being combing vision 
transformers and ConvNext, but I'll leave that for my next assignment.

# "Future" draft
## Internships
As I'm focusing on univeristy work for now, my current and future work expeience is a little dry for now.
That being said, I aspire for a role in data science and / or machine learning research where I get to play
with millions of dollors of computing and be on the bleeding edge of what is possible.

## Thoughts
I've seen the strengths of machine learning from the early days, and I know it will continue to race ahead. While it's a dreamy
thought, I hope to lead the charge or at the very least be a part of likely one of the most important events in human history.
I am also a huge crypto advocate, but more for the open-source and research feel of it. I also enjoy my fair share of csgo
and destiny 2, which I play religiously when my brain deep fries itself in trying to keep up with the latest tech trends,
and I see myself continuing to do so in the far, far future.

## Conclusion
I still have one more web page to write, but I hope I explained effectively what I enjoy and think about from day-to-day. If anyone has any questions, or just wants to chat (or job offers?) my contacts are: 
dmitri.shevchenko.au@gmail.com, github.com/Aveygo, or Aveygo#1066 for discord.

# "Comments" draft
## Aesthetics

### Retro
I wanted my site to stand out, and in viewing several examples, I thought dimden.dev was a great source of
inspsiration. It reminded me of KSP 2's new UI, and in general that old-ish internet theme combined with
the pixelated font was so aesteically pleasing to me.
However, I saw several design conflictions. The simple tile layout was great, but I felt like it was
a little scattered with lots of gifs, icons, flashing/scrolling ads, and strange mouse choices.
I took the retro style idea and tried to adapt it more to the philosophy of simplicity.

### Interactives
To fit the theme, I also took the time to make adaptive elements that would convey my personality a
little more.
These are mainly the stocks, github, and news headlines elements on the home screen.

### Quality of Life
I also added some performance/visual touches:
 - Parralax background 
 - Slide in animations
 - Improved rain
 - Dithering effect
 - "Glass" tiles
 - Neon effects

and the use of flexbox to allow for a wider range of screen devices.

## Technicals

### Caching/Preloading
To increase performance, I pre-load fonts and cache the results of
the news articles and prices to prevent re-calling the slow endpoints.
You can see the saved results in F12 -> Application -> Local Storage.

### Elements - Retro Specific
 - :root
For easy color changes to finetune the color pallet.

 - .main_logo
Creates the style of the main text at the top of the screen through
the use of various box shadows.

 - .glow_box
Also uses box shadows, but with a much larger blur. When combined with the solid border of each
tile, it gives a neon effect. Similarly for glow_text.

### Elements - Tile Specific
 - .wrapper
Creates the left and right borders around the tiles, centers the content to allow
for easier reading, and uses flexbox to wrap and stretch the tiles to fit.

 - class: tile
The main class to arrange the content within the screen, mainly for the dithering effect
which is a tiled css background image of two offset pixel sized circles.

 - animation: slide-in-left/right
Used to slide the tiles into the screen via x-transforms on load in.

### Elements - Other

 - html and body
Changed to fill screen and remove scrollbar (doesnt work on firefox, but they have a better scroll bar so its fine) and also for centering the main screen.

 - .qrcode
Unicode squares and spaces are not the same width, this class ensures the qr code is
square. I used unicode as it allowed to easier experimentation with colors (svgs did not work for me, and 
I like the slight overlap effect anyways)

 - table and ul
Minor changes to fill the tile it is in. Used to represent the github and market elements as the 
row column structure fits the task well.

### Elements - Special

 - animation: rain
Allows for the rain to fall from the top to bottom of the screen, designed to allow some
javascript code to start it at a random position and then just repeat.

 - .selectable:hover
Allows for links to have a selected effect when hovered over.

 - .background img
Sticks the background image and fills the screen. The parallax effect is acheived with javascript events. 

## Accessibility

### CSS/Javascript 
The accessability of my site was determined from the ground up. I built the html first and designed 
everything around it to allow for people to use it without css or javascript.

### Displays
I used flexbox so that the tiles stretch and rearrange themeselves to whatever screen size the
user has. This allows the content to be accessable to mobile devices as well as larger ones, tested
up to 4k for both landscape and horizontal following WCAG 2.0.

### Visuals
Alt attributes and meta tags as well as general high contrast text and readable fonts for the content
was used for people with visual impairments.

### Compatability
I also specifically had a blur filter, but quickly found bugs and low performance issues even in chrome, so that was swiftly removed.  
Apart from that, I was worried that the NES font may be hard to read, so I switch to courier for more text heavy boxes.

### Automated Scripts
Lighthouse was used to evaluate the general performance and accessability. I did get a warning for the low contrast
header but deemed it acceptable as I believe it was not checking the text-shadow value. Otherwise 100%.

### Motion
Because the tile animations on load and rain may be distracting to some users, I have used css "prefers-reduced-motion" to
disable these features.
Users enable this though their operating system commonly under a "reduce animation" setting.

## Personal Reflection
I am very happy with my design choices, a mix between the complexities of retro and the 
simplicities of tiles.
I wanted users to perceive the site as more of an art project than a wall of text, with 
"bits of personality" sticking though, with an emphasis on its readablity and "calmness".
If I were to do it again, I would place more attention on the interactive elements and reworking
the tile content
I hope you enjoyed my site! Be sure to check out my github and follow or give my work a star! 