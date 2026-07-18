/* ============ CONTENT DATA (grounded in 9569 syllabus) ============ */
const MODULES = [
/* ---------- MODULE 1: CODE OF ETHICS ---------- */
{
  id:"ethics", num:"1", title:"Code of Ethics of a Computing Professional",
  lo:"LO 3.4.1: Understand the code of ethics (conduct) of a Computing professional.",
  learn:`
    <p>A <strong>code of ethics</strong> (or code of conduct) is a set of guiding principles that tells a computing professional how to behave responsibly. Because software now controls money, health records, transport and safety systems, the public has to <strong>trust</strong> the people who build it. Professional bodies such as the ACM, IEEE and the Singapore Computer Society publish codes so that trust is earned, not assumed.</p>
    <div class="key"><b>Core idea:</b> A computing professional has power that ordinary users do not. Ethics is about using that power for the benefit of the public, not just the employer or yourself.</div>
    <p>The most commonly examined principles are:</p>
    <ul>
      <li><strong>Public interest first</strong>: hold the health, safety and welfare of the public above personal or company gain.</li>
      <li><strong>Competence</strong>: only take on work you are qualified for, and keep your skills up to date.</li>
      <li><strong>Integrity &amp; honesty</strong>: do not deceive, do not misrepresent your systems, and disclose conflicts of interest.</li>
      <li><strong>Confidentiality</strong>: protect information entrusted to you (client data, trade secrets, personal data).</li>
      <li><strong>Respect for privacy &amp; property</strong>: do not access, copy or use data or software you have no right to.</li>
      <li><strong>Professional responsibility</strong>: give credit, accept honest criticism, and report unethical behaviour.</li>
    </ul>`,
  expanders:[
    {t:"Why not just follow the law?", b:"The law sets the <em>minimum</em>. Many harmful acts (writing addictive dark-pattern UIs, quietly reusing customer data for a new purpose) may be legal but unethical. A code of conduct fills the gap the law leaves open, and often moves faster than legislation."},
    {t:"Ethics vs. what your boss wants", b:"When an employer asks you to cut a security corner to hit a deadline, the code says the public's safety outranks the deadline. Professionals are expected to raise the concern, document it, and escalate, not silently comply."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"You are the professional: what do you do?",
    cards:[
     {stem:"Your team is shipping a banking app tomorrow. During testing you find a bug that occasionally shows one customer another customer's balance. Your manager says: 'Ship it, we'll patch next week.'",
      role:"Role: Software engineer on a release team",
      choices:[
        {t:"Ship on schedule with extra monitoring, so the team can patch the moment the bug appears in production.", correct:false, whyNot:"Monitoring is reactive: it only catches the defect after a customer's balance has already been exposed, so the privacy breach still happens on your watch."},
        {t:"Refuse to sign off, document the risk, and escalate that the defect exposes customers' personal data.", correct:true},
        {t:"Add a line to the terms of service noting that displayed balances may occasionally be inaccurate.", correct:false, whyNot:"Terms of service cannot authorise showing one customer's data to another. A disclaimer shifts blame on paper while the confidentiality breach still occurs."}
      ],
      ok:"Correct. Monitoring only catches a breach after a customer's balance has already been exposed, and a disclaimer cannot authorise showing one customer's data to another. The code requires refusing sign-off, documenting the defect and escalating.",
      no:"This sounds professional but still knowingly ships a privacy defect. Monitoring reacts only after a balance has been exposed, and terms of service cannot authorise disclosing one customer's data to another. Refuse sign-off, document and escalate."},
     {stem:"A recruiter offers you a lucrative contract to build a machine-learning model in a medical field you have never worked in, with only two weeks to deliver.",
      role:"Role: Freelance developer",
      choices:[
        {t:"Accept it, then close the knowledge gap with an intensive online course during the first week.", correct:false, whyNot:"A one-week crash course cannot produce safe competence in a safety-critical medical domain, so patients would still bear the risk of an unqualified build."},
        {t:"Accept it, but add a contract clause disclaiming liability for any clinical errors the model makes.", correct:false, whyNot:"A liability clause protects you on paper, not the patients. Shifting legal risk does nothing about the danger of a model built without competence."},
        {t:"Decline or rescope it honestly, stating you would need proper time or a qualified collaborator.", correct:true}
      ],
      ok:"Correct. A one-week crash course cannot produce safe <b>competence</b> in a medical domain, and a liability clause shifts paper risk while leaving patients exposed. Competence means being honest about your limits, then rescoping or declining.",
      no:"This is the tempting professional-sounding shortcut. A crash course cannot make you competent in medical AI within the deadline, and disclaiming liability protects you rather than the patients. The <b>competence</b> principle requires honest rescoping or declining."}
    ]},
   {type:"match", tag:"Drag &amp; drop", title:"Match the behaviour to the principle",
    instr:"Drag each professional behaviour onto the code-of-conduct principle it demonstrates.",
    tokens:[
      {id:"e1", text:"Turning down a paid project in a domain you have never built for"},
      {id:"e2", text:"Refusing to discuss a client's user database with a friend at another firm"},
      {id:"e3", text:"Halting a release after finding a defect that could endanger users"},
      {id:"e4", text:"Telling a client that you part-own one of the vendors bidding for their contract"}
    ],
    targets:[
      {id:"ep1", title:"Competence", hint:"Work only within what you can deliver well", accept:"e1"},
      {id:"ep2", title:"Confidentiality", hint:"Entrusted information stays protected", accept:"e2"},
      {id:"ep3", title:"Public interest first", hint:"The public outranks business goals", accept:"e3"},
      {id:"ep4", title:"Integrity &amp; honesty", hint:"Openness about conflicts and claims", accept:"e4"}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which action best reflects the 'public interest first' principle?",
     opts:["Declining a project that is beyond your current technical skills","Refusing to share a client's user records with a third party","Reporting a safety flaw even though it delays your product","Crediting a colleague's code library in your documentation"],
     ans:2, wrongWhy:{0:"Sound professional behaviour, but it demonstrates a different principle: knowing the limits of your own ability.",1:"Also right to do, but protecting entrusted information illustrates a different principle from the one asked about.",3:"Giving credit reflects professional responsibility and respect for others' work, a different principle from the one asked about."}, why:"All four are sound professional behaviours, but each maps to a different principle: declining unfamiliar work is competence, protecting client records is confidentiality, and giving credit is professional responsibility. Putting user safety above the schedule is public interest first."},
    {type:"mcq", q:"A developer discovers a colleague secretly copying licensed source code from another company into their product. What does the code of conduct expect the developer to do?",
     opts:["Alert the company whose code was copied so it can enforce its licence","Raise it with the colleague, then escalate internally if the code stays in","Make a police report, since shipping unlicensed code is unlawful","Rewrite the affected module with licensed code so the product is compliant"],
     ans:1, wrongWhy:{0:"Going outside the firm first breaches the confidentiality you owe your employer and skips the channels that exist for exactly this situation.",2:"Licensing disputes are primarily a civil matter between companies, so a police report is a disproportionate first response.",3:"This quietly fixes future builds but conceals the conduct and the exposure from versions already shipped, so the firm cannot assess its risk."}, why:"All four sound responsible, but three misfire. Alerting the other company breaches the confidentiality you owe your employer and skips internal channels. A police report is disproportionate, since licensing is primarily a civil matter. Rewriting the module fixes the future code but conceals the conduct and the exposure from versions already shipped. The code expects raising it with the colleague, then escalating through proper internal channels."},
    {type:"short", q:"State two principles from a computing professional's code of conduct and give one example of each in practice.",
     model:"Any two, e.g. (1) <b>Competence</b>: only accepting a database security job if you are trained in it. (2) <b>Confidentiality</b>: not sharing a client's user records with a friend. Other valid principles: public interest, integrity/honesty, respect for privacy and intellectual property, professional responsibility."}
  ]
},
/* ---------- MODULE 2: IMPACT ON LIFESTYLE & WORKPLACE ---------- */
{
  id:"impact", num:"2", title:"Impact of Computing on Lifestyle &amp; Workplace",
  lo:"LO 3.4.2: Describe the impact of computing on lifestyle and workplace for social and economic developments.",
  learn:`
    <p>Computing reshapes how people <strong>live</strong> (lifestyle) and how they <strong>work</strong> (workplace), and this drives both <strong>social</strong> and <strong>economic</strong> change. A good answer always names <em>who</em> is affected and <em>whether the effect is positive or negative</em>.</p>
    <div class="key"><b>Exam framing:</b> For every impact, ask: is it social or economic? Is it a benefit or a drawback? Give a concrete Singapore-relevant example.</div>
    <p><strong>Lifestyle</strong>: smartphones, e-payments (PayNow), streaming, telehealth and social media change how we shop, socialise, learn and access services. Benefits include convenience, access to information and connection across distance. Drawbacks include screen addiction, misinformation, reduced face-to-face contact and a <strong>digital divide</strong> between those with and without access.</p>
    <p><strong>Workplace</strong>: automation, remote collaboration tools and AI change the nature of jobs. Benefits include higher productivity, new job categories (data scientist, UX designer) and flexible remote work. Drawbacks include <strong>job displacement</strong> from automation, the need for constant reskilling, and blurred work-life boundaries.</p>`,
  expanders:[
    {t:"Social vs economic: telling them apart", b:"<b>Social</b> impacts affect relationships, wellbeing, community and access (e.g. isolation, the digital divide, easier communication). <b>Economic</b> impacts affect money, jobs, productivity and industries (e.g. new markets, unemployment from automation, growth of the gig economy)."},
    {t:"The digital divide in Singapore", b:"Not everyone benefits equally. Lower-income households and some elderly residents may lack devices, connectivity or digital literacy, so they can miss out on e-services, e-payments and remote work. This is a <b>social</b> impact with real <b>economic</b> consequences."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"Classify the impact",
    cards:[
     {stem:"A large logistics firm deploys warehouse robots. Output rises 40%, but 200 manual packers are no longer needed.",
      role:"Task: Identify the dominant impact type",
      choices:[
        {t:"Mainly a social impact, because losing 200 workers will change morale and community life around the site.", correct:false, whyNot:"Morale and community effects are knock-ons of the job losses. Classify what the scenario directly describes: output rising while paid work disappears."},
        {t:"An economic impact: higher productivity for the firm but job displacement for the retrenched workers.", correct:true},
        {t:"A neutral change overall, since technology tends to create as many jobs as it removes in the long run.", correct:false, whyNot:"Long-run job creation elsewhere does not cancel the displacement these 200 workers face right now, so the change is not neutral for them."}
      ],
      ok:"Correct. The morale effects are real knock-ons, and new jobs may emerge economy-wide over time, but what the scenario describes is <b>economic</b>: output rises while these jobs are displaced and the workers must reskill.",
      no:"Plausible, but classify what is actually described. Community effects follow from the job losses, and long-run job creation elsewhere does not cancel the displacement here. A productivity gain plus job displacement is an <b>economic</b> impact."},
     {stem:"A firm goes fully remote. Office rental costs fall and staff save commuting time, but new hires struggle to bond with the team and some staff reply to messages late into the night.",
      role:"Task: Identify the best analysis",
      choices:[
        {t:"A mixed impact: economic benefits for the firm alongside social drawbacks for the staff.", correct:true},
        {t:"A workplace efficiency gain, since hours saved commuting convert directly into productive work.", correct:false, whyNot:"This counts only the upside. The scenario also describes new hires struggling to bond and late-night replies, which this reading ignores."},
        {t:"A social benefit overall, since staff gain family time and freedom.", correct:false, whyNot:"The scenario itself mentions weaker team bonding and messages late into the night, so calling it an overall social benefit ignores half the evidence."}
      ],
      ok:"Correct. The savings and flexibility are real, but the scenario also describes new hires struggling to bond and replies late into the night. Full marks come from holding both sides: <b>economic benefits</b> with <b>social drawbacks</b>.",
      no:"That captures only the upside. The scenario itself mentions weak team bonding and late-night replies, so the analysis must pair the <b>economic benefits</b> with those <b>social drawbacks</b>."}
    ]},
   {type:"match", tag:"Drag &amp; drop", title:"Benefit or drawback? Social or economic?",
    instr:"Drag each impact into the correct quadrant.",
    tokens:[
      {id:"i1", text:"Telehealth lets elderly patients consult doctors from home"},
      {id:"i2", text:"Excessive screen time reduces face-to-face interaction"},
      {id:"i3", text:"E-commerce opens overseas markets to small local businesses"},
      {id:"i4", text:"Automation makes some routine jobs redundant"}
    ],
    targets:[
      {id:"iq1", title:"Social benefit", hint:"Better lives or wider inclusion", accept:"i1"},
      {id:"iq2", title:"Social drawback", hint:"Weaker wellbeing or community", accept:"i2"},
      {id:"iq3", title:"Economic benefit", hint:"Higher output or new income", accept:"i3"},
      {id:"iq4", title:"Economic drawback", hint:"Lost livelihoods or higher costs", accept:"i4"}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which is best described as a SOCIAL (rather than economic) impact of computing?",
     opts:["Retrenched drivers retraining for new logistics-sector jobs","Small local businesses reaching overseas customers through e-commerce","Gig workers facing unpredictable weekly incomes","Elderly residents feeling excluded as services move online"],
     ans:3, wrongWhy:{0:"Retraining is about employment and livelihoods, which places it on the money-and-jobs side of the classification.",1:"New markets and sales are about income and industry, which is the economic side of the classification.",2:"Unstable income is about money and livelihoods, which makes it economic rather than social."}, why:"All four affect people, so classify by the nature of the effect: retraining, market reach and incomes concern jobs and money, which is economic. Feeling excluded from services concerns access and wellbeing, which is social."},
    {type:"mcq", q:"Which situation is the clearest example of the digital divide?",
     opts:["Commuters annoyed that an app update changed its familiar interface","Lower-income households lacking devices to access e-services","Two telcos offering different mobile data speeds at similar prices","An office issuing laptops to some staff and tablets to other staff"],
     ans:1, wrongWhy:{0:"Annoyance at a redesign is a usability complaint. Everyone involved still has full access to the technology.",2:"That is market competition between providers. Customers of both still have connectivity and access to services.",3:"Different devices are still devices. Every member of staff remains connected and able to work."}, why:"The digital divide is unequal access to technology and the skills to use it, which cuts people off from essential services. Interface changes, differing speeds and different issued devices still leave everyone connected."},
    {type:"short", q:"Describe one positive and one negative impact of computing on the modern workplace.",
     model:"<b>Positive:</b> productivity tools and automation let workers do more, and remote collaboration enables flexible work. <b>Negative:</b> automation displaces routine jobs, and workers face constant pressure to reskill; work-life boundaries blur when people are always reachable."}
  ]
},
/* ---------- MODULE 3: SOCIAL, ETHICAL, LEGAL, ECONOMIC ISSUES ---------- */
{
  id:"sele", num:"3", title:"Social, Ethical, Legal &amp; Economic Issues",
  lo:"LO 3.4.3: Discuss the social, ethical, legal and economic issues of computing and technology.",
  learn:`
    <p>Almost every computing development can be analysed through <strong>four lenses</strong>. Using all four is how you turn a one-line opinion into a full discussion.</p>
    <ul>
      <li><strong>Social</strong>: effects on people, communities, relationships and access (e.g. the digital divide, online harassment, misinformation).</li>
      <li><strong>Ethical</strong>: is it right or fair? (e.g. biased AI, surveillance, addictive design, consent).</li>
      <li><strong>Legal</strong>: what laws apply? (e.g. PDPA, Computer Misuse Act, Copyright Act, intellectual property).</li>
      <li><strong>Economic</strong>: effects on money, jobs and industries (e.g. automation, new business models, cost of cybercrime).</li>
    </ul>
    <div class="key"><b>Technique:</b> When a question says "discuss," walk through S-E-L-E deliberately. The same technology often creates a benefit under one lens and a problem under another.</div>
    <p>Example: <strong>facial recognition in public spaces</strong>: <em>Social</em> (safety vs feeling watched), <em>Ethical</em> (consent, bias against some groups), <em>Legal</em> (does collection comply with the PDPA?), <em>Economic</em> (cheaper security vs cost of misuse).</p>`,
  expanders:[
    {t:"The four lenses can conflict", b:"A ride-hailing app is an <b>economic</b> win (new income, cheaper rides) but raises <b>social</b> issues (worker protections in the gig economy) and <b>legal</b> issues (licensing, data). A mature answer shows these tensions rather than picking one side."},
    {t:"Relevant Singapore laws to name", b:"<b>PDPA</b>: personal data protection. <b>Computer Misuse Act</b>: unauthorised access/hacking. <b>Copyright Act</b>: software and content IP. Naming the right law turns a vague 'it's illegal' into a precise legal point."}
  ],
  activities:[
   {type:"match", tag:"Drag &amp; drop", title:"Sort each concern into its lens",
    instr:"Drag each issue on the left onto the correct lens on the right.",
    tokens:[
      {id:"t1", text:"An AI hiring tool rejects more female applicants due to biased training data"},
      {id:"t2", text:"Elderly residents struggle to use government services that moved online"},
      {id:"t3", text:"A marketing firm sends SMS promotions to numbers listed on the Do Not Call Registry"},
      {id:"t4", text:"A logistics firm replaces most of its drivers with autonomous delivery vehicles"}
    ],
    targets:[
      {id:"d1", title:"Ethical", hint:"Fairness, consent, accountability", accept:"t1"},
      {id:"d2", title:"Social", hint:"Who is included, connected, left behind", accept:"t2"},
      {id:"d3", title:"Legal", hint:"A statutory rule is engaged", accept:"t3"},
      {id:"d4", title:"Economic", hint:"Livelihoods, output, industries", accept:"t4"}
    ]},
   {type:"scenario", tag:"Scenario decision", title:"Apply the lenses",
    cards:[
     {stem:"A food-delivery platform's algorithm assigns orders and sets pay rates automatically. Riders complain the rules are opaque and change without notice, and their weekly income swings unpredictably.",
      role:"Task: Choose the strongest analysis",
      choices:[
        {t:"Mainly a legal issue: the platform should be made to publish its source code so riders can audit their pay.", correct:false, whyNot:"No law requires a company to open-source its algorithm, so framing this as a legal duty misstates the position."},
        {t:"Mainly a market issue: unhappy riders can simply switch to a rival app.", correct:false, whyNot:"Rival platforms run the same opaque algorithmic model, so switching rarely escapes the problem the riders describe."},
        {t:"Ethical and economic issues, with social concern for the riders' wellbeing.", correct:true}
      ],
      ok:"Correct. No law compels publishing the algorithm, and switching apps rarely escapes the same model, since rivals use it too. The strong analysis stacks the lenses: <b>ethical</b> opacity, <b>economic</b> income instability and <b>social</b> concern for the riders.",
      no:"Plausible, but no law requires open-sourcing the algorithm, and 'just switch platforms' ignores that rivals run the same model. The scenario raises <b>ethical</b> issues (opaque decisions), <b>economic</b> issues (unstable income) and <b>social</b> concern for the riders."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"An app secretly A/B-tests designs to make teenagers scroll longer. Which analysis identifies the core issue?",
     opts:["Economic: the tests raise engagement and therefore the app's advertising revenue","Social: teenagers spend more of their time connecting with friends online","Ethical: it manipulates users' psychology without their informed consent","Legal: running A/B tests on an app without a licence breaches the Copyright Act"],
     ans:2, wrongWhy:{0:"The revenue motive explains why the firm runs the tests, not what is wrong with running them.",1:"Reading extra scrolling as connection ignores that the extra time was engineered without the users' knowledge.",3:"The Copyright Act governs ownership of creative works. No licence is needed to test designs on your own app."}, why:"The economic gain is the motive, not the issue, the copyright claim misapplies the law, and calling longer scrolling 'connection' ignores the manipulation. The core issue is ethical: exploiting psychology without informed consent."},
    {type:"mcq", q:"A start-up scrapes publicly visible social-media photos to train a facial-recognition product, without asking anyone. In Singapore, the strongest LEGAL point is:",
     opts:["The Computer Misuse Act, because scraping is unauthorised access to a computer system","The Copyright Act, because the photographers own the images that were copied","No law applies, because the photos were already publicly visible online","The PDPA, because identifiable faces are personal data collected without consent"],
     ans:3, wrongWhy:{0:"The Computer Misuse Act targets unauthorised access such as hacking. Downloading publicly served pages is not clearly unauthorised access.",1:"Copyright belongs to the photographers, not the people photographed, so it is a separate and weaker point than one about the faces themselves.",2:"Publicly visible does not mean free to collect and use for any purpose. Visibility and lawful use are different questions."}, why:"The Computer Misuse Act targets unauthorised access such as hacking, and scraping publicly served pages is not clearly that. Copyright belongs to the photographers and is a separate point. The strongest point is the PDPA: faces identify people, and public visibility does not remove the need for consent."},
    {type:"short", q:"A city rolls out CCTV with facial recognition. Discuss it using any THREE of the four lenses (social, ethical, legal, economic).",
     model:"<b>Social:</b> may deter crime but makes citizens feel constantly watched. <b>Ethical:</b> consent and possible bias against certain groups. <b>Legal:</b> collection and use of biometric personal data must comply with the PDPA. <b>Economic:</b> cheaper policing but costs if data is misused or breached."}
  ]
},
/* ---------- MODULE 4: PRIVACY & INTEGRITY OF DATA ---------- */
{
  id:"privacy", num:"4", title:"Privacy &amp; Integrity of Data",
  lo:"LO 3.3.9 / 3.3.10: Understand the need for privacy and integrity of data, and describe methods to protect data.",
  learn:`
    <p>Two ideas are often confused. Keep them separate:</p>
    <ul>
      <li><strong>Privacy</strong>: keeping data <em>confidential</em>, so only authorised people can see it. Breach of privacy = the wrong person <em>read</em> the data.</li>
      <li><strong>Integrity</strong>: keeping data <em>accurate and unaltered</em>, so it is correct and trustworthy. Breach of integrity = the data was wrongly <em>changed</em>, corrupted or lost.</li>
    </ul>
    <div class="key"><b>One-liner:</b> Privacy is "who can see it." Integrity is "is it still correct." A hospital needs both: records must be secret <em>and</em> right.</div>
    <p><strong>Why it matters:</strong> personal, financial and medical data can cause real harm if leaked (privacy) or if silently altered (integrity, e.g. a wrong blood type). Organisations also have legal duties (PDPA) to protect it.</p>
    <p><strong>Methods to protect data</strong> (syllabus 3.3.10):</p>
    <ul>
      <li><strong>Access control</strong>: usernames, strong passwords, and permission levels so only authorised users get in.</li>
      <li><strong>Encryption</strong>: scrambling data so a thief who copies it cannot read it (protects privacy).</li>
      <li><strong>Firewalls &amp; anti-malware</strong>: block unauthorised network access and malicious software.</li>
      <li><strong>Backups</strong>: copies so data can be restored after loss or ransomware (protects integrity/availability).</li>
      <li><strong>Validation &amp; checksums</strong>: detect accidental corruption or errors (protects integrity).</li>
      <li><strong>Audit logs &amp; two-factor authentication</strong>: track access and add a second identity check.</li>
    </ul>`,
  expanders:[
    {t:"Privacy vs integrity: the classic mix-up", b:"Encryption mainly protects <b>privacy</b> (a thief can copy the file but cannot read it). A <b>checksum or validation</b> mainly protects <b>integrity</b> (it flags if the data was altered). Backups protect against <b>loss</b>, restoring integrity and availability. Matching the method to the goal is a common exam mark."},
    {t:"Backup is not the same as archive (3.3.11)", b:"A <b>backup</b> is a copy kept so live data can be <b>restored</b> if lost. An <b>archive</b> moves old, rarely-used data out of the live system for <b>long-term retention</b>. Backups are about recovery; archives are about storage and retention."}
  ],
  activities:[
   {type:"match", tag:"Drag &amp; drop", title:"Match the method to what it protects",
    instr:"Drag each protection method onto the goal it MAINLY serves.",
    tokens:[
      {id:"p1", text:"Full-disk encryption on every staff laptop"},
      {id:"p2", text:"Nightly copies of the database kept on a disconnected server"},
      {id:"p3", text:"A checksum recomputed and compared whenever a file is opened"},
      {id:"p4", text:"A one-time SMS code required on top of each staff password"}
    ],
    targets:[
      {id:"g1", title:"Mainly protects PRIVACY", hint:"Contents stay unreadable to outsiders", accept:"p1"},
      {id:"g2", title:"Restores after LOSS", hint:"The data can be brought back", accept:"p2"},
      {id:"g3", title:"Mainly protects INTEGRITY", hint:"Reveals whether data was altered", accept:"p3"},
      {id:"g4", title:"Controls ACCESS", hint:"Keeps unauthorised users out", accept:"p4"}
    ]},
   {type:"scenario", tag:"Scenario decision", title:"Design the protection",
    cards:[
     {stem:"A clinic wants two guarantees: (1) if ransomware encrypts its server, patient records can still be recovered, and (2) receptionists cannot open the medical notes of patients they do not handle.",
      role:"Task: Pick the right combination of methods",
      choices:[
        {t:"Offline backups kept separate from the live server, plus role-based access control for clinic staff.", correct:true},
        {t:"Full-disk encryption with a strict password policy, so records are unreadable to anyone outside the clinic.", correct:false, whyNot:"Encryption keeps outsiders from reading records but cannot bring data back once ransomware encrypts it again, and passwords alone do not separate staff roles."},
        {t:"A live mirror of every record to a second server that stays connected for instant failover.", correct:false, whyNot:"A permanently connected mirror is reached by the same ransomware and gets encrypted along with the original, so it guards against hardware failure, not this attack."}
      ],
      ok:"Correct. Encryption cannot restore data after ransomware, and a permanently connected mirror would be encrypted along with the original. <b>Offline backups</b> let the clinic restore records, and <b>role-based access control</b> enforces need-to-know.",
      no:"This is the classic near-miss. Encryption and passwords keep outsiders from reading records but restore nothing after ransomware, and a connected mirror gets encrypted together with the live server. The clinic needs <b>offline backups</b> plus <b>role-based access control</b>."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"A staff member changes a patient's recorded blood type by accident and nobody notices. Which property has been compromised?",
     opts:["Integrity, because the stored data no longer matches reality","Privacy, because the record was opened by a staff member","Availability, because the correct value can no longer be retrieved","Confidentiality, because the change was not reported to the patient"],
     ans:0, wrongWhy:{1:"The staff member was authorised to open the record, so no unauthorised person saw it.",2:"The record is still stored and retrievable. The problem is what the retrieved value now says.",3:"Confidentiality is about disclosure to unauthorised parties, and nothing here was disclosed to anyone."}, why:"The staff member was authorised to open the record, so privacy and confidentiality were not breached, and the record can still be retrieved, so availability stands. Stored data that no longer matches reality is a loss of integrity."},
    {type:"mcq", q:"Which pairing of method and main purpose is correct?",
     opts:["Encryption mainly protects integrity, since encrypted data cannot be altered","Backups mainly protect privacy, since copies sit away from the live system","Checksums mainly protect integrity, since they reveal when data has changed","Access control mainly protects integrity, since users cannot read others' records"],
     ans:2, wrongWhy:{0:"Encrypted data can still be corrupted or overwritten. Encryption controls who can read data, not whether it changes.",1:"Backups exist so data can be restored after loss. Extra copies, if anything, widen what must be kept confidential.",3:"Stopping people from reading records keeps data confidential. Reading alone changes nothing in the data."}, why:"Encrypted data can still be corrupted or replaced, so encryption mainly protects privacy. Backups guard against loss, and blocking users from reading records is privacy again. Checksums exist to reveal alteration, which is integrity."},
    {type:"short", q:"Explain the difference between the privacy and the integrity of data, and give one method that protects each.",
     model:"<b>Privacy</b> = keeping data confidential so only authorised people can access it; protected by <b>encryption</b> or access control. <b>Integrity</b> = keeping data accurate and unaltered so it stays correct; protected by <b>validation/checksums</b> (and backups to recover correct data). Privacy is about who can see it; integrity is about whether it is still correct."}
  ]
},
/* ---------- MODULE 5: PDPA ---------- */
{
  id:"pdpa", num:"5", title:"Personal Data Protection Act (PDPA)",
  lo:"LO 3.3.13: Explain how data in Singapore is protected under the PDPA to govern the collection, use and disclosure of personal data.",
  learn:`
    <p>Singapore's <strong>Personal Data Protection Act (PDPA)</strong> governs how organisations may <strong>collect, use and disclose</strong> personal data. <strong>Personal data</strong> is any data that can identify an individual on its own or with other data (e.g. name, NRIC, phone number, photo). It is enforced by the <strong>Personal Data Protection Commission (PDPC)</strong>.</p>
    <div class="key"><b>Purpose of the PDPA:</b> to protect individuals' personal data while recognising organisations' legitimate need to use data, so that trust in the digital economy is maintained.</div>
    <p>Key obligations organisations must follow include:</p>
    <ul>
      <li><strong>Consent</strong>: obtain the individual's consent before collecting, using or disclosing their data.</li>
      <li><strong>Purpose Limitation</strong>: only collect and use data for purposes a reasonable person considers appropriate, and that were made known.</li>
      <li><strong>Notification</strong>: inform individuals of the purpose before collecting.</li>
      <li><strong>Access &amp; Correction</strong>: let individuals ask what data is held and request corrections.</li>
      <li><strong>Accuracy</strong>: make reasonable effort to keep personal data accurate and complete.</li>
      <li><strong>Protection</strong>: make reasonable security arrangements to protect data from unauthorised access or loss.</li>
      <li><strong>Retention Limitation</strong>: stop keeping data once the purpose is served and legal need ends.</li>
      <li><strong>Transfer Limitation</strong>: data sent overseas must get comparable protection.</li>
      <li><strong>Data Breach Notification</strong>: notify the PDPC (and affected people) of significant breaches.</li>
      <li><strong>Accountability</strong>: appoint a Data Protection Officer and publish data policies.</li>
    </ul>
    <p>The PDPA also underpins the <strong>Do Not Call (DNC) Registry</strong>, which lets individuals opt out of marketing calls and messages.</p>`,
  expanders:[
    {t:"A simple way to remember the core three", b:"The PDPA governs <b>collection, use and disclosure</b>. Almost every obligation attaches to one of these three verbs: get <b>consent</b> and <b>notify</b> before <b>collecting</b>, respect <b>purpose limitation</b> when <b>using</b>, and control <b>transfer/disclosure</b> when sharing."},
    {t:"What counts as personal data?", b:"Data that identifies a person alone (NRIC, full name + address, photo of a face) or in combination with other data the organisation can access. Anonymised data that cannot be linked back to an individual generally falls outside the PDPA."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"Which PDPA obligation is breached?",
    cards:[
     {stem:"A gym collected members' phone numbers 'to send class reminders.' A year later it sells the entire list to a supplement company for marketing, without asking anyone.",
      role:"Task: Name the main breach",
      choices:[
        {t:"Acceptable under the PDPA, provided the supplement company protects the numbers and uses them only for marketing.", correct:false, whyNot:"The buyer's safeguards cannot legitimise the sale itself. The failure happened at the moment data collected for one purpose was disclosed for another."},
        {t:"A breach of the Protection obligation, because the numbers were sold without being encrypted first.", correct:false, whyNot:"Encryption is beside the point here. The Protection obligation concerns securing data against unauthorised access, not whether a deliberate sale was permitted."},
        {t:"A breach of Consent and Purpose Limitation, since the data now serves a purpose nobody agreed to.", correct:true}
      ],
      ok:"Correct. The buyer's security practices cannot legitimise the sale, and encryption is beside the point. Data collected for class reminders was disclosed for marketing without fresh consent, breaching <b>Consent</b> and <b>Purpose Limitation</b>.",
      no:"Tempting, but downstream safeguards and encryption are not the issue here. The failure happened at the moment of sale: data collected for reminders was disclosed for an unconsented new purpose, breaching <b>Consent</b> and <b>Purpose Limitation</b>."},
     {stem:"An online store keeps every customer's full credit-card number in a plain text file, and a hacker copies it. The store also had no plan for telling anyone.",
      role:"Task: Identify the failed obligations",
      choices:[
        {t:"Mainly a Consent failure, since customers never agreed to card storage.", correct:false, whyNot:"Customers did consent to their cards being used for payment. The question is how the numbers were kept and what happens after the theft."},
        {t:"The Protection obligation (no reasonable security) and Data Breach Notification.", correct:true},
        {t:"Mainly a Retention failure, because the card numbers should have been deleted much sooner.", correct:false, whyNot:"Deleting earlier would have shrunk the damage, but retention timing is not the direct failure that let a hacker read every number in plain text."}
      ],
      ok:"Correct. Customers consented to card use for payment, and earlier deletion is a side point. Plain-text storage fails the <b>Protection</b> obligation's reasonable-security test, and having no plan to alert the PDPC and customers fails <b>Data Breach Notification</b>.",
      no:"Plausible, but consent covered payment processing and retention timing is secondary. The direct failures are <b>Protection</b> (plain-text card numbers are not reasonable security) and <b>Data Breach Notification</b> (no plan to inform the PDPC and affected customers)."}
    ]},
   {type:"match", tag:"Drag &amp; drop", title:"Match the action to the PDPA obligation",
    instr:"Drag each real-world action onto the obligation it satisfies.",
    tokens:[
      {id:"o1", text:"An unticked box on a sign-up form: 'May we send you promotions?'"},
      {id:"o2", text:"A clinic's entrance sign states that CCTV operates on the premises for security"},
      {id:"o3", text:"A telco portal lets customers view and update the details it holds on them"},
      {id:"o4", text:"A shop's system wipes CCTV footage automatically after 30 days"}
    ],
    targets:[
      {id:"b1", title:"Consent", hint:"Permission, not just information", accept:"o1"},
      {id:"b2", title:"Notification", hint:"Purpose made known up front", accept:"o2"},
      {id:"b3", title:"Access &amp; Correction", hint:"Individuals can ask about their own data", accept:"o3"},
      {id:"b4", title:"Retention Limitation", hint:"Kept no longer than the purpose needs", accept:"o4"}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which of these is personal data under the PDPA?",
     opts:["A report stating that 62% of residents in a town use e-payments","A delivery record showing a named customer's home address","A dataset of survey answers with all names and IDs removed","A count of the patients treated at a clinic each month"],
     ans:1, wrongWhy:{0:"A percentage across a whole town cannot be traced back to any single person.",2:"Properly anonymised answers no longer identify anyone, which takes them outside the definition.",3:"A monthly total reveals nothing about any individual patient."}, why:"Percentages, anonymised surveys and monthly counts cannot identify any individual. A record linking a name to a home address identifies a person, so it is personal data under the PDPA."},
    {type:"mcq", q:"A company wants to store its Singapore customers' data on overseas servers. Which obligation MOST directly applies?",
     opts:["Protection, because overseas servers need reasonable security arrangements","Consent, because customers must approve every change of server location","Retention Limitation, because data should not be kept longer overseas than needed","Transfer Limitation, because data sent abroad must get comparable protection"],
     ans:3, wrongWhy:{0:"Security arrangements matter wherever data sits, but this obligation is not the one written specifically for sending data out of Singapore.",1:"The PDPA does not require fresh consent for every infrastructure change. Server location is not by itself a new purpose.",2:"Retention rules govern how long data is kept, not where it is kept or what standard of protection travels with it."}, why:"Protection, consent and retention all still matter, but the obligation written for this exact situation is Transfer Limitation: personal data moved out of Singapore must receive a comparable standard of protection."},
    {type:"mcq", q:"A resident registered their number to stop marketing calls, but a company keeps sending promotional SMSes anyway. Which PDPA-related mechanism has the company ignored?",
     opts:["The Do Not Call (DNC) Registry, which it must check before telemarketing","The Notification obligation, which requires stating the purpose of each SMS","The Accuracy obligation, since its contact list is clearly out of date","The Data Breach Notification obligation, since the messages were unwanted"],
     ans:0, wrongWhy:{1:"Notification is about telling people the purpose when collecting their data, not screening marketing messages against an opt-out register.",2:"The number still reaches the right person, so the record is accurate. The failure is sending marketing to someone who opted out.",3:"Breach notification applies to security incidents that expose data, and no data was exposed by sending these messages."}, why:"Notification concerns stating purposes when collecting, Accuracy concerns keeping records correct, and breach notification concerns security incidents. Ignoring a telemarketing opt-out means failing to check the DNC Registry."},
    {type:"short", q:"Explain the purpose of the PDPA and state THREE obligations it places on organisations.",
     model:"The PDPA governs how organisations <b>collect, use and disclose</b> personal data, protecting individuals while allowing legitimate use, to maintain trust in the digital economy. Any three obligations, e.g. <b>Consent</b> (get permission before collecting), <b>Purpose Limitation</b> (only use for stated purposes), <b>Protection</b> (secure the data), <b>Access &amp; Correction</b>, <b>Retention Limitation</b>, <b>Data Breach Notification</b>."}
  ]
}
];

/* ============ FINAL CHALLENGE (mixed, all topics) ============ */
const CHALLENGE = {
  totalMarks: 25, timerMins: 25,
  sectionA: [
    {topic:"Ethics 3.4.1", q:"A software professional discovers a security flaw that could expose users' data, but fixing it will delay the launch. What does a code of ethics require?",
     opts:["Ship on time and schedule the fix for the next sprint, documenting the decision","Ship on time with heightened log monitoring to catch any exploitation early","Escalate the flaw and hold the launch until users' data is safe","Pass the decision entirely to management, since accepting risk is their job"], ans:2,
     why:"Scheduling a later fix, monitoring for exploitation and deferring to management all sound diligent, but each one still ships a known flaw and leaves users exposed. The code places users' safety and data above the schedule, so escalate and hold the launch."},
    {topic:"PDPA 3.3.13", q:"Which of the following counts as personal data under the PDPA?",
     opts:["A CCTV still in which a shopper's face is clearly recognisable","A heat map of overall customer movement recorded through a mall","A spreadsheet of the daily sales totals for each retail outlet","A published average household income figure for a district"], ans:0,
     why:"Sales totals, movement heat maps and district averages identify no individual. A recognisable face identifies a person, so the CCTV still is personal data even though it was captured in public."},
    {topic:"Data 3.3.9", q:"A record is silently changed so a patient's stored allergy is now wrong. Which property is compromised?",
     opts:["Privacy, because the record was accessed in order to change it","Availability, because the original value is no longer stored anywhere","Integrity, because the stored data no longer reflects the truth","Confidentiality, because the patient was never told about the change"], ans:2,
     why:"Authorised access is not a privacy breach, the record is still retrievable, and confidentiality concerns disclosure to outsiders. Data that no longer reflects the truth is a loss of integrity."},
    {topic:"SELE 3.4.3", q:"An AI recruitment tool rejects more applicants of one gender because of biased training data. The MOST fundamental issue is:",
     opts:["Economic, because the firm loses access to qualified candidates","Ethical, because an unaccountable system produces unfair outcomes","Technical, because a larger dataset would have balanced the model","Social, because hiring patterns shape who feels welcome in the tech industry"], ans:1,
     why:"The economic and social effects are real consequences, and more data might reduce the skew, but the root problem is ethical: an automated system is making unfair decisions with no accountability."},
    {topic:"Impact 3.4.2", q:"Warehouse automation raises a firm's output but removes 200 packing jobs. This is best classified as:",
     opts:["A social impact, because the community surrounding the warehouse will change","An ethical impact, because the firm chose its profit over its workers","A legal impact, because retrenchment is governed by employment law","An economic impact, combining a productivity gain with job displacement"], ans:3,
     why:"Community change, fairness debates and retrenchment rules all follow on, but the impact itself is economic: productivity rises while jobs are displaced and workers must reskill."}
  ],
  sectionB: [
    {topic:"Ethics 3.4.1", marks:4,
     q:"Your manager tells you to ship a banking app with a known bug that occasionally shows one customer another customer's balance. State what a computing professional should do and justify it using the code of conduct. [4]",
     model:"A professional should refuse to sign off, document the defect, and escalate that it must be fixed before release. Justification: the 'public interest' and 'confidentiality of data' principles place users' safety and data above the deadline; 'integrity and honesty' forbid concealing a known defect.",
     scheme:[
       {pt:"States the correct action (do not ship / escalate / document the defect)", m:1},
       {pt:"Names a relevant principle (public interest OR confidentiality)", m:1},
       {pt:"Explains that user safety / data outranks the deadline or manager's order", m:1},
       {pt:"Links concealment to a breach of integrity / honesty", m:1}
     ]},
    {topic:"PDPA 3.3.13", marks:5,
     q:"Explain the purpose of the PDPA and state THREE obligations it places on organisations, with a brief example of one. [5]",
     model:"Purpose: the PDPA governs how organisations collect, use and disclose personal data, protecting individuals while allowing legitimate business use, so as to maintain trust in the digital economy. Three obligations (any three): Consent (ask before collecting), Purpose Limitation (only use for stated purposes), Protection (secure the data), Access & Correction, Retention Limitation, Transfer Limitation, Data Breach Notification. Example: under Consent, a gym must ask before using members' numbers for marketing.",
     scheme:[
       {pt:"States it governs collection, use and disclosure of personal data", m:1},
       {pt:"Notes it protects individuals while allowing legitimate use / builds trust", m:1},
       {pt:"First correct obligation named", m:1},
       {pt:"Second correct obligation named", m:1},
       {pt:"Third correct obligation named OR a correct worked example", m:1}
     ]},
    {topic:"Data 3.3.9 / 3.3.10", marks:4,
     q:"Explain the difference between the privacy and the integrity of data, and give one method that protects each. [4]",
     model:"Privacy means keeping data confidential so only authorised people can access it; protected by encryption or access control. Integrity means keeping data accurate and unaltered so it stays correct; protected by validation/checksums (and backups to recover correct data). Privacy is 'who can see it'; integrity is 'is it still correct'.",
     scheme:[
       {pt:"Defines privacy as confidentiality / authorised access only", m:1},
       {pt:"Defines integrity as accuracy / data unaltered", m:1},
       {pt:"Valid method for privacy (encryption / access control)", m:1},
       {pt:"Valid method for integrity (validation / checksum / backup)", m:1}
     ]},
    {topic:"SELE 3.4.3", marks:4,
     q:"A town installs CCTV with facial recognition. Discuss it using ALL FOUR lenses: social, ethical, legal, economic. [4]",
     model:"Social: may deter crime but makes citizens feel watched / erodes trust. Ethical: consent and possible bias against certain groups. Legal: collecting and using biometric personal data must comply with the PDPA. Economic: cheaper policing but costs if the data is breached or misused.",
     scheme:[
       {pt:"Social point (safety vs surveillance / trust)", m:1},
       {pt:"Ethical point (consent / bias / fairness)", m:1},
       {pt:"Legal point (PDPA / lawful data collection)", m:1},
       {pt:"Economic point (cost savings vs cost of misuse)", m:1}
     ]},
    {topic:"Impact 3.4.2", marks:4,
     q:"Describe one POSITIVE and one NEGATIVE impact of computing on society, and for each state whether it is a social or an economic impact. [4]",
     model:"Positive (social): easier communication and access to information connect people across distance. Positive (economic): automation and e-commerce raise productivity and create new industries. Negative (social): the digital divide / social isolation. Negative (economic): automation displaces jobs and forces reskilling. A full answer labels each as social or economic.",
     scheme:[
       {pt:"A valid positive impact described", m:1},
       {pt:"Positive impact correctly labelled social or economic", m:1},
       {pt:"A valid negative impact described", m:1},
       {pt:"Negative impact correctly labelled social or economic", m:1}
     ]}
  ]
};
