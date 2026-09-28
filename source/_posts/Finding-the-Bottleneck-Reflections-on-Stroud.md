---
title: "Finding the Bottleneck: Reflections on Stroud"
date: 2026-09-22
updated: 2026-09-22
categories:
  - "Reflections"
tags:
  - "essay"
  - "talk-notes"
  - "debugging"
  - "career"
excerpt: "What I took from Stroud's information session: how to find the constraint that actually limits a system, why the first real fix rarely solves the whole problem, and what that implies for choosing a place to start a career."
---

I went to [Stroud International's information session at Cornell](https://career.cornell.edu/events/2026/09/22/stroud-international-information-session-2/) on September 22. Stroud is an operations consulting firm: rather than writing strategy reports, its consultants go into plants and change how the work actually runs. Three of them presented projects they had led, and partner Taylor Milner talked about starting a career there.

One idea held the evening together: the **bottleneck**, the part of a process that limits what the whole system can produce. It sounds obvious, but every story showed how easy it is to fix the wrong thing — or to fix the right thing and still not move the result.

## The vitamin line: the first fix was real, but it wasn't enough

Lilah Lopez, a senior associate who graduated in 2025, described a vitamin facility that wanted to sell more. To get board approval to take on the orders, the plant had to prove it could produce an **extra two million bottles in a year**. Lilah's job was to make that possible.

The first step was to map the line and ask which machine limited it. Bottles are cleaned, get a silica packet to keep them dry, pass through a filler that drops in a counted number of pills, and then go to quality checks and packing. Each machine has a rated top speed and a slower speed the plant actually runs it at. Here, the filler was the constraint: it ran at **45 bottles per minute** even though it could do 80.

She talked to the operators first. They said turning the dials to maximum didn't produce maximum output — at higher speeds, pills were miscounted and bottles were rejected as "kickouts," which only made their jobs harder.

To understand why, she worked through the filler's mechanics. It has two identical lanes. In each lane, a hopper drops a pile of pills onto the first of three vibrating trays; the trays spread them into neat rows by the third tray; the pills then fall into a five-lane funnel, where sensors count them into the bottle.

Two problems were hiding in that description.

First, pills were getting stuck at the bottom of the funnel, so bottles left slightly underweight. At higher speed, more pills were trying to pass through in less time, and they needed help moving. Adjusting one setting — she called it "vibration number 4" — shook the funnel as pills dropped through, and the count came out right.

Second, at full speed the sensors could not distinguish the end of one batch of pills from the start of the next. The fix was a pause: setting the "speed offset" to 1 introduced a **0.1-second gap** between batches, giving the sensors time to reset. The kickouts stopped.

Those two changes took the filler from 45 to **72 bottles per minute**, 27 more than where it started. Lilah expected the project to be finished. It wasn't. The line as a whole still missed its target, even though every machine's speed profile now showed at least 72.

The remaining constraint sat upstream of the filler, in how bottles were fed into it. A gate opened to let bottles into lane one, closed while a redirection bar swung over, then opened again for lane two. The full cycle took **15 seconds** and delivered **15 bottles** across both lanes — **60 bottles per minute**, below the filler's new 72. The fix was a dial at the bottom of the filler that controlled conveyor speed. After several weeks of monitoring, the plant was on track for the extra two million bottles.

What stayed with me is how reasonable the original diagnosis was. The filler was a sensible first suspect, but improving it moved the bottleneck rather than removing it; the only way to know was to measure the whole line again.

## The lettuce plant: the same fix didn't fit every product

Mackenzie Rosin framed her story as a puzzle. You arrive at a client site. The product is the second-most-popular fresh vegetable in the U.S., 95 percent water; 70 percent of U.S. production is grown in California, and the average American eats about 30 pounds a year. The room guessed lettuce.

The plant takes spinach, spring mix, and arugula from farms, washes it, dries it in what is essentially a ten-times-larger salad spinner, weighs it into portions, bags and seals it, and ships it to grocery stores. Management says demand is rising, costs are climbing, and they are losing market share; new machinery and an outside co-packer are both too expensive. They want improvements, not a report.

Everyone on the floor has a theory about the low output. The machinery is old. New workers don't know the line. Maintenance is slow. The schedule forces too many product changes. At higher speeds, bags don't seal and weights fluctuate, creating rework. Mackenzie listened, then built an output profile from data; the **scale-and-bagger** step was limiting the line.

The operator said the scale and bagger were already set to their maximum of **40 drops per minute**, but only about **22** were happening. Lettuce rides a conveyor onto a vibrating cone that spreads it into **12 buckets**; when a combination of buckets reaches the target weight, they release into a bag. Three things control the drop rate: the bagger-ready signal, the number of buckets per drop, and the time for product to fall into the bag. The signal was fine and gravity was doing its job. The machine was designed to use **three or four buckets per drop** and was using **six**. With 12 buckets, three or four per drop gives about four bags; six gives two.

What controls buckets per drop? The infeed flow rate and how evenly the lettuce spreads across the buckets. A mass balance gives the required flow: bags per minute times the weight of each bag. Three variables affect it — scale-cone vibration, the weight at the cone that triggers the infeed conveyor, and the conveyor-belt speed — and all three were off specification. She and the maintenance team corrected them and expected throughput to rise. It didn't show up in the overall results.

Rather than declare a partial success, Mackenzie split the results by product. Spinach had reached its target; arugula had not moved at all. The difference was shape. Spinach leaves are smooth and flat and slip past one another into the buckets. Arugula has fingers that tangle and clump, tumble back down the conveyor, and stick in the buckets. With new setpoints for each product based on leaf shape, the site raised throughput by **30 percent**.

She came back to the plant later for another project. The team had kept improving past its original target, because they had learned the problem-solving method rather than just received a fix.

## What the numbers leave out

In Q&A, Taylor said the biggest change over his 25 years has been the amount of data available — but more data isn't better data, and it can make people feel they have to use all of it. When he started, the studies and graphs were drawn by hand, standing on the floor with a pencil, clipboard, and stopwatch. Some of the best data still comes from that, because recorded data, or the way it is reported, can be wrong or misleading.

Mackenzie's story made the same point from the other side: the operators' theories were not noise but described real mechanisms, and the useful move was to test them against measurements. When I evaluate a process, I want to ask what a timer includes, whether rejected output is counted, and what a dashboard hides.

## Understand the process you have before buying a new one

During Q&A, Margaret Seeman gave the firm's view on capital investment. Most processes are not optimized as they stand, and she estimated that **20 to 25 percent improvement** is usually available without new equipment. Engineers sometimes jump to a capital project, wait a year, spend a million dollars, and still miss the underlying problem. Taylor added that understanding the current process usually lets clients delay their next equipment purchase by **two to four years**.

The lesson I take is to understand what the current system can already do before asking for more resources, and to judge a proposed investment by the constraint it would actually remove.

## What starting out looks like

Margaret described the shape of the first few years: two weeks of induction on the firm's core tools, then straight to a client site, with a scope of work to own within the first year. The role widens over time, from driving results to coaching colleagues and advising clients. Taylor added that the firm grows its own people, gives **five weeks of vacation**, and protects weekends — and that it hires analytical people from any technical background, not only engineers. His test for a candidate sounded simpler: are you interested in how things work?

## What I'm taking away

Stroud's projects end when the client's goal is met; sometimes secondary problems are left unresolved, which Mackenzie admitted still bothers her. That makes sense for a consulting engagement with a defined target. For research, I want the opposite: a bottleneck found in one system should become a question I can test and generalize. Which other systems share this constraint? What would disprove my explanation? Can I predict where the same fix will transfer?

The rest of what I'm taking away:

- **Define the outcome before the intervention.** "More orders the plant can serve" is a goal; "a faster filler" is a means. The goal tells me which improvements matter and when the work is done.
- **Re-measure the whole system after each change**, because the bottleneck moves.
- **Prefer an explanation of the mechanism to a correlation.** Knowing why the 0.1-second gap mattered is what made that fix trustworthy.
- **When a change works on one case and not another, treat the difference as the lead**, not as an exception to note and move past.
- **Use the knowledge of the people closest to the process, and use measurements to test it.**
- **Understand current capacity before asking for new resources.**
- **Judge my own contribution partly by what the team can do after I leave.** Documentation, reproducible measurements, and shared reasoning outlast a single intervention.
- **Choose work that offers real responsibility, coaching, feedback tied to results, and room for a life outside it.**

I left wanting to get better at finding the bottleneck, at explaining why it exists, and at helping the people around me keep improving after the project ends.
