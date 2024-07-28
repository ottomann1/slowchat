## Otto Kostmanns final weekend assignment

Welcome to this amazing piece of software. A group messaging app where messages go on a cooldown for an hour before you can fetch them and fetching is limited.

To run this app, run docker-compose up first, then set DATABASE_URL and SHARED_PASSWORD variables in .env and then run npm run dev

## Notes

I did most of my planning on paper notes along with GitHub Projects, which will be linked [[Here]](https://github.com/orgs/saltsthlm/projects/66/).

I'll just rewrite my notes into text right here also:

Sprint 1: Friday - Skeleton mostly finished. Login page, chatroom and should atleast send messages. Statistics not so important but good if done.

Sprint 2: Saturday Morning - Skeleton finished, all basic functionality done, requirements atleast.

Sprint 3: Saturday Evening - Start looking more into error handling and tests

Sprint 4: Sunday Morning - Styling to be done

Sprint 5: Sunday Evening - Refactoring

[[UI plan]](https://utfs.io/f/c2e54c5a-72bc-4243-8e5e-3f4f4713d2b2-1xbxjx.jpg)

I made a few pretty scrambled notes to help me get a better idea of what I'm going to do, they might not make much sense to anyone but me but here's what they said:

Login, choose any username at login, password has to be correct though
First version, try with no cookies. Just log in with a global variable
Use which components? ShadCN, DaisyUI or nextui?

Login screen at main page
Main page is a group chatroom
Statistics page

Zod validation
Testing

Try using messages directly in page and also doing DB query directly if that solves revalidatepath
//

## Challenges

That last note was for one of my biggest challenges in using next.js, which was issues relating to server/client components and caching.
I couldn't find super good information on these topics but I read a bunch of documentation and tested different things until I made it work.
For a long time I couldn't figure out why revalidatepath wouldnt refresh the data, I think I went on a break or something and I just had that thought that maybe I need to load the variables in the main page file and then send them into my components as props for it to work.
I was correct. At first I did a full page refresh which worked but was not so smooth, using revalidatepath made it alot better looking because the whole page won't have to reload just because you send a message or fetch.
Other challenges I faced was I suppose DB schemas, although not much to say except it can be a bit annoying.
Making all the relations correct, setting the variables and cascade the way they should be and such.
Also had some issues with testing because of database.
I ended up just dropping and recreating the tables every test and that solved issues.

## Planning

These notes pretty well explain my big picture plan, I was pretty stressed about this weekend because I got a warning during the week and also performed poorly on one of the group assignments.
As you may notice I tried to squeeze very much into the first 2 sprints so that if there would be issues (which there usually are) then I'd have plenty of time to solve them.
I'm glad I did because even if I saw myself as being mostly doing well on time throughout all the sprints there would pop up different issues here and there.
By the end of sprint 3 I felt pretty confident I would be able to finish on time so I got some free time even.
Styling, refactoring and tests kind of went in to each other and the planning turned a bit messy by sprint 4 and 5.
It just felt more natural doing refactoring before finishing up the styling and tests, it would probably have resulted in me having to redo alot of it otherwise.

## Choices

I ended up using DaisyUI for my components, I thought they looked pretty good and fit the style I had in mind. 
Along with them I went with a dark color scheme because I thought it fit the chill vibes of the app.
But probably I regret the theme a bit, think it would have been better if there were more fun colors.
That's something I could keep working on some other time though.
For my font family I chose Helvetica, Roboto, sans-serif. I think this font family looks cool and Helvetica is probably my favorite font.
Not that I'm very into fonts but still.

For the login page I went pretty basic but with the high quality components and such it still looks pretty cool in my opinion.
By the time you get to the chat page you can tell maybe that I prefer things to be simple but preferably still look good and high quality.
I don't really know what more to say about it, I wanted it to looks good and be effective and I think I did a pretty good job.
Statistics page, I finished pretty fast, not much thought to it. I guess I could have done more but requirements were low so that's what I produced.

Highlights of this project was getting the revalidatepath working, just seeing the messages pop up without having to refresh the whole page was a great feeling.

I decided to put some emoji as the favico, thought it looked fitting.