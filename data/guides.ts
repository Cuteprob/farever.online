export interface GuidePageData {
  slug: string;
  keyword: string;
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  content: string;
}

export const guidePages: GuidePageData[] = [
  {
    slug: "beginner-guide",
    keyword: "Farever guide",
    title: "Farever Beginner Guide - How to Play, Early Priorities & First 30 Minutes",
    metaDescription:
      "New to Farever? This beginner guide covers your first 30 minutes, early priorities, class basics, the Arsenal system unlock, and common mistakes to avoid in Early Access.",
    heading: "Farever Beginner Guide",
    intro:
      "A practical starter guide covering the first 30 minutes, early priorities, class basics, and key systems every new Farever player should understand.",
    content: `## Quick Answer

**Farever** is an online cooperative action RPG by Shiro Games, set in the fantasy world of Siagarta. You explore an open world solo or with friends, fight through dungeons, craft gear, and build your character through a class + weapon system.

The most important early advice: **pick a class that sounds fun, experiment with weapons, and pay attention to weapon skills, crafting materials, and movement.** Farever is still in Early Access, so fixed "perfect route" advice is less useful than learning the core loop.

*Status: Early Access (launched May 6, 2026). Content and balance may change.*

## Quick Answers — Most-Searched Beginner Questions

**How do I get a free mount?**
Open **Esc → Shop** and claim the free mount listing. No level required, no cost. There is also a free companion in the same menu. Full details: [Free Mount Guide](/free-mount).

**When does the Arsenal system unlock?**
At **level 7**. You gain a secondary weapon slot that lets you borrow one skill or passive from another weapon. Full details: [Arsenal System](/arsenal-system).

**How do I use storage?**
Storage chests are found in towns and safe zones. Interact with a storage chest to deposit items. Storage is shared across your characters on the same server.

**How does salvage work?**
Open your inventory, select unwanted gear, and choose **Salvage** to break it into crafting materials. This is more efficient than vendoring low-level items.

**How do I fast travel?**
Discover fast travel points (glowing waypoints) in the open world by walking near them. Once discovered, open your map and click on any unlocked waypoint to teleport.

**Where do I find weapons?**
Weapons drop from enemies, dungeon bosses, crafting (Blacksmithing), and world exploration. All classes can use all weapons. Full details: [Weapons Guide](/weapons-guide).

**How many players can co-op together?**
Up to **4 players**. Loot is individual. Full details: [Co-op Explained](/coop-explained).

## What Is Farever?

Farever is an ARPG with MMO-lite elements. Based on the official Steam page, the Early Access version focuses on:

- Online multiplayer action RPG play
- A vast fantasy open world called Siagarta
- Solo play and online co-op
- Dangerous dungeons, enemy camps, and curiosities across the realm
- Dynamic combat with platforming and environmental puzzles
- Crafting, gathering jobs, custom gear, weapon skills, and class-driven playstyles

It is **not** a traditional MMO. Think of it as a co-op action RPG with a persistent open world.

## First 30 Minutes

### Minutes 1–10: Pick Your Class

Your starting class determines your resource system and core identity:

| Class | Resource | Playstyle |
|---|---|---|
| Warrior | Rage | Melee tank, survivability, front-line pressure |
| Rogue | Combo Points | High mobility, burst damage, active combat rhythm |
| Mage | Spark | Ranged magic, resource timing, Conduit management |
| Cleric | Prayers | Support, healing, shielding, divine utility |

**Don't overthink this.** Your class sets your foundation, but weapons heavily modify your playstyle. You can always create another character later.

### Minutes 10–20: Learn the Combat Loop

Farever's combat is action-based with active dodging. Key things to notice early:

- Each weapon has a unique moveset and 4 skills
- Skills unlock as you level the weapon (main slot only)
- Dodging has i-frames — learn the timing
- Your class resource appears on your action bar

### Minutes 20–30: Start Reading Your Build

This is when Farever starts asking you to compare more than raw item level. Your class, weapon skills, attributes, and crafted gear all shape how your character actually fights.

During the first session, focus on:
- Trying different weapons to see what feels good
- Picking up gathering materials as you pass them
- Not spending gold on vendor gear (drops are better)
- Reading skill descriptions instead of only comparing damage numbers

## Best Early Priorities

### 1. Learn Movement First
Farever's official page emphasizes dynamic combat and platforming. Dodging, climbing, gliding, diving, and route reading matter, so movement is not just travel; it affects survival and exploration.

### 2. Experiment with Weapons
Every weapon has a unique kit. Don't commit to one weapon just because it has higher stats — the moveset and skills matter more.

### 3. Pick a Gathering Profession
Professions are separate from combat. Starting a gathering profession early gives you crafting materials when you need them later.

### 4. Don't Hoard Gold
Vendor gear is rarely worth buying. Spend gold on consumables and profession upgrades instead.

### 5. Watch Patch Notes
Shiro Games describes Farever as an Early Access game shaped by community feedback. If something feels rough during launch week, check patch notes before assuming a guide is final.

## Common Beginner Mistakes

### Mistake 1: Ignoring Weapon Skills
A weapon's value comes from its full kit (moveset + 4 skills + Arsenal utility), not just its damage number.

### Mistake 2: Treating One Early Build as Final
Farever is built around classes, weapon skills, attributes, specializations, and gear. Early builds should be tested, not locked in permanently.

### Mistake 3: Staying in the First Zone Too Long
If you're overleveled, move on. The game scales encounters by zone, so staying in zone 1 past its level range wastes time.

### Mistake 4: Not Dodging
This is an action RPG, not a tab-target game. Dodge-rolling is essential for survival, especially in dungeons.

### Mistake 5: Playing Solo When Struggling
Farever is designed for co-op. If a dungeon feels too hard solo, grouping up makes it significantly easier.

## What to Learn Next

Once you've got the basics down, these are the natural next steps:

- [Best Class in Farever](/best-class) — which class fits your playstyle?
- [Arsenal System Explained](/arsenal-system) — how to build hybrid setups
- [How to Play Co-op](/how-to-play-coop) — party system and known issues

## FAQ

**Is Farever free to play?**
No. Farever is a paid Early Access game on Steam (AppID 3672400).

**Can I respec my class?**
You cannot change your class, but your build is heavily defined by weapons, which can be swapped freely.

**Is there PvP?**
Not in the current Early Access version.

**How long is the Early Access expected to last?**
Shiro Games estimates approximately one year.

**What platforms is Farever on?**
PC (Steam) only at launch. Console versions have not been announced.`,
  },
  {
    slug: "best-class",
    keyword: "Farever best class",
    title: "Best Class in Farever - Solo, Co-op & Beginner Recommendations (Early Access)",
    metaDescription:
      "Find the best Farever class for your playstyle. Situational recommendations for solo, co-op, and beginners based on Early Access gameplay — not a rigid tier list.",
    heading: "Best Class in Farever",
    intro:
      "Situational class recommendations for solo, co-op, and beginner players. Based on Early Access gameplay, not a rigid tier list.",
    content: `## Quick Recommendation

There is no single "best class" in Farever. The right choice depends on your playstyle and whether you play solo or co-op. Here is the short version:

| Situation | Recommended Class | Why |
|---|---|---|
| Best for Solo | Warrior | Survivability + self-sustain |
| Best for Co-op | Cleric | Party healing and shielding |
| Best for Beginners | Warrior | Simple resource, forgiving mistakes |
| Best for Damage | Rogue | Highest burst, active play rewarded |
| Best for Range | Mage | Safest positioning, strong AoE |

*All rankings reflect Early Access judgment and may change with patches.*

## Best Class for Solo

### Warrior

The Warrior is the most forgiving solo class. Rage builds naturally during combat, so you don't need to manage a complex resource system. The Warrior has:

- Strong self-healing through certain weapon skills
- High base HP and defense
- Straightforward melee combat
- Good survivability in dungeons

If you are playing solo and want the smoothest early experience, Warrior is the safest pick.

### Runner-up: Rogue

The Rogue can solo effectively once you learn the dodge-heavy playstyle, but the margin for error is thinner. Rogue rewards skill with higher damage output.

## Best Class for Co-op

### Cleric

In co-op, the Cleric becomes extremely valuable. Prayers provide:

- Party-wide healing
- Damage-absorbing shields
- Utility buffs
- Divine offensive abilities

A group with a Cleric can push harder content more safely. If you know you'll be playing with friends, Cleric fills a role that no other class can replicate.

### Runner-up: Mage

Mage provides strong AoE damage from a safe distance, which helps clear dungeon rooms faster. The Conduit system adds crowd control utility.

## Best Class for Beginners

### Warrior

For players completely new to ARPGs:

- Rage is the simplest resource — it builds when you fight, no management needed
- High HP means more room for learning dodge timing
- Weapons are straightforward
- You can still build into damage later via Arsenal

### Second choice: Cleric

Cleric has a slightly steeper learning curve but is very forgiving due to self-healing.

## Class Comparison Table

| Feature | Warrior | Rogue | Mage | Cleric |
|---|---|---|---|---|
| Resource | Rage | Combo Points | Spark | Prayers |
| Range | Melee | Melee | Ranged | Mid-range |
| Survivability | ★★★★★ | ★★★ | ★★★ | ★★★★ |
| Solo Power | ★★★★ | ★★★★ | ★★★ | ★★★ |
| Co-op Value | ★★★ | ★★★ | ★★★★ | ★★★★★ |
| Beginner Friendly | ★★★★★ | ★★ | ★★★ | ★★★★ |
| Skill Ceiling | ★★★ | ★★★★★ | ★★★★ | ★★★ |

## How We Rank Classes

This page does not use an absolute tier list. Instead, we rank by **situation**:

- **Solo viability** — can you survive and progress alone?
- **Co-op contribution** — do you add unique value to a group?
- **Beginner friendliness** — how forgiving is the learning curve?
- **Damage potential** — how high can your output go with skill?

Rankings are based on community experience during the first week of Early Access. They are not data-mined and should be treated as **working recommendations**, not final answers.

## Patch Notes That May Change Rankings

Check the [Patch Notes](/patch-notes) page for balance changes. Class tuning is expected throughout Early Access.

## FAQ

**Can I change my class later?**
No. You choose your class at character creation. However, you can create multiple characters.

**Does class lock me into a weapon type?**
No. All classes can use all weapons. Your class defines your resource and passives, but weapons define your combat moveset.

**What about the talent tree?**
At level 10 you unlock your class talent tree, adding further specialization. This does not change the class fundamentals above.

**Is there a meta class?**
Too early to tell. The game is in its first week of Early Access, and Shiro Games is actively balancing.`,
  },
  {
    slug: "arsenal-system",
    keyword: "Farever Arsenal system",
    title: "Farever Arsenal System Explained - How It Works, Best Choices & Build Tips",
    metaDescription:
      "How the Farever Arsenal system works: secondary weapon slot, skill borrowing, build synergies, and beginner-friendly Arsenal choices explained for Early Access.",
    heading: "Farever Arsenal System Explained",
    intro:
      "Everything you need to know about the Arsenal system — how it changes your build, best early choices, and how to create hybrid weapon setups.",
    content: `## Quick Answer

Farever's build system is based on **classes, weapon skills, attributes, specializations, and custom gear**. The important idea is that your weapon choice is not just a stat stick; it changes how your character fights.

This page uses "Arsenal" as a practical build-planning frame: how to think about weapons, skills, attributes, and gear synergies without pretending every launch-week interaction is already solved.

## What Is the Arsenal System?

In many ARPGs, you equip a weapon mainly for stats. Farever puts more emphasis on weapon identity and skill interactions.

When evaluating a weapon or build path, look at:

1. What the weapon lets you do in combat
2. Which class resource or role it supports
3. Whether its attributes solve a weakness
4. How it fits your crafted gear and specialization choices

Treat any exact launch-week numbers as patch-sensitive unless Shiro publishes them directly.

## How Arsenal Changes Your Build

Without build planning, every player can drift toward the highest visible damage number. A better Farever build asks:

- Do I need safer positioning?
- Do I need more burst or better sustained damage?
- Does my group need protection, support, or faster room clear?
- Am I building for solo exploration, dungeons, or co-op play?

This is where Farever's build depth should come from: class identity plus weapon skills plus gear choices.

## Beginner-Friendly Arsenal Choices

If you're unsure what to test first, use this simple decision table:

| Your Need | What to Test | Why |
|---|---|---|
| Dying too often | Defensive attributes, safer range, support skills | Survival keeps dungeon runs stable |
| Slow clear speed | Better AoE, burst windows, group combo timing | Faster rooms reduce pressure |
| Weak boss uptime | Mobility, dodges, ranged options | Boss fights punish poor positioning |
| Co-op support gap | Protection, healing, control, buffs | Group value is not only damage |

The key principle: **use your build to cover a weakness, not only to exaggerate a strength.**

## Common Mistakes

### Mistake 1: Only Looking at Stats
A weapon with a better number is not always better if its skills, timing, or range do not fit the content you are running.

### Mistake 2: Copying a Build Without Context
A solo exploration build, a co-op dungeon build, and a boss-focused build can value different things.

### Mistake 3: Treating Early Access Numbers as Permanent
Shiro plans polishing, balancing, and bug fixing during Early Access. Any exact build number can change.

### Mistake 4: Never Changing Arsenal
As you find new weapons and gear, re-evaluate your build. The best setup can change as your equipment, party, and patch version change.

## Arsenal and Class Synergy

The most interesting Farever builds combine class identity with weapon and gear choices:

- A front-line character may value survivability and control
- A mobile damage build may value timing, burst, and escape tools
- A ranged build may value positioning and safe damage windows
- A support build may value group protection over personal damage

Because Farever emphasizes class aptitudes, weapon skills, attributes, and custom gear, build planning should stay flexible.

## FAQ

**When should I start thinking about builds?**
Immediately, but lightly. Learn movement and weapon feel first, then optimize once you understand the content.

**Are exact build numbers final?**
No. Farever is in Early Access, and Shiro explicitly plans polishing, balancing, and bug fixing.

**Should I follow a best build blindly?**
No. Use recommendations as starting points, then test against your class, weapon feel, party role, and patch version.

**What matters more: class or weapon?**
Both. The official Steam page describes classes, weapon skills, attributes, specializations, and gear as connected parts of character development.

**Where should I check for changes?**
Use the [Patch Notes](/patch-notes) page and official Steam news before relying on older build advice.`,
  },
  {
    slug: "how-to-play-coop",
    keyword: "Farever invite friends",
    title: "How to Invite Friends in Farever - Party Setup, Fix Co-op Not Working & Troubleshooting",
    metaDescription:
      "Step-by-step guide to inviting friends and setting up parties in Farever. Fix co-op not working, Steam invite issues, and party desync with proven troubleshooting steps.",
    heading: "How to Invite Friends & Fix Co-op in Farever",
    intro:
      "Step-by-step party setup, Steam invite walkthrough, and troubleshooting for when co-op is not working. For multiplayer mechanics (party size, loot sharing, XP), see [Co-op Explained](/coop-explained).",
    content: `## Quick Answer

To play co-op in Farever:

1. Both players must be on the same server/region
2. Open the social menu (\`P\` or through the menu)
3. Send a party invite using your friend's character name
4. Accept the invite to join the same party
5. Travel to the same area to see each other

Steam confirms online co-op support. Party-size and matchmaking details should be checked in-game because Early Access networking is still being actively improved.

*Note: Early Access co-op has known issues. See the troubleshooting section below.*

## How Co-op Works

Farever is positioned as an online co-op action RPG. In practice, co-op value comes from shared exploration, dungeon runs, and group role coordination. Treat the exact launch-week party behavior as patch-sensitive.

High-confidence co-op facts:

- Steam lists Online Co-op as a supported feature
- The official description emphasizes playing alone or with friends
- Shiro's launch-week priority note specifically calls out the Steam invite path, connection issues, and character syncing
- Performance, server stability, and latency are active priorities

## How to Play With Friends

### Step-by-step:

1. **Create characters on the same server** — check the server selection screen
2. **Add friends** via the social panel (\`P\` key)
3. **Send party invite** — click their name > Invite to Party
4. **Meet in the world** — party members appear on your minimap
5. **Enter dungeons together** — walk into the dungeon entrance while grouped

### Steam Friends Integration

You can also invite Steam friends directly through the Steam overlay (\`Shift+Tab\`). The game should show online friends who own Farever.

## Party System Known Issues

> **Important:** These are known Early Access issues. They are not bugs you can "fix" — they require patches from Shiro Games.

| Issue | Status | Safer Player Action |
|---|---|---|
| Steam invite / party system friction | Official Priority | Use in-game invites where available; restart both clients if stuck |
| Connection and character syncing issues | Official Priority | Avoid repeated invite spam; wait for patch notes if the issue persists |
| Performance, server stability, and latency | Official Priority | Check region/server load and official updates before deep troubleshooting |
| Gamepad actions missing bindings | Official Priority | Use keyboard/mouse fallback for affected actions until bindings improve |

*Last checked: May 8, 2026 (Early Access launch week).*

## What to Try If Party Does Not Work

Before reporting a bug, try these steps in order:

1. **Both players fully restart the game** (not just relog)
2. **Verify you are on the same server/region**
3. **Try inviting by character name instead of Steam invite**
4. **The host should be in a safe zone** when inviting
5. **Wait 30 seconds after loading in** before sending invites
6. **Check Steam overlay** — if Steam shows you offline, party may fail

If none of these work, check the [Farever Steam discussions](https://steamcommunity.com/app/3672400/discussions/) and official Steam news for the latest reports.

## Solo vs Co-op Differences

| Aspect | Solo | Co-op |
|---|---|---|
| Pace | Your own route | Coordinate routes and dungeon timing |
| Build Pressure | Self-sustain matters more | Group utility becomes more valuable |
| Issue Risk | Fewer party-system variables | More exposed to invite, sync, and latency issues |
| Best Use | Learn movement and class feel | Run dungeons and test group roles |

## FAQ

**Is Farever always online?**
Yes. Even solo play requires an internet connection.

**Can I play co-op cross-platform?**
Not currently. Farever is PC-only (Steam) in Early Access.

**How many players can co-op together?**
Check the current in-game party UI for the exact limit. Steam confirms online co-op, but launch-week networking details can change.

**Do I need to be the same level as my friends?**
No strict level requirement, but very large level gaps may affect experience gains and combat effectiveness.

**Is there matchmaking?**
Use the current in-game UI as the source of truth. This page focuses on stable co-op setup advice and known official priorities.`,
  },
  {
    slug: "boss-drops",
    keyword: "Farever boss drops",
    title: "Farever Boss Drops Tracker - Community-Verified Loot Tables & Drop Status",
    metaDescription:
      "Community-tracked Farever boss drops with verification status. See which drops are confirmed, reported, or need testing — updated for Early Access.",
    heading: "Farever Boss Drops Tracker",
    intro:
      "A community-driven boss drop tracker. Every entry is marked with its verification status. We do not list unconfirmed data without disclosure.",
    content: `## Important Accuracy Note

This page tracks boss drops based on **community reports and verified gameplay**. This is not data-mined information.

Every entry has a status:

- 🟢 **Verified** — Confirmed by multiple independent sources
- 🟡 **Community Reported** — Reported by players but not independently verified
- ⚪ **Unverified** — Single report or unclear evidence
- 🟠 **Needs Retest** — May have changed after a patch

If you have verified drop information, please share it in the [Steam Discussions](https://store.steampowered.com/app/3672400/Farever/) and we will update this page.

## Current Drop Data Status

Farever launched into Early Access on May 6, 2026, so reliable boss-drop data is still thin. Instead of publishing a fake complete loot table, this tracker starts with what can be confirmed from official sources:

| Confirmed System | Source | What It Means for Drops |
|---|---|---|
| Dangerous dungeons and bosses exist | Steam Store | Boss-specific tracking is a valid player need |
| Treasures, equipment, loot, and custom gear are part of progression | Steam Store | Drop reports should include item name, source, and patch context |
| Crafting and gathering jobs support character progression | Steam Store | Materials and crafted gear may matter as much as boss loot |
| More bosses, foes, dungeons, items, and weapons are planned for 1.0 | Steam Early Access notes | Any tracker must be patch-aware |

## Report Queue

No specific boss drop is marked verified until it has evidence. Use this table to see what kind of entries will be accepted:

| Boss / Encounter | Location | Reported Drop | Evidence Needed | Status |
|---|---|---|---|---|
| Pending | Pending | Pending | Screenshot, video, or repeated independent reports | Needs Evidence |
| Pending | Pending | Pending | Patch version and party size if available | Needs Evidence |

This is intentionally conservative. A sparse tracker is better than a confident-looking table that misleads new Farever players.

## Drop Status Legend

| Status | Meaning | Reliability |
|---|---|---|
| 🟢 Verified | Confirmed by 3+ independent players | High |
| 🟡 Community Reported | 1-2 players reported, awaiting verification | Medium |
| ⚪ Unverified | Single report, no corroboration | Low |
| 🟠 Needs Retest | Was verified but a patch may have changed it | Uncertain |
| 🔴 Changed After Patch | Previously verified, now confirmed changed | Updated data needed |

## Community Report Format

If you want to contribute drop data, the most useful format is:

\`\`\`
Boss: [name]
Location: [zone / dungeon]
Drop: [item name]
Class played: [your class]
Party size: [solo / 2 / 3 / 4]
Patch version: [check settings menu]
Screenshot: [link if available]
\`\`\`

Post this in the Steam Discussion thread or Reddit r/Farever.

## What Counts as Verified

A drop should only be marked Verified when it has:

1. A screenshot or video showing the item and source
2. Patch/version context where possible
3. More than one independent report, or one high-quality report with clear evidence
4. No known patch note contradicting the drop

## Patch Changes

No drop changes have been documented yet (game launched May 6, 2026). This section will update when patches affect drop tables.

## FAQ

**Are boss drops guaranteed?**
No. Drops appear to be RNG-based with varying probabilities.

**Does party size affect drops?**
Not confirmed. Individual loot means each player rolls independently.

**Do bosses have different loot pools for different classes?**
Not confirmed. Do not assume class-specific or class-agnostic loot pools until reliable evidence exists.

**How often do bosses respawn?**
Dungeon bosses respawn when you re-enter the dungeon. Open world bosses have respawn timers (exact times under investigation).`,
  },
  {
    slug: "patch-notes",
    keyword: "Farever patch notes",
    title: "Farever Patch Notes & Player Impact Tracker - Updates, Hotfixes & Changes",
    metaDescription:
      "Farever patch notes with player impact analysis. See what changed, how it affects your builds and co-op, and which guides are affected by each update.",
    heading: "Farever Patch Notes & Player Impact Tracker",
    intro:
      "Not just patch notes — player impact analysis. For each update, we explain what changed and what it means for your gameplay.",
    content: `## Latest Update

### Early Access Launch — May 6, 2026

**Version:** 0.1.0 (Initial Early Access Release)

Farever launched into Steam Early Access with the following content:

- Online multiplayer action RPG gameplay
- A vast fantasy open world, playable alone or with friends
- Dangerous dungeons, enemy camps, curiosities, treasures, and equipment
- Dynamic combat and platforming
- Multiple classes with distinct aptitudes, skills, and playstyles
- Weapon skills, attributes, specializations, custom gear, crafting, and gathering jobs

## What Changed

Since this is the launch version, there are no "changes" yet — this section will update with each patch.

## Player Impact

### What players should focus on at launch:

- **Class and weapon choices matter** — use early sessions to learn playstyle before chasing a meta
- **Movement matters** — official materials emphasize dynamic combat, traversal, and platforming
- **Co-op has launch-week priorities** — check our [co-op guide](/how-to-play-coop) for the current official priority list
- **Boss drops need evidence** — check our [drops tracker](/boss-drops) for the reporting format before trusting any table

### Known launch issues:

- Party invite system can be unreliable
- Some players report desync in co-op dungeons
- Fast travel while in a party may disconnect members
- Performance issues reported on lower-end hardware

## Known Issues After Patch

| Issue | Severity | Status | Affected Area |
|---|---|---|---|
| Party system linked to Steam invites | High | Official Priority | Co-op |
| Connection and character syncing issues | High | Official Priority | Co-op |
| Performance, server stability, and latency | High | Official Priority | All regions |
| Gamepad controls and missing bindings | Medium | Official Priority | Controls |

## Affected Guides

When patches change game mechanics, the following guides may need updates:

| Guide | Last Verified | Needs Update? |
|---|---|---|
| [Beginner Guide](/beginner-guide) | May 8, 2026 | Current, official-fact based |
| [Best Class](/best-class) | May 8, 2026 | Patch-sensitive judgment |
| [Arsenal System](/arsenal-system) | May 8, 2026 | Rewritten as build framework, not exact stat claims |
| [Co-op Guide](/how-to-play-coop) | May 8, 2026 | Updated to official priority wording |
| [Boss Drops](/boss-drops) | May 8, 2026 | Conservative tracker, no fake verified drops |

## Patch Timeline

| Date | Version | Type | Key Changes |
|---|---|---|---|
| May 6, 2026 | 0.1.0 | Initial Release | Early Access launch |

*This timeline will grow with each update. We aim to analyze patches within 24 hours of release.*

## FAQ

**How often does Farever get updated?**
Unknown yet. As an Early Access title, frequent updates are expected.

**Where are official patch notes posted?**
Check the [Steam News Hub](https://store.steampowered.com/news/app/3672400) for official announcements.

**Do patches reset my progress?**
No patches have reset progress so far. Shiro Games would announce any progress-affecting changes in advance.

**How does this page differ from official patch notes?**
We add **player impact analysis** — what each change means for your builds, co-op experience, and existing strategies. We don't just list changes; we explain what they mean.`,
  },
  {
    slug: "free-mount",
    keyword: "Farever free mount",
    title: "Farever Free Mount Guide - How to Get Your First Mount & Companion",
    metaDescription:
      "How to get a free mount and companion in Farever. Step-by-step guide covering the in-game Shop claim, all mount sources, and companion acquisition in Early Access.",
    heading: "How to Get a Free Mount in Farever",
    intro:
      "A quick guide to claiming your free mount and companion, plus every known mount acquisition method in Farever Early Access.",
    content: `## Quick Answer

Farever gives every player a **free mount and a free companion** through the in-game Shop. Open the Escape menu, navigate to the Shop tab, and claim them at no cost. Additional mounts and companions can be found as rare drops from overworld enemies and dungeon bosses.

*Source: Verified through Reddit beginner-tips threads and Steam community discussions during launch week.*

## How to Get Your Free Mount

1. Press **Esc** to open the game menu
2. Navigate to the **Shop** tab
3. Find the free mount listing — it costs zero currency
4. Click **Claim** to add it to your collection
5. Open your mount menu to equip and summon it

No level requirement. No quest prerequisite. No real-money purchase needed.

> Many new players miss this because the word "Shop" implies paid items only. The free mount and companion are deliberately placed there as starter gifts.

## How to Get Your Free Companion

The same Shop menu includes a **free companion**:

1. Open **Esc** → **Shop**
2. Locate the free companion entry
3. **Claim** it
4. Equip from your companion menu

Companions follow your character in the overworld. Whether companions provide gameplay benefits beyond cosmetic presence is still being tested by the community.

## All Known Mount Sources

| Source | Type | Details | Status |
|---|---|---|---|
| In-game Shop (free) | Guaranteed | Available to all players immediately | 🟢 Verified |
| Overworld rare enemies | Rare drop | Elite or rare overworld mobs may drop mounts | 🟡 Community Reported |
| Dungeon bosses | Rare drop | Boss encounters may drop unique mounts | 🟡 Community Reported |
| Achievements | Reward | Some progression milestones may unlock mounts | ⚪ Unverified |

*Farever is in Early Access. Mount sources and availability may change with patches.*

## Common Questions New Players Ask

**Where is the Shop menu?**
Press Esc during gameplay. The Shop is one of the tabs in the main menu. It is not a separate NPC or location in the world.

**Do mounts work inside dungeons?**
Mounts are generally disabled inside dungeon instances. They are used for overworld travel and exploration.

**Are there different mount speeds?**
Not confirmed in the current Early Access build. All mounts appear to provide the same movement speed increase.

**I claimed the mount but cannot find it — what do I do?**
Check your mount or collection menu, not your inventory. If it does not appear, restart the game client. Some players have reported a brief delay after claiming.

**Can I trade mounts with other players?**
Not confirmed. The player trading system in Early Access is limited.

## FAQ

**Is the free mount really free?**
Yes. It is claimed through the in-game Shop at zero cost. No premium currency, no real money, no quest required.

**How many mounts are in the game?**
The exact total number is still being documented. The free mount is the only guaranteed one; others are rare drops.

**Do companions do anything in combat?**
Not confirmed. Companions appear to be cosmetic followers during Early Access. Check patch notes for changes.

**When should I claim my free mount?**
Immediately. There is no reason to wait. Open the Shop as soon as you can access the Esc menu.

## What to Read Next

- [Beginner Guide](/beginner-guide) — your first 30 minutes, including early priorities
- [Boss Drops Tracker](/boss-drops) — track which bosses drop rare mounts and gear
- [How to Play Co-op](/how-to-play-coop) — explore Siagarta with friends`,
  },
  {
    slug: "weapons-guide",
    keyword: "Farever weapons",
    title: "Farever Weapons Guide - Weapon Types, How They Work & Best Class Pairings (Early Access)",
    metaDescription:
      "Farever weapons guide: known weapon types, how weapon skills work, how to get weapons, Arsenal combos, and recommended class pairings in Early Access.",
    heading: "Farever Weapons Guide",
    intro:
      "How weapons work in Farever, known weapon types from launch-week testing, how to acquire them, and which weapons pair best with each class through the Arsenal system.",
    content: `## Quick Answer

Farever has multiple weapon types, each with a **unique moveset and 4 unlockable skills**. Weapons are **not locked to any class** — all classes can equip all weapons. Your weapon choice defines how your character fights, while your class defines your resource system and passives.

At **level 7**, the Arsenal system lets you equip a secondary weapon and borrow one skill or passive from it, creating hybrid builds.

*Status: Early Access (launched May 6, 2026). Weapon balance and skill details may change with patches.*

## How Weapons Work

Every weapon in Farever is more than a stat stick:

- You gain its **unique basic attack moveset** (light and heavy attacks)
- You unlock up to **4 skills** as you level the weapon through use
- The weapon's skill kit shapes your combat role more than raw damage numbers
- Weapons level up by being equipped in your **main slot** during combat

A weapon with slightly lower stats but a better skill kit can outperform a higher-level weapon with skills that don't fit your playstyle.

> **Community tip:** Prioritize weapons based on their full kit (all 4 skills) rather than just raw damage stats. Leveled-up weapon skills remain relevant, making older specialized weapons valuable for specific builds. — *Source: Community testing, Reddit discussions*

## Weapon Categories

Based on community research during launch week, Farever weapons fall into these categories:

| Category | Range | Playstyle | Best For |
|---|---|---|---|
| Swords | Melee | Balanced offense and defense | General purpose, beginners |
| Sword & Shield | Melee | Defensive, tank-oriented | Survivability, front-line |
| Great Weapons | Melee | Slow, high damage per hit | Burst windows, stagger |
| Daggers | Melee | Fast, combo-based | Rogue synergy, speed |
| Bows | Ranged | Sustained ranged damage | Kiting, safe positioning |
| Staves | Ranged | Magic-oriented, AoE | Mage synergy, crowd control |
| Maces / Hammers | Melee | Stagger, control | Crowd control, disruption |
| Holy Weapons | Mid-range | Support-oriented | Cleric synergy, healing |

*This list reflects community observations during Early Access week 1. Categories and names may be refined as more data becomes available.*

## How to Get Weapons

| Source | Frequency | Quality Range |
|---|---|---|
| Enemy drops | Common | Low to mid |
| Dungeon boss drops | Uncommon | Mid to high |
| Crafting (Blacksmithing) | Crafted | Depends on profession level |
| Quest / story rewards | Fixed | Varies |
| World exploration | Rare | Can include unique items |

**Key insight:** Don't frequently swap weapons just for higher item level. A weapon whose full skill kit fits your playstyle is more effective than a higher-level weapon with skills you never use. — *Source: Experienced player consensus on Reddit and Steam*

## Weapons and the Arsenal System

The **Arsenal system** (unlocked at level 7) lets you equip a secondary weapon:

- Your **main weapon** provides your full moveset and all 4 skills
- Your **Arsenal weapon** lets you borrow **1 skill or 1 passive** to your hotbar
- Arsenal weapons do **not** need to match your class

This creates powerful hybrid possibilities:

| Your Main Role | Arsenal Strategy | Example |
|---|---|---|
| Melee DPS | Borrow ranged control or escape | Rogue main + Staff Arsenal for a slow or root |
| Ranged DPS | Borrow defensive or mobility | Mage main + Sword & Shield Arsenal for block |
| Tank | Borrow offensive burst for solo | Warrior main + Dagger Arsenal for a finisher |
| Support | Borrow survivability for solo | Cleric main + Sword & Shield Arsenal for durability |

**Key principle:** Use your Arsenal to cover a weakness, not only to double down on a strength. — *Source: [Arsenal System guide](/arsenal-system)*

## Weapon Leveling

- Weapons gain XP when equipped in your **main slot** during combat
- Higher weapon level unlocks more of the weapon's 4 skills
- Investing in a weapon whose skill package fits your build is more effective than constantly swapping
- Leveled skills on older weapons stay relevant — don't discard a weapon just because you found a higher-level one

## Best Weapons by Class

Since all classes can use all weapons, the real question is: which weapon skills complement your class resource?

| Class | Resource | Recommended Weapon Styles | Reasoning |
|---|---|---|---|
| Warrior | Rage (builds during combat) | Sword & Shield, Great Weapons | Rage rewards staying in melee and trading hits |
| Rogue | Combo Points (build via attacks) | Daggers, Swords | Fast attacks build Combo Points efficiently |
| Mage | Spark (magic resource) | Staves, Bows | Ranged weapons complement safe positioning |
| Cleric | Prayers (support resource) | Holy Weapons, Maces | Support skills synergize with mid-range utility |

*These are starting recommendations. The Arsenal system means unconventional combinations can work with the right build logic.*

## Common Weapon Mistakes

### Mistake 1: Only Comparing Damage Numbers
A weapon's value comes from moveset + skills + Arsenal utility, not just the damage stat.

### Mistake 2: Never Experimenting
Different content (solo exploration, co-op dungeons, boss fights) benefits from different weapon loadouts.

### Mistake 3: Ignoring Weapon Skills
Skills unlock as you level a weapon. Always read what skills actually do before discarding a weapon type.

### Mistake 4: Hoarding Every Weapon
Inventory space matters. Keep weapons you're actively leveling or plan to use for Arsenal. Salvage the rest for crafting materials.

## FAQ

**Can I use any weapon with any class?**
Yes. Weapons are not class-locked. Your class determines your resource system (Rage, Combo Points, Spark, Prayers), but weapons determine your combat moveset.

**How many skills does each weapon have?**
Each weapon has 4 skills that unlock progressively as you level the weapon through use.

**Do weapons drop with random stats?**
Weapons can have varying stats and attributes. The exact randomization system is still being documented.

**Can I craft weapons?**
Yes, through the Blacksmithing profession. Crafted weapons require specific materials and sufficient profession level.

**Is there a complete weapon database?**
Community databases like FareverDB are being built. This guide focuses on system logic rather than raw data that changes with patches.

## What to Read Next

- [Arsenal System Explained](/arsenal-system) — how to use secondary weapons for hybrid builds
- [Best Class in Farever](/best-class) — which class fits your weapon preferences
- [Beginner Guide](/beginner-guide) — weapon basics in context of early priorities`,
  },
  {
    slug: "coop-explained",
    keyword: "Farever party size",
    title: "Farever Multiplayer FAQ - Party Size, Shared Loot, Solo vs Co-op & Buying Decision",
    metaDescription:
      "Farever multiplayer FAQ: max party size, is loot shared, is XP shared, solo vs co-op efficiency, and whether to buy for multiplayer. Pre-purchase decision guide.",
    heading: "Farever Multiplayer FAQ",
    intro:
      "Pre-purchase and pre-party answers: how many players, is loot shared, solo vs co-op efficiency, and what to expect from multiplayer. For step-by-step party setup and troubleshooting, see [How to Invite Friends](/how-to-play-coop).",
    content: `## Quick Answer

Farever supports **online co-op for up to 4 players**. Loot is **individual** — each player gets their own drops. The game can be played entirely solo. Content scales to party size, so grouping does not reduce your rewards.

*Sources: Steam store page, community testing during launch week, Reddit discussions.*

## Co-op Facts at a Glance

| Question | Answer | Source |
|---|---|---|
| Max party size? | Up to 4 players | Steam / In-game |
| Loot system? | Individual (each player rolls separately) | Community verified |
| Shared XP? | Party members gain experience; exact sharing details under investigation | Community testing |
| World type? | Shared open world, instanced dungeons | Community verified |
| Cross-platform? | No — PC (Steam) only in Early Access | Official |
| Solo viable? | Yes — all content can be played solo | Official |
| Content scaling? | Scales to party size | Community reported |
| Level requirement to group? | No strict lock, but large gaps affect efficiency | Community reported |

## How Loot Works in Co-op

Based on community testing during launch week:

- **Loot is individual** — each player gets their own drops independently
- You do **not** compete with party members for drops
- Boss drops roll separately for each player
- Chests are per-player (each player can loot the same chest once per character)

This means grouping **does not reduce** your loot — it only adds the benefit of faster clears and shared combat.

## Solo vs Co-op: Which Is Better?

| Aspect | Solo | Co-op (2–4 players) |
|---|---|---|
| Pace | Your own speed, no coordination | Faster clears, requires some coordination |
| Difficulty | Content balanced for solo | Scales to party, some encounters designed for groups |
| Loot | Individual drops | Same individual system |
| Build freedom | Must be self-sufficient | Can specialize (tank / DPS / support) |
| Dungeons | All clearable solo | Easier and faster in groups |
| Best for | Learning mechanics, exploration | Dungeons, tough bosses, role synergy |

**Community consensus:** Solo is viable for all current Early Access content. Co-op makes dungeons significantly faster and more fun. The game is clearly designed with co-op in mind.

## Is Being in a Party Worth It?

Based on Reddit discussions (r/FareverGame):

- Grouping does **not** penalize individual loot or progression
- Group combat is more dynamic because of role specialization
- Some world events and heroic encounters are tuned for groups
- The social aspect adds replayability

The main downsides are coordination overhead and Early Access party-system friction.

## Known Co-op Issues (Early Access)

| Issue | Severity | Status |
|---|---|---|
| Steam invite system unreliable | High | Official Priority |
| Party member desync in dungeons | Medium | Community reported |
| Fast travel can disconnect party | Medium | Community reported |
| Connection and character syncing | High | Official Priority |
| Performance drops in group combat | Medium | Related to overall performance |

For step-by-step troubleshooting, see the [Co-op Troubleshooting Guide](/how-to-play-coop).

## Best Classes for Co-op

| Role | Best Class | Why |
|---|---|---|
| Tank / Front-line | Warrior | High survivability, Rage sustain |
| Healer / Support | Cleric | Party healing, shields, buffs — irreplaceable |
| Ranged DPS | Mage | Safe positioning, AoE damage |
| Burst DPS | Rogue | Highest single-target damage, mobile |

A well-balanced group typically wants at least one Cleric. See the [Best Class guide](/best-class) for detailed recommendations.

## Matchmaking and Group Finder

A formal **group finder / matchmaking system** is one of the most requested features in the community. Currently, you need to:

1. Use **in-game invites** (Social panel, P key)
2. Invite via **Steam Friends** (Shift+Tab overlay)
3. Find groups through Reddit, Discord, or Steam Discussions

There is no automatic matchmaking yet. Shiro Games has not confirmed a timeline for this feature.

## FAQ

**Can I play the entire game solo?**
Yes. The official Steam page confirms solo play is fully supported.

**Does the host's progress carry over for other players?**
Each player maintains their own progression independently.

**Can I join a friend who is a much higher level?**
Yes, but large level gaps may affect combat efficiency. The exact scaling formula is still being documented.

**Is there PvP?**
Not in the current Early Access version. PvP is on the official development roadmap.

**How many players are in the shared world?**
The open world is shared with other players on your server. Dungeons are instanced for your party only.

## What to Read Next

- [How to Play Co-op](/how-to-play-coop) — step-by-step party setup and troubleshooting
- [Best Class for Co-op](/best-class) — which class to pick for group play
- [Is Farever Worth It?](/worth-it) — full Early Access evaluation`,
  },
  {
    slug: "worth-it",
    keyword: "Farever worth it",
    title: "Is Farever Worth It? - Early Access Review, Player Data & Honest Evaluation",
    metaDescription:
      "Is Farever worth buying in Early Access? Honest evaluation with live player data, Steam review analysis, pros and cons, and a clear who-should-buy guide.",
    heading: "Is Farever Worth It?",
    intro:
      "An honest, data-backed evaluation of Farever in Early Access. Not a paid review — just facts, player sentiment, and a clear framework for whether you should buy now or wait.",
    content: `## Quick Verdict

**Buy now if** you enjoy co-op action RPGs, exploration-driven progression, and are comfortable with Early Access roughness. **Wait if** you need polished performance, a complete story, or solved endgame before investing time.

*This evaluation uses official Steam data, community reports, and site-tracked player data. It is not sponsored or paid.*

## The Numbers

| Metric | Value | Source |
|---|---|---|
| Steam Reviews | Mostly Positive | Steam Store (May 2026) |
| Peak Concurrent Players | 7,000+ | Official Shiro Games announcement |
| Early Access Duration | ~1 year planned | Shiro Games |
| Developer | Shiro Games (Northgard, Wartales) | Official |
| Current Content | 4 classes, 2 regions, 10 dungeons, level cap 20 | Steam EA description |
| Crafting Professions | 6 (Blacksmithing, Cooking, Alchemy, Jewelling, Outfitting, Enchanting) | Steam EA description |
| Co-op | Up to 4 players, playable solo | Steam Store |

## What Players Like

Based on Steam reviews and Reddit discussions during launch week:

### Combat Feels Good
The action combat with active dodging, weapon movesets, and skill timing has been widely praised. Multiple players compare it favorably to action RPGs rather than tab-target MMOs. The timed-block and dodge-roll system rewards skill.

### Exploration Has Real Depth
Siagarta features vertical exploration — climbing sheer cliffs, gliding across ravines, diving underwater, and discovering hidden areas. Players compare the exploration feel to a mix of Breath of the Wild and Guild Wars 2. The Codex system encourages discovering information organically.

### The Arsenal System Creates Build Variety
Equipping a secondary weapon and borrowing skills from it means builds are more varied than a standard class system. Players have called this "the hook" that keeps experimentation interesting. See the [Arsenal System guide](/arsenal-system) for details.

### The World Feels Handcrafted
Unlike many Early Access launches, Farever's open world has been praised for feeling intentional — environmental puzzles, platforming sections, and hidden secrets reward curiosity rather than checklist-clearing.

### Co-op Adds Real Value
When it works, the co-op is fun. Role specialization matters in group content, and individual loot means no fighting over drops. See [Co-op Explained](/coop-explained) for details.

## What Players Don't Like

### Performance Is Inconsistent
This is the **most common criticism**. Players report stuttering during combat, especially in group content. Timed blocks and dodges suffer when frames drop. Both client-side and server-side issues have been reported. See the [Performance Guide](/performance-guide) for current workarounds.

### No Traditional Main Quest
Farever deliberately avoids a guided main story. Instead, it uses exploration, regional checklists, and organic discovery. Some players find this refreshing; others feel directionless without clear objectives.

### Co-op Has Friction
Steam invites can be unreliable. Party syncing has issues. Fast travel can disconnect group members. Shiro Games has acknowledged these as official priorities.

### Content Is Limited (For Now)
With 2 regions and a level cap of 20, dedicated players may reach the current content ceiling within the first week. This is expected for Early Access, but worth knowing before buying.

### In-Game Tutorials Are Sparse
Many core systems — Arsenal unlocking, storage, salvage, fast travel, free mounts — are not well-explained in-game. Community guides fill this gap, which is why sites like this one exist.

## Who Should Buy Now

| If you... | Verdict |
|---|---|
| Enjoy co-op ARPGs (Diablo, Monster Hunter, Lost Ark) | ✅ Buy now |
| Like exploration-driven games (BotW, GW2) | ✅ Buy now |
| Want to experiment with class + weapon builds | ✅ Buy now |
| Are comfortable with Early Access roughness | ✅ Buy now |
| Trust Shiro Games (Northgard, Wartales track record) | ✅ Buy now |
| Need smooth 60fps at all times | ⏳ Wait for optimization patches |
| Want a complete story or main quest | ⏳ Wait for 1.0 |
| Need polished co-op with zero bugs | ⏳ Wait for patches |
| Want endgame content (PvP, guilds, raids) | ⏳ Wait — on the roadmap, not in EA yet |
| Only play on console | ❌ Not available — PC Steam only |

## What Is on the Roadmap

Shiro Games has outlined planned additions during the ~1 year Early Access period:

| Planned Feature | Category | Status |
|---|---|---|
| New classes (Druid, Monk) | Character | Confirmed on roadmap |
| More regions and biomes | World | Confirmed |
| More dungeons | PvE | Confirmed |
| Guild system | Social | Confirmed |
| Auction house | Economy | Confirmed |
| Faction reputation system | Progression | Confirmed |
| PvP content | Competitive | Confirmed on roadmap |
| Talent tree expansion | Character | Confirmed |
| Challenge dungeon modes | PvE | Confirmed |

*Specific release dates for individual features have not been announced.*

## Developer Track Record

Shiro Games has shipped two well-received games:

- **Northgard** — Real-time strategy game with strong community support and regular updates post-launch
- **Wartales** — Tactical mercenary RPG that went through a successful Early Access cycle with consistent content delivery

This gives reasonable confidence that Farever will receive sustained development during its EA period.

## How Farever Compares

Players frequently compare Farever to these games:

| Compared To | Similar In | Different In |
|---|---|---|
| Guild Wars 2 | Exploration focus, event-driven open world | GW2 is a full MMO; Farever is co-op ARPG |
| Elder Scrolls Online | Open world, crafting, dungeons | ESO has main story; Farever does not |
| Breath of the Wild | Vertical exploration, climbing, gliding | BotW is single-player; Farever is online |
| Diablo / Lost Ark | Loot, builds, dungeon-crawling | Farever emphasizes exploration over loot grinding |
| Monster Hunter | Co-op boss fights, weapon mastery | MH has hunt-based structure; Farever is open world |

Farever occupies a niche between full MMOs and action RPGs — think "co-op exploration ARPG."

## FAQ

**Will the price increase after Early Access?**
Not confirmed. Many EA games increase price at 1.0, but Shiro Games has not announced pricing plans.

**Is there a free trial?**
No free trial. Farever is a paid Early Access game on Steam. Steam's refund policy (under 2 hours of play) applies.

**How long is the current content?**
Estimates vary. Completionists report 20-40 hours to explore both regions thoroughly. Speedrunners may finish faster.

**Is it pay-to-win?**
No. The in-game Shop contains free items (mount, companion) and cosmetics. No pay-to-win mechanics have been reported.

**When will 1.0 launch?**
Shiro Games estimates approximately one year of Early Access, targeting a 2027 release.

## What to Read Next

- [Beginner Guide](/beginner-guide) — if you decide to buy, start here
- [Best Class](/best-class) — choose your first character
- [Co-op Explained](/coop-explained) — understand multiplayer before grouping up
- [Performance Guide](/performance-guide) — optimize your experience`,
  },
  {
    slug: "performance-guide",
    keyword: "Farever performance",
    title: "Farever Performance Guide - Fix Stuttering, Optimize Settings & System Requirements",
    metaDescription:
      "Fix Farever stuttering and lag: recommended settings, system requirements, known performance issues, and community workarounds for Early Access optimization.",
    heading: "Farever Performance Guide",
    intro:
      "How to fix stuttering, optimize graphics settings, and get the best performance in Farever Early Access. Includes official system requirements and community-tested workarounds.",
    content: `## Quick Answer

Farever has **known performance issues** during Early Access launch. Stuttering during combat is the most common complaint, affecting timed blocks and dodges. The recommended specs call for a **RTX 4060 / RX 7600 and 32 GB RAM** for 1080p at 60fps. Below are the settings and workarounds that players have found most effective.

*Source: Steam system requirements (official), Reddit and Steam community reports (community-tested).*

## System Requirements

### Minimum (1080p @ 30fps)

| Component | Requirement |
|---|---|
| OS | Windows 10 64-bit |
| CPU | Intel i7 6700K or AMD Ryzen 5 5500 |
| RAM | 16 GB |
| GPU | GeForce RTX 3060 or AMD Radeon RX 5600 XT |
| Storage | 25 GB available space |

### Recommended (1080p @ 60fps)

| Component | Requirement |
|---|---|
| OS | Windows 10 64-bit |
| CPU | Intel i5 11400T or AMD Ryzen 5 3600X |
| RAM | 32 GB |
| GPU | GeForce RTX 4060 or AMD Radeon RX 7600 |
| Storage | 25 GB available space (SSD recommended) |

> **Note:** The recommended specs ask for **32 GB RAM**, which is above average for this genre. Players with 16 GB may experience more frequent stuttering, especially in group combat. — *Source: Official Steam store page*

## Known Performance Issues

| Issue | Frequency | Impact | Status |
|---|---|---|---|
| Combat stuttering | Very common | Timed blocks and dodges become unreliable | Officially acknowledged |
| Frame drops in group content | Common | Worse with 3-4 players | Under investigation |
| Server-side latency spikes | Intermittent | Affects all players on the server | Official priority |
| Long dungeon loading times | Moderate | Worse on HDD; SSD helps significantly | Community reported |
| Texture pop-in during traversal | Moderate | Noticeable during fast movement / gliding | Community reported |
| Memory usage creep | Occasional | Performance degrades during long sessions | Community reported |

*Last reviewed: May 8, 2026 (Early Access launch week).*

## Recommended Settings for Best Performance

These settings are based on community testing. Your results may vary depending on hardware.

| Setting | Performance Priority | Quality Priority |
|---|---|---|
| Resolution | 1080p | 1440p (if GPU allows) |
| V-Sync | Off (use driver-level frame cap) | Off |
| Shadow Quality | Medium | High |
| Anti-Aliasing | TAA or FXAA | TAA |
| View Distance | Medium | High |
| Foliage Quality | Low–Medium | Medium–High |
| Post-Processing | Low | Medium |
| Particle Effects | Medium | High |
| Texture Quality | High (if VRAM allows) | High |
| Frame Rate Cap | Match your monitor refresh rate | Uncapped or monitor refresh |

> **Tip:** Lowering Foliage Quality and Post-Processing typically gives the biggest FPS improvement with the least visual impact. Shadow Quality is the next most impactful setting.

## Community Workarounds

These are player-discovered fixes, **not** official solutions. They may help but are not guaranteed:

### Workaround 1: Restart the Game Every 2-3 Hours
Multiple players report that performance degrades during long sessions. A fresh restart can restore smoother framerates. This suggests a possible memory leak.

### Workaround 2: Use an SSD
Players on HDDs report significantly longer load times and more texture pop-in. Moving the game to an SSD improves load times and can reduce in-game stuttering.

### Workaround 3: Limit Frame Rate
Rather than V-Sync, use your GPU driver's frame limiter (NVIDIA Control Panel or AMD Radeon Software) to cap frames 2-3 below your monitor's refresh rate. This reduces frame time variance.

### Workaround 4: Update GPU Drivers
Ensure your GPU drivers are current. New game launches often receive driver-level optimizations in the weeks following release.

### Workaround 5: Close Background Applications
Farever's 32 GB RAM recommendation suggests the game is memory-hungry. Close browsers, Discord overlays, and other memory-heavy applications if you have 16 GB RAM.

### Workaround 6: Reduce Party Size for Dungeon Runs
If group content causes severe stuttering, try running dungeons in pairs (2-player) rather than full 4-player parties until performance patches arrive.

## Official vs Community Fixes

| Fix Type | Status | Reliability |
|---|---|---|
| Official optimizations | Expected in upcoming patches | Shiro Games has acknowledged performance as a priority |
| Settings adjustments | Community-tested | Varies by hardware — generally effective |
| Restart workaround | Community-tested | Widely reported as helpful |
| SSD migration | Community-tested | Consistently effective for load times |
| Driver updates | Standard best practice | May or may not include game-specific optimizations |

## Performance Impact on Gameplay

Performance is not just about visual smoothness — in Farever it directly affects combat:

- **Timed blocks** require frame-precise input. Stuttering can cause missed blocks.
- **Dodge i-frames** depend on consistent frame timing. Frame drops can make dodge rolls unreliable.
- **Boss patterns** are harder to read when animations stutter.
- **Co-op healing** timing (Cleric) can be thrown off by latency combined with frame issues.

This is why performance optimization matters more in Farever than in many RPGs.

## What Shiro Games Has Said

In their Early Access launch notes, Shiro Games listed the following as official priorities:

- Performance, server stability, and latency improvements
- Connection and character syncing issues
- Steam invite path improvements
- Gamepad controls and missing bindings

No specific timeline for performance patches has been given, but these are listed as active development priorities.

## FAQ

**Why does Farever need 32 GB RAM?**
The official recommended specs list 32 GB. The open world, multiple players, and detailed assets likely contribute to higher memory usage. Players with 16 GB can run the game but may experience more frequent stuttering.

**Will performance improve during Early Access?**
Very likely. Shiro Games has explicitly listed performance as an official priority. Their track record with Northgard and Wartales shows consistent post-launch optimization.

**Is Farever playable on a laptop?**
If your laptop meets the minimum specs (RTX 3060 mobile equivalent, 16 GB RAM), yes. Expect to play at lower settings. Battery mode will significantly reduce performance.

**Does lowering resolution help?**
Yes. Dropping from 1440p to 1080p provides a significant FPS boost, especially on mid-range GPUs.

**Is there a benchmark or FPS counter?**
Use Steam's built-in FPS counter (Settings > In-Game > FPS Counter) or third-party tools like MSI Afterburner to monitor performance.

## What to Read Next

- [Is Farever Worth It?](/worth-it) — full evaluation including performance considerations
- [Beginner Guide](/beginner-guide) — starting priorities for new players
- [Patch Notes](/patch-notes) — track performance fixes as they ship`,
  },
];

export function getGuidePage(slug: string) {
  return guidePages.find((guide) => guide.slug === slug) || null;
}
