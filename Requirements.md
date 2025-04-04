🎮 Level 1: "Life of Denis: What Makes Me, Me" 
 Overview & Implementation Guide

🚩 Concept & Objective
•	Theme: Childhood to university period.
•	Purpose: Player gets to know the protagonist ("Denis") by collecting symbolic skill items representing personal hobbies.
•	Main Goal: Collect all 6 skills, defeat the boss ("Johann"), and proceed to the next level (by entering university door).
________________________________________
🗺️ Gameplay Structure
Level Mechanics
•	2D platformer inspired by Super Mario Bros.
•	Simple, straightforward gameplay (~1 min playthrough).
•	Movement: left/right, jump, action button.
•	Backpack mechanic: Start with empty backpack; fill by collecting skills.
Player Actions
•	Movement: Arrow keys (left/right)
•	Jump: Arrow-Up (short tap = small jump; long press = higher jump).
•	Action Button (S): Opens skill boxes, shoots tennis balls after collecting tennis racket.
________________________________________
🗯️ Skill Collection Speeches
When Denis collects each skill item, he briefly reacts either with a short voice-line or a speech bubble (player choice):
#	Skill Item	Denis's Reaction (Speech or Text Bubble)
1	📚 Books	" Brainpower boosted! Let's keep learning!"
2	🥽 Goggles	"Swimming mastered! Making waves now!"
3	🎸 Guitar	" Rocking forward!"
4	🎹 Piano	"Feeling the rhythm!"
5	♟️ Chess piece	"Strategy is everything - time to play smart!"
6	🎾 Tennis racket	"Got my racket— Johann’s in trouble now!"
Special Skill (Tennis Racket):
•	Unlocks ability to shoot tennis balls as projectiles
Shooting ability (S): delay between shooting balls of approx.. 1 sec. (to be potentially adjusted) 

________________________________________
👾 Enemies & Interaction
Standard Enemies ("Goompas")
•	2-3 small enemies patrolling horizontally (goompas) 
•	Player defeats enemies by jumping on them (Mario-like squash effect).
•	Touching enemies from side/below results in losing one life.
End Boss ("Johann")
•	Represents the "Program Manager" (Johann).
•	Moves horizontally, shooting tennis balls periodically (not to often, it needs to be easy)
•	Player dies instantly if hit by boss tennis balls.
•	Requires 3 player hits (tennis ball shots) to defeat Johann.
•	After defeating Johann, level completed, proceed to Level 2.
________________________________________
🎯 UI / HUD Elements

[Player Avatar]   Skills collected: ■■■□□□ (3/6)   
•	Icons/symbols visually represent skill progress
•	Skill progession bar coloured green 
Checkpoint System
•	Checkpoints before boss fight after collecting all items (Right after tennis racket)
•	Respawn at latest checkpoint after player death, with previously collected items retained
________________________________________
🎨 Visual & Design Guidelines
•	General Style: Pixel art, clean, retro look.
•	Color Palette (simplified):
o	Background: Different images, we are working on it. Probably  3 png files after each other for each level
o	Platforms: Brown shades (wood-like)
o	Skill Boxes: Gold/Yellow with white "?" symbol
o	Enemies (Goompas): Light-brown/beige, friendly but challenging look (Potential implementation of goompa as unicredit symbol)
o	Boss Area: Darker ground (grey or dark green) marking the boss area clearly
•	Animations: simple, minimal frames, Mario-inspired bounce effects.
________________________________________
🎵 Sound & Audio
•	Background Music: Cheerful 8-bit chiptune loop (~1 min).
•	Sound Effects:
o	Jump: short, bright "hop"
o	Item collection: positive chime
o	Enemy defeated: short satisfying "squash" effect
o	Tennis ball shoot: "pop" sound
o	Boss hit/defeat: clear feedback sound (chime or alert)
________________________________________
🗨️ Dialog & Speech (Text & optional voice)
•	Game Start:
Denis: "Let’s go!"
•	Before boss fight:
Option 1:
Johann "Well, Denis, let's see who's serving aces today. Show me what you've got!”
Option 2:
Johann: "Denis! Thought you’d never show up. Ready to see who's serving aces today?"
Option 3:
Johann: "Let's see if your skills are really that impressive!"
Denis: "Challenge accepted!"
•	Boss Defeated:
🏆 Post-Boss Defeat (Victory Speech)
After defeating Johann, Denis celebrates the victory briefly:
Option 1: 
Denis: "That's how it's done! But this was just the warm-up!” 

Option 2: 
Denis: "That was just the beginning—ready for what's next!"
________________________________________
Example of gameplay Sequence overview (adjustments are possible):
1.	Level begins; 
o	Ground-level start position, Denis says “Let’s go” while jumping,
2.	Jump onto Platform 1; open mystery box; collect Books
o	First platform, simple jump.
3.	Jump onto Platform 2; collect Goggles from mystery box
o	Elevated platform requiring higher jump.
4.	Quick jump onto Platform 3; collect Guitar from mystery box
o	Short hop from previous platform.
5.	Drop down to ground level 4; collect Piano
o	Easy, ground-level item.
6.	Jump onto higher Platform 5; collect Chess Piece
o	Slightly higher jump, moderate challenge.
7.	Quick jump onto final Platform 6; collect Tennis Racket
o	Easily accessible elevated platform.
8.	Proceed forward; reach boss area; Johann dialogue triggers
o	Clear transition into boss encounter.
9.	Boss fight with Johann (defeat after 3 hits)
o	Quick, tennis-ball projectile interaction.
10.	Victory dialogue; Level completion
o	Short celebration dialogue, level ends.


