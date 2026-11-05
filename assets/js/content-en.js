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
        ["Result", "Three companies integrated and all evidence of every load organized in SharePoint for future audits. Today I own the Migration Cockpit loads."]
      ],
      chips: ["SAP S/4HANA", "Migration Cockpit", "LTMC / LTMOM", "Master data", "QA → Production", "Audit-ready documentation"]
    },
    {
      id: "comex", side: "Foreign Trade incidents", tag: "Molinos · Foreign Trade",
      title: "Finding the logic failure that blocks a Foreign Trade process",
      lead: "I spend the rest of my time on Foreign Trade, from the purchase order to invoicing. Some incidents are fixed on the spot; others require going into the ABAP code to find where the process logic breaks. I also lead the weekly incident meeting with the external consulting firm that supports the Foreign Trade system.",
      flowTitle: "Where the incidents appeared",
      flow: [["Purchase order", "ME23N"], ["Customs file", "Authorizations"], ["Import invoice", "Also created via API", [1, 3]], ["Posting", "FB03 · G/L accounts", [2]], ["Supplier portal", "Invoicing status", [4]]],
      txTitle: "Transactions by type of problem",
      tx: [["Purchasing", "ME23N", "Review the purchase order"], ["Accounting", "FB03", "Check the accounting document and its accounts"], ["Materials & batches", "MM03 · BMBC", "Look up the material and fix batches"], ["HR", "PA30", "Fix bank details"], ["Data", "SE16N", "Query tables directly"], ["Logs", "SLG1", "Read the application log"], ["Code", "SE38 · SE37 · SE24", "Debug programs, function modules and classes"]],
      incidents: [
        { title: "Credit memos with an alternative payee", problem: "Import credit memos failed when they had an alternative payee.", cause: "Debugging the import invoice object, I found that the flow took the wrong path in that case.", fix: "Fixed the flow for credit memos with an alternative payee." },
        { title: "Compound taxes posted to a single account", problem: "With compound taxes, such as VAT plus gross income tax, the full amount was posted to the VAT account.", cause: "The tax split was not being applied at posting time.", fix: "Using a standard SAP function, I split the tax so each part posts to its own G/L account." },
        { title: "Units of measure in invoices created via API", problem: "Invoices created from the Foreign Trade system through the API failed on units of measure.", cause: "SAP converts units between its internal code and the displayed name, and the integration was sending the wrong value.", fix: "By analyzing the ABAP code we fixed the unit conversion." },
        { title: "Supplier portal and tolerances", problem: "When an invoice fell within the lower tolerance, the portal showed as invoiced something that had not been invoiced.", cause: "The way invoicing data was calculated and displayed.", fix: "I helped with the analysis and we solved it by changing how the data was displayed." }
      ],
      steps: [
        ["Scope", "Understand which step of the business process is not being met and in which document the problem appears."],
        ["Diagnose", "Pick the transaction based on the problem (see the table) and, when the failure is in the logic, debug the ABAP code until I find where it breaks."],
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
      chips: ["Python", "OAuth 2.0", "YouTube Data API", "Instagram Graph API", "Linux · nginx"]
    },
    {
      id: "passport", side: "PassportPlanner", tag: "Published app",
      title: "A stable app in real use",
      lead: "Mobile app to plan and log shared activities: invite-based passports, photo stamps, collaborative rankings and a wheel that picks the next plan.",
      flowTitle: "Architecture",
      flow: [["App", "React Native · Expo · iOS, Android and web"], ["Supabase", "Auth · PostgreSQL · Storage"], ["Edge Function", "Account deletion"], ["GitHub Actions", "Web deploy and scheduled job"], ["passport.lukychill.com", "Installable version (PWA)"]],
      steps: [
        ["Problem", "In daily use, passports \"disappeared\", photos took long to upload and the free database paused itself after 7 days without activity."],
        ["Diagnosis", "Sessions expired when returning to the app, photo uploads were not optimized and Supabase pauses inactive projects."],
        ["Solution", "Session refresh on resume, fixed photo uploads and a scheduled GitHub Actions job that keeps the database active."],
        ["Result", "A stable app, with an installable iPhone web version published at passport.lukychill.com."]
      ],
      chips: ["React Native", "Expo", "TypeScript", "Supabase", "GitHub Actions"],
      links: [["Open the app", "https://passport.lukychill.com"], ["Code", "https://github.com/LukychillGitHub/PassportPlanner"]]
    },
    {
      id: "costaflow", side: "CostaFlow", tag: "Personal project",
      title: "Getting a full-stack platform that would not start to run",
      lead: "CostaFlow connects tourism businesses on the Argentine Atlantic Coast with hotels and receptionists. The app compiled, but failed at runtime.",
      steps: [
        ["Problem", "Errors when loading protected pages and test data that would not insert."],
        ["Diagnosis", "Three separate causes: cookies() calls without await, middleware routes that did not match the project's routes and misspelled column names in the seed."],
        ["Solution", "Fix each cause separately and verify the full login and data loading flow."],
        ["Result", "The platform works end to end on Next.js 14 and Supabase."]
      ],
      chips: ["Next.js 14", "TypeScript", "Tailwind", "Supabase"]
    },
    {
      id: "archivo", side: "Archive", tag: "First projects",
      title: "Where I started programming",
      lead: "Small projects to practice logic, the DOM and interface design.",
      archive: [
        ["Website for a Math tutor", "Class scheduling + WhatsApp bot", "https://paginaweb-matematica-production.up.railway.app"],
        ["Fizzbuzz Minigame", "Logic + animations", "https://lukychillgithub.github.io/FizzbuzzGame/"],
        ["SillyUI", "Absurd UX for April Fools", "https://lukychillgithub.github.io/SillyUI/"],
        ["Pomodoro App", "Focus timer", "https://lukychillgithub.github.io/Pomodoro/"],
        ["Progress bar", "Animated component", "https://lukychillgithub.github.io/ProgressBar/"]
      ]
    }
  ],

  jobs: [
    {
      when: ["Feb 2026", "Present"], now: true, role: "Technology Analyst", org: "Molinos Río de la Plata", place: "Staff team · Systems (FI)",
      text: "Data migration of acquired companies into SAP S/4HANA and Foreign Trade incidents, on a three-analyst team specialized in the FI module.",
      bullets: [
        "Own the SAP Migration Cockpit loads for the integration of Bodegas Etchart, NotCo and Complejo Alimenticio San Salvador: customers, vendors, materials, stock, batches and production versions. Next: Grupo Ayudín.",
        "Full cycle of every migration: templates, data cleansing, QA tests, production load, business validation and SharePoint documentation for audits.",
        "Lead the weekly Foreign Trade incident meeting with the external consulting firm: the team reports to me and I track each case until it is closed.",
        "End-to-end diagnosis of Foreign Trade incidents, from purchase order to invoicing, debugging ABAP code to find logic failures.",
        "Functional specifications, transport requests, change requirements gathering and Business Partner creation.",
        "Coordination with Foreign Trade, master data, IT Logistics (EWM) and development."
      ],
      tools: ["SAP S/4HANA", "FI module", "Migration Cockpit", "LTMC / LTMOM", "ABAP debugging", "SE16N", "ME23N", "FB03", "MM03", "BMBC", "PA30", "SLG1", "Service Manager", "Transport requests"],
      actions: [{ label: "Migration case", open: "cases", arg: "migraciones" }, { label: "Foreign Trade incidents", open: "cases", arg: "comex" }]
    },
    {
      when: ["Aug 2023", "Jan 2026"], role: "Computer Science Teacher", org: "Colegio Secundario Carlos Maschwitz",
      text: "Taught computer science in high school, from office tools to logic and hardware.",
      bullets: [
        "Office classes (Word, Excel and PowerPoint) focused on practical cases.",
        "Taught flowcharts, logic gates and the fundamentals of how a computer works.",
        "Class planning and follow-up of student assignments.",
        "Encouraged teamwork, communication and responsibility with deadlines."
      ],
      tools: ["Excel", "Word", "PowerPoint", "Digital logic", "Flowcharts", "Communication"]
    },
    {
      when: ["Mar 2022", "Nov 2022"], role: "Internal Quality Intern", org: "Ford Argentina", place: "PUMA engines",
      text: "Support for the engine plant quality team, focused on continuous improvement.",
      bullets: [
        "Designed and built 3D-printed fixtures to optimize production line processes.",
        "Identified and solved technical issues with the quality team.",
        "Managed and updated Excel spreadsheets to improve data traceability.",
        "Worked in a demanding industrial environment with automotive quality standards."
      ],
      tools: ["3D printing", "Excel", "Continuous improvement", "Automotive quality"]
    },
    {
      when: ["Mar 2020", "Present"], role: "Content Creator", org: "Lukychill", place: "Personal brand",
      text: "Rocket League gaming community on TikTok, YouTube, Instagram, Twitch and Kick.",
      bullets: [
        "Production and editing of Rocket League content (Grand Champion rank).",
        "390K+ followers and 10M likes on TikTok.",
        "Metrics and trend analysis to drive organic growth strategy.",
        "Brand collaborations in the gaming industry, including Repeat.gg and Aoeah."
      ],
      tools: ["Metrics analysis", "CapCut", "Photoshop", "OBS", "Content strategy"],
      actions: [{ label: "Log in as Lukychill", switchTo: "luky" }]
    }
  ],

  skills: [
    ["SAP & business", ["SAP S/4HANA", "FI module", "Migration Cockpit", "LTMC / LTMOM", "Master data", "ABAP debugging", "Foreign Trade", "Functional analysis", "Transport requests"]],
    ["SAP transactions", ["SE16N", "SE38", "SE37", "SE24", "ME23N", "FB03", "MM03", "BMBC", "PA30", "SLG1"]],
    ["Development", ["Python", "TypeScript", "JavaScript", "React Native", "Next.js", "Node.js", "Supabase", "PostgreSQL", "MySQL", "REST APIs", "OAuth 2.0"]],
    ["Infrastructure", ["Linux", "systemd", "nginx", "HTTPS", "GitHub Actions", "Git"]],
    ["People", ["Meeting leadership", "Documentation", "Teaching", "Business communication"]]
  ],

  collabs: [
    { name: "Repeat.gg", what: "Esports tournament platform", tag: "Gaming" },
    { name: "Aoeah", what: "Rocket League item marketplace", tag: "Rocket League" }
  ],

  roadmap: [
    { when: "2020 – 2024", title: "Short-form Rocket League", text: "Clips and challenges on TikTok and Shorts. The stage that built the community.", state: "done" },
    { when: "Streams", title: "Live on Kick and Twitch", text: "Live gameplay with the community.", state: "done" },
    { when: "Next", title: "Vlog with a gamer soul", text: "Day to day: the office, university, the setup and the matches. The same person behind both users of this system.", state: "cur" }
  ]
};
