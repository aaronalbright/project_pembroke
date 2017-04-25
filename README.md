# This is upCar

"What's upCar?"

Not much. What's up with you?

UpCar is an app to keep up with your car. Every modern automobile has warning lights that will illuminate on the dashboard. This is the car's way of telling you something may be wrong.

This project was designed to help people understand their car's dashboard warnings a little better and inform them of the potential cost of neglecting maintenance.

This app was made as part of a four-month independent study at the University of Florida from January to April 2017.

## What I made

UpCar is a progressive web app built to provide information on 20 dashboard warning lights.

The Check Engine icon is unique in that it contains more data and visualizations sourced from CarMD's [2016 Vehicle Health Index](https://www.carmd.com/wp/vehicle-health-index-introduction/2016-carmd-vehicle-health-index/). This data contains the average cost of repairs for the check engine light along with the top-10 reasons the light usually comes on.

## How I made it
This project was my first attempt at using [Node.js](https://nodejs.org/en/) and [Gulp](http://gulpjs.com/). Both are incredibly useful and now indispensable to me for future projects.

From there, it was as simple as building out an `index.html`, a `script.js` and tying it all together with some data.

I used [Handlebars.js](http://handlebarsjs.com/) to automatically generate the icons on the main menu. Each icons stores it's own data imported from a JSON file. When clicked, the data stored in the icon is pushed to its respective section on the page.

The D3 is also generated from data files and animated when they are scrolled to on mobile or on click on desktops (at large widths).

I use a Service Worker and a `manifest.json` to make the app progressive (i.e. it works offline and can be "added to home screen" as a standalone "app") along with some `meta` tags.

Also, a lot of Stack Overflow.

### What I learned
For starters, I learned a lot of [D3.js](https://d3js.org/). I also learned that to learn D3 you have to learn how D3 works. While this may seem obvious at first, I underestimated the wonderful complexity of the framework. However, with great effort came great reward. And my reward was a profound understand of a powerful tool.

More importantly, the charts I made are easily adaptable and ported to any other projects I make in the future that need those kinds of visualizations. I always knew D3 contained an incredible amount of customization, but I didn't realize until now exactly how it's so versatile.

From the onset, I wanted to learn as much D3 as I could and apply it in a practical way. And I think I fulfilled that goal. It has been by far the most satisfying self-education endeavor I've ever attempted. Even though there's only two charts in the app, I have a wealth of charts in my head. I only need some data to throw at them.

Along those lines I learned the importance of communicating data effectively. Both charts were a design process as well as a coding process.

I learned the importance of an efficient workflow. Node.js and Gulp made it easy to track changes, add or remove features and debug.

I learned how to make SVGs and icon fonts and effectively incorporate and customize them for my app.

I learned to touch my code every single day. Unfortunately, I was often not doing this, and I quickly could see the consequences. Either plans would fall behind, or worse I would forget the code I wrote just a few days prior.

I learned what makes an app progressive and how to build it as one.

I learned how to use *two* CSS pre-compilers. I started with a crash course in Sass then switched to Less since that's what my current CSS implementation requires. Though, I'm pretty sure the CSS would run fine without both. Related: I learned to really love CSS for all its quirks and flaws.

I don't know if what you build is a reflection of what you learned, but if it is then it's hard to say this web app served it's purpose.

### What went wrong
**Animations.** Wether with Javascript or CSS, I couldn't quite find the right implementation. Since I needed the app to be contained one `html` document, I was limited in how I could smoothly and pleasingly transition a user from one part of the app the another. The current implementation is made with pure CSS. The result is a somewhat buggy experience in rare circumstances.

 **Data.** Early on in the planning phase, I found a dataset that would fit perfectly with my project. While I was mostly correct, I made a critical mistake. By neglecting to thoroughly examine the data, I misjudged how much I had and how broadly (or lack thereof) it could apply to my planned project.

 The result is a disappointing amount of graphics and visualizations in the app. On the bright side, if I do find some, it will be very easy to add since my graphics are already made.

 The project went from having no data, to almost having a lot a data to having some data.


## Issues that remain
* To redo the current pure-CSS page animation/transition implementation. A rare bug can occur if the user:
  * Is at the bottom of the page
  * Scrolls down immediately upon closing an info panel
  * Lifting a finger for one second returns the scrolling functionality
* A secondary effect also disables the auto-hide functionality of a mobile browser's UI. This doesn't effect usability, only aesthetics.
* A complete rewrite is currently in the works to using jQuery and less "hacky" CSS animations.

## What's next
I still have two more data sets I want to implement. The goal is to create a series of buttons on the Check Engine bar chart that will toggle through Average Cost, Most Expensive Repairs and Least Expensive Repairs.

I have already built the chart to support multiple data from a single JSON file. I only need to add the buttons and write the functions for the data change. (This is probably more work-intensive that it sounds)

*Last updated: April 24, 2017*
