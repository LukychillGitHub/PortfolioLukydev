/* English content. Same structure as content.js: only the texts change. */
window.LUKY_EN = {
  study: { done: 22, total: 49, gpa: "9.23", since: 2024 },

  cases: [
    {
      id: "migraciones", side: "SAP migrations", tag: "Molinos · Systems staff team (FI)",
      title: "Bringing the companies Molinos acquires into SAP S/4HANA",
      lead: "When Molinos buys a company, its data has to enter SAP without stopping operations. I own the SAP Migration Cockpit loads: I build the templates, cleanse the data, load first into the QA environment and then into production, and validate everything with the business.",
      timeline: [
        { name: "Bodegas Etchart", state: "Migrated" },
        { name: "NotCo", state: "Migrated" },
        { name: "Complejo Alimenticio San Salvador", state: "Migrated" },
        { name: "Grupo Ayudín", state: "Next", next: true }
      ],
      flowTitle: "How a migration works",
      flow: [["Source data", "Extracted from the acquired company"], ["Templates", "Built in LTMOM"], ["Cleansing", "Formats, decimals, duplicates"], ["QA", "Test loads and errors"], ["Validation", "With the data owner"], ["Production", "Final load"], ["Audit", "Evidence in SharePoint"]],
      objects: ["Customers", "Vendors", "Materials", "Finished goods", "Raw materials", "Supplies", "Stock", "Batches", "Production versions"],
      steps: [
        ["Problem", "Each company brings data with a different structure and different loading criteria, and each migration is more demanding: Etchart was the first, while I was still learning the tool, and Complejo Alimenticio San Salvador meant a much larger data volume."],
        ["Diagnosis", "Migration Cockpit errors usually come from a closed posting period, badly formatted decimals or data entered incorrectly at the source. In the latest migration, batches had been loaded the wrong way."],
        ["Solution", "Cleansing and normalizing the data, fixing each error with the team that owns it (master data, IT Logistics for EWM, development) and new QA test loads before moving to production."],
        ["Result", "Three companies integrated and all evidence of every load organized in SharePoint for future audits."]
      ],
      chips: ["SAP S/4HANA", "Migration Cockpit", "LTMC / LTMOM", "Master data", "QA → Production", "Audit-ready documentation"]
    },
    {
      id: "comex", side: "Foreign Trade incidents", tag: "Molinos · Foreign Trade",
      title: "Finding the logic failure that blocks a Foreign Trade process",
      lead: "Alongside migrations, I handle Foreign Trade incidents, from the purchase order to invoicing. Some incidents are fixed on the spot; others require going into the ABAP code to find where the process logic breaks.",
      flowTitle: "Where the incidents appeared",
      flow: [["Purchase order", "Start of the cycle"], ["Customs file", "Authorizations"], ["Import invoice", "Also created via API", [1, 3]], ["Posting", "Impact on G/L accounts", [2]], ["Supplier portal", "Invoicing status", [4]]],
      incidents: [
        { title: "Credit memos with an alternative payee", problem: "Import credit memos failed when they had an alternative payee.", cause: "Debugging the import invoice object, I found that the flow took the wrong path in that case.", fix: "Fixed the flow for credit memos with an alternative payee." },
        { title: "Compound taxes posted to a single account", problem: "With compound taxes, such as VAT plus gross income tax, the full amount was posted to the VAT account.", cause: "The tax split was not being applied at posting time.", fix: "Using a standard SAP function, I split the tax so each part posts to its own G/L account." },
        { title: "Units of measure in invoices created via API", problem: "Invoices created from the Foreign Trade system through the API failed on units of measure.", cause: "SAP converts units between its internal code and the displayed name, and the integration was sending the wrong value.", fix: "By analyzing the ABAP code we fixed the unit conversion." },
        { title: "Supplier portal and tolerances", problem: "When an invoice fell within the lower tolerance, the portal showed as invoiced something that had not been invoiced.", cause: "The way invoicing data was calculated and displayed.", fix: "I helped with the analysis and we solved it by changing how the data was displayed." }
      ],
      steps: [
        ["Scope", "Understand which step of the business process is not being met and in which document the problem appears."],
        ["Diagnose", "Review the documents and data involved in SAP and, when the failure is in the logic, debug the ABAP code until I find where it breaks."],
        ["Fix", "Apply or coordinate the fix with a functional specification and a transport request, test it in QA and validate it with the user."],
        ["Follow up", "In the weekly meeting the team reports incidents to me and I track each one until it is closed."]
      ],
      chips: ["ABAP debugging", "Service Manager", "G/L accounts", "Transport requests", "Functional specifications"]
    },
    {
      id: "bot", side: "Video bot", tag: "Personal project · in production",
      title: "Publishing a video on three networks with a single link",
      lead: "Republishing every video by hand on each platform is repetitive. I built a Telegram bot in Python: I send it a TikTok link and it stores the video in Google Drive, uploads it as a YouTube Short and as an Instagram trial Reel.",
      flowTitle: "Architecture",
      flow: [["TikTok link", "Sent via Telegram"], ["Bot on the VPS", "Python · systemd · authorized user"], ["HD download", "External service, no watermark"], ["Publishing", "Google Drive · YouTube Short · Instagram Reel"], ["Result", "Telegram reply per platform"]],
      steps: [
        ["Problem", "The bot worked on my PC, but on the server TikTok returned the page without the video data."],
        ["Diagnosis", "I ruled out version, cookies and browser impersonation. Inspecting the HTML, I saw that TikTok omits the video block for datacenter IPs."],
        ["Solution", "I replaced the extraction strategy with an external service. I also solved Google OAuth scopes that could not be requested together, tokens expiring every 7 days and four chained errors in Instagram authentication."],
        ["Result", "It runs 24/7 on a Linux VPS with systemd, nginx, HTTPS and a non-privileged user. If one platform fails, the others still publish."]
      ],
      gallery: [["assets/img/projects/bot-telegram.webp", "The bot on Telegram: I send the TikTok link and it replies with the Drive file, the YouTube Short and the published Reel.", "wide"]],
      chips: ["Python", "OAuth 2.0", "YouTube Data API", "Instagram Graph API", "Linux · nginx"]
    },
    {
      id: "passport", side: "PassportPlanner", tag: "Published app",
      title: "A stable app in real use",
      lead: "Mobile app to plan and log shared activities: invite-based passports, photo stamps, collaborative rankings and a wheel that picks the next plan.",
      flowTitle: "Architecture",
      flow: [["App", "React Native · Expo · iOS, Android and web"], ["Supabase", "Auth · PostgreSQL · Storage"], ["Edge Function", "Account deletion"], ["GitHub Actions", "Web deploy and scheduled job"], ["Web version", "Installable on iPhone (PWA)"]],
      steps: [
        ["Problem", "In daily use, passports \"disappeared\", photos took long to upload and the free database paused itself after 7 days without activity."],
        ["Diagnosis", "Sessions expired when returning to the app, photo uploads were not optimized and Supabase pauses inactive projects."],
        ["Solution", "Session refresh on resume, fixed photo uploads and a scheduled GitHub Actions job that keeps the database active."],
        ["Result", "A stable app, with an installable iPhone web version published on GitHub Pages."]
      ],
      gallery: [["assets/img/projects/passport-pasaporte.webp", "Passport: each activity stamped with photos, stars and a review"], ["assets/img/projects/passport-ruleta.webp", "Wheel that picks the next plan"], ["assets/img/projects/passport-tops.webp", "Tops: shared rankings by category"], ["assets/img/projects/passport-cuenta.webp", "Each member's profile"]],
      chips: ["React Native", "Expo", "TypeScript", "Supabase", "GitHub Actions"],
      links: [["Open the app", "https://lukychillgithub.github.io/PassportPlanner/"], ["Code", "https://github.com/LukychillGitHub/PassportPlanner"]]
    }
  ],

  journey: {
    title: "From the production line to SAP",
    lead: "I didn't get into systems in a straight line. Every stage left me something I use every day at Molinos.",
    chapter: "Chapter", take: "What I took away", more: "See details", now: "Now",
    next: { title: "What's next", text: "Become an SAP Functional Consultant: learn other modules, go deeper into systems analysis and keep automating, while I finish my Computer Engineering degree." }
  },

  jobs: [
    {
      milestone: true, when: ["2015", "2022"], role: "Electromechanical Technician", org: "Escuela Técnica Henry Ford",
      text: "Seven years of workshop, electrical and mechanical work. That's where I first got into programming, through robotics, which is why I chose Computer Engineering."
    },
    {
      key: "ford", step: "Ford", chapter: "First step into industry",
      when: ["Mar 2022", "Nov 2022"], role: "Quality Intern", org: "Ford Argentina", place: "PUMA engines",
      text: "My first job: an internship on the internal Quality team at the PUMA engine plant, working to automotive quality standards.",
      take: "A small problem on the line affects the whole process, and well-organized data is worth as much as the fix.",
      bullets: [
        "Designed and built 3D-printed fixtures to optimize production line processes.",
        "Identified and solved technical problems with the quality team.",
        "Managed and updated Excel sheets to improve data traceability."
      ],
      tools: ["3D printing", "Excel", "Continuous improvement", "Automotive quality"]
    },
    {
      key: "luky", step: "Lukychill", chapter: "Building something of my own",
      when: ["Mar 2020", "Present"], role: "Content Creator", org: "Lukychill", place: "Personal brand",
      text: "Lukychill started in 2020 as a Rocket League channel and is now a community of 550,000+ followers across TikTok, YouTube, Twitch and Instagram. I run it end to end, on my own.",
      take: "Consistency to keep a project going for years, reading metrics to make decisions, and communicating so people understand and stay.",
      bullets: [
        "End-to-end production: concept, script, on-camera work, editing and live streaming.",
        "Reach and engagement analysis to refine formats and sustain organic growth.",
        "Collaborations with gaming brands."
      ],
      tools: ["Metrics analysis", "Camera", "CapCut", "Photoshop", "OBS", "Content strategy"],
      actions: [{ label: "Enter as Lukychill", switchTo: "luky" }]
    },
    {
      key: "docente", step: "Teaching", chapter: "Learning to explain",
      when: ["Aug 2023", "Jan 2026"], role: "Computer Science Teacher", org: "Colegio Secundario Carlos Maschwitz",
      text: "I taught computer science at a high school, in charge of planning and follow-up for each class.",
      take: "Translating technical concepts into plain language and adapting them to whoever is listening. I use it every time I talk to a business user.",
      bullets: [
        "Office classes (Word, Excel and PowerPoint) built around practical cases.",
        "Taught flowcharts, logic gates and how a computer works."
      ],
      tools: ["Excel", "Word", "PowerPoint", "Digital logic", "Flowcharts", "Communication"]
    },
    {
      milestone: true, when: ["2024", ""], role: "B.S. in Computer Engineering", org: "Universidad del Salvador",
      text: "I start my degree while working.",
      open: "edu"
    },
    {
      key: "molinos", step: "Molinos", chapter: "Technology Analyst",
      when: ["Feb 2026", "Present"], now: true, role: "Technology Analyst", org: "Molinos Río de la Plata", place: "Systems · FI Staff",
      text: "I joined the Systems area, on the Staff team specialized in the SAP S/4HANA FI module: three analysts and our manager. I work with business users, master data, logistics, development and external consultants.",
      take: "How change is managed in a large company, and what it means that a system I work on is used by the whole business.",
      bullets: [
        "Analyze and resolve incidents in accounting (FI) and Foreign Trade processes down to the root cause, debugging ABAP when the failure is in the logic.",
        "Own the SAP Migration Cockpit loads for integrating the companies Molinos acquires.",
        "Functional specifications, transport requests and Business Partner creation.",
        "Lead the weekly incident meeting with the external consulting firm, a challenge I took on by my own initiative."
      ],
      actions: [{ label: "See migrations case", open: "cases", arg: "migraciones" }, { label: "See resolved incidents", open: "cases", arg: "comex" }]
    }
  ],

  skills: [
    ["SAP & business", ["SAP S/4HANA", "FI module", "Migration Cockpit", "LTMC / LTMOM", "Master data", "ABAP debugging", "Foreign Trade", "Functional analysis", "Transport requests"]],
    ["SAP transactions", ["SE16N", "SE38", "SE37", "SE24", "ME23N", "FB03", "MM03", "BMBC", "PA30", "SLG1"]],
    ["Development", ["Python", "TypeScript", "JavaScript", "React Native", "Next.js", "Node.js", "Supabase", "PostgreSQL", "MySQL", "REST APIs", "OAuth 2.0"]],
    ["Infrastructure", ["Linux", "systemd", "nginx", "HTTPS", "GitHub Actions", "Git"]]
  ],


  story: [
    { cat: "tipos", when: "Dec 2020", title: "Player types", sub: "The channel's first format",
      text: "I started by portraying the player types you meet in any Rocket League match, and brought in my brother as my duo partner. Community humor in short form: the base for everything that came after.",
      videos: ["6908569921119128838", "6906222928715697414", "6930681882623446277"] },
    { cat: "historias", when: "Jul 2021", title: "Reddit stories", sub: "The most viral format",
      text: "I narrated Reddit stories while playing. It was the format that blew up the most: \"El niño en peligro\" reached 5.9M views and is the channel's most watched video.",
      videos: ["6984235506779393286", "7095803050765339909", "6984917707757980934", "7075085373012970757"] },
    { cat: "record", when: "Oct 2021", title: "Record: 10 stacked Mercs", sub: "The channel's milestone",
      text: "I stacked 10 Mercs on top of each other and turned it into a record. The video passed 1.7M views and became a channel landmark, with several recaps afterwards.",
      videos: ["7017881807240629510", "7017896957716892933"] },
    { cat: "mecanicas", when: "Dec 2022", title: "Mechanics in 3 steps", sub: "Teaching people to play better",
      text: "Short tutorials: one mechanic explained in 3 steps so anyone can learn it, from flying for the first time to air dribbling and wall dashing.",
      videos: ["7269811856385051909", "7179288781852282118", "7271411749981539590", "7180845716753943814"] },
    { cat: "mapas", when: "Jul 2023", title: "Custom maps", sub: "Fall Guys, Minecraft and challenges",
      text: "Community maps brought into Rocket League, like Fall Guys or Minecraft, and challenges made to tag that friend. Today they are a playlist of 40+ posts on TikTok.",
      videos: ["7259136265554087173", "7447346377752923397", "7449161364343393542", "7255324202746563845"] },
    { cat: "hermano", when: "2025", title: "Duels against my brother", sub: "The same old rivalry",
      text: "The duo from the early days is back, now as rivals: one-on-one matches with my brother and a series of duels of its own.",
      videos: ["7529609287245647160", "7532172259524349190"] },
    { cat: "streams", when: "Live", title: "Streams on Twitch and Kick", sub: "Gameplay with the community",
      text: "Rocket League streams to play and chat with the community. The Twitch channel already has 47K+ followers.",
      metric: ["47K+", "on Twitch"], link: ["Watch on Twitch", "https://www.twitch.tv/lukychill"] },
    { cat: "next", state: "next", when: "Next", title: "Vlog with a gamer soul", sub: "What's next",
      text: "Day to day: the office, university, the setup and the matches. The same person behind both users of this system." }
  ]
};
