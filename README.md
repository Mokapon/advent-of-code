# advent-of-code
Graphical solutions to the [Advent of Code](https://adventofcode.com) puzzles using [p5.js](https://p5js.org).

## The project
* My objective with this project is to find a way to show the puzzle being resolved, hopefully in an interesting way. This means the solutions are adapted to run in several elementary steps, rather than a single loop, or sometimes simple calculation.
* You can navigate my solutions by going [here](https://mokapon.github.io/advent-of-code). I may add later a link to the code in the puzzle pages.
* I tried to add some tags to help identify the puzzles. This probably needs to be improved. At the minimum I want to add an indicator of 'visual interest' of the solution.
* I also want to go bak to each puzzle and write some description of my solution when relevant.

## Notes on performance, solutions, etc.
* Because I want to show the puzzle being solved, the solutions to some of these puzzles are mostly 'brute force'. Yes, I am aware that for a lot of puzzles, a more elegant solution could be used. For example, [this puzzle](http://adventofcode.com/2016/day/15) could be solved either mathematicaly, or by trying every possibility until a valid one is found. [My solution](https://mokapon.github.io/advent-of-code/year/2016/day/15/index.html) is actually using both these techniques: I lock in some element with the 'elegant' solution to reduce the overall number of iterations, and run through the remaining solutions to  keep the visual interest.
* Since most puzzles of Advent of Code involve going through a lot of input, the number of steps required to solve a puzzle is pretty high. So the frameRate is usually high, making the the resolution hard to follow. You can change the execution speed by opening your browser's console and typing `frameRate(X)`, replacing X by a value between 1 and 60 (smaller is slower).
* For some puzzles, even at maximum frameRate the resolution was taking too long, so I sometimes run several steps at each frame, making the animation less meaningful. See for example, part 2 of [this puzzle](https://mokapon.github.io/advent-of-code/year/2016/day/18/index.html) (still look kind of cool though I guess).
* I started all this with the 2016 puzzles, in the beginning with no page template, and no clean way to switch between part 1 and 2 of the puzzles if needed. So some of the solutions of early 2016 may only contain code for part 2. I will try to go back to them at some point and at least set up the template.
* I deleted my code for 2016, day 14 by accident... ;0; Maybe I'll redo it, but it's not interesting graphically, and pretty similar to [this 2015 puzzle](https://mokapon.github.io/advent-of-code/year/2015/day/4/index.html).
* Yes I could try to display Regexp matches interstingly for some of these puzzles. I'm thinking about it.

