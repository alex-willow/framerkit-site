export type ResourceType = "article" | "lesson";

export type ResourceItem = {
  slug: string;
  title: string;
  type: ResourceType;
  description: string;
  excerpt: string;
  readTime: string;
  image: string;
  videoPlanned?: boolean;
  seoIntent: string;
  content?: string;
  order?: number;
  category?: string;
  isLocked?: boolean; 
};

export const RESOURCES: ResourceItem[] = [
  {
    slug: "what-to-do-next",
    title: "What to Do Next + FramerKit Workflow Recap",
    type: "lesson",
    order: 24,
    isLocked: true,
    category: "Final Path",
    description: "Understand what to do after learning the basics and how to continue improving your workflow.",
    excerpt: "Review the full workflow and learn how to move forward with real projects.",
    readTime: "6 min",
    image: "https://via.placeholder.com/1280x720?text=Next+Steps",
    videoPlanned: true,
    seoIntent: "framer workflow recap, what to do after learning web design, next steps framer",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          You have learned how to build pages, improve layouts, work with clients, and deliver projects. Now it’s time to understand what to do next and how to keep improving.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Your Workflow</h3>
  
        <p class="docs-text">
          A simple workflow you can follow for every project:
        </p>
  
        <ol class="resource-ordered-list">
          <li>Build structure using sections</li>
          <li>Add content</li>
          <li>Apply styles</li>
          <li>Improve layout</li>
          <li>Make it responsive</li>
          <li>Deliver the project</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: full workflow overview</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">What to Focus On Next</h3>
  
        <p class="docs-text">
          The best way to improve is by doing real work.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Build more projects</li>
          <li>Improve your portfolio</li>
          <li>Work with real clients</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use FramerKit Daily</h3>
  
        <p class="docs-text">
          The more you use FramerKit, the faster and more confident you become.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Use sections for every project</li>
          <li>Use templates to save time</li>
          <li>Build faster with practice</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep It Simple</h3>
  
        <p class="docs-text">
          Don’t overcomplicate your work.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Simple layouts work best</li>
          <li>Clear content is more effective</li>
          <li>Consistency beats complexity</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: multiple completed projects</span>
        </div>
  
        <p class="docs-text">
          You now have a clear path forward and the tools to continue improving and building real projects.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          The next step is simple: keep building, keep improving, and keep moving forward.
        </p>
      </div>
    `,
  },
  {
    slug: "zero-to-first-client",
    title: "From Zero to First Client (Full Path)",
    type: "lesson",
    order: 23,
    isLocked: true,
    category: "Final Path",
    description: "Understand the full path from learning Framer to getting your first client.",
    excerpt: "See how everything connects into one clear workflow from zero to freelance work.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Full+Path",
    videoPlanned: true,
    seoIntent: "learn framer full path, from beginner to freelance web design, first client guide",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          By now, you have learned different parts of building websites with FramerKit. In this lesson, we connect everything into one clear path — from zero to your first client.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Learn the Basics</h3>
  
        <p class="docs-text">
          Start with understanding structure and layout.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Sections and components</li>
          <li>Page structure</li>
          <li>Basic workflow</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Build Simple Pages</h3>
  
        <p class="docs-text">
          Practice by building real pages.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Landing pages</li>
          <li>Portfolio</li>
          <li>Simple layouts</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: early projects</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: Improve Your Skills</h3>
  
        <p class="docs-text">
          Learn how to make your designs better.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Spacing</li>
          <li>Hierarchy</li>
          <li>Content clarity</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 4: Build a Portfolio</h3>
  
        <p class="docs-text">
          Create a simple portfolio with your best work.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: portfolio page</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 5: Find Your First Client</h3>
  
        <p class="docs-text">
          Start small and focus on real projects.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Reach out</li>
          <li>Use your portfolio</li>
          <li>Start with simple projects</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 6: Deliver and Improve</h3>
  
        <p class="docs-text">
          Complete your first project and learn from it.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Follow a clear process</li>
          <li>Communicate with clients</li>
          <li>Improve with each project</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The Key Idea</h3>
  
        <p class="docs-text">
          You don’t need to be perfect. You need to take action and move step by step.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: completed project and client</span>
        </div>
  
        <p class="docs-text">
          You go from learning to building, from building to clients, and from clients to real experience.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          The path is simple: learn → build → improve → get clients → grow.
        </p>
      </div>
    `,
  },
  {
    slug: "build-one-page-website",
    title: "Build a Simple One Page Website",
    type: "lesson",
    order: 15,
    isLocked: true,
    category: "Build Websites",
    description: "Learn how to build a simple and effective one-page website using FramerKit.",
    excerpt: "Create a clean one-page website with a clear structure and flow.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=One+Page+Website",
    videoPlanned: true,
    seoIntent: "one page website framer, simple landing page design, single page layout",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          One-page websites are one of the most common and practical types of projects. In this lesson, you will learn how to build a simple, clean, and effective one-page layout.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why One Page Works</h3>
  
        <p class="docs-text">
          One-page websites are easy to understand and fast to build.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Simple structure</li>
          <li>Clear flow</li>
          <li>Fast development</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Structure</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: one-page layout structure</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Hero</li>
          <li>Features</li>
          <li>About</li>
          <li>Testimonials</li>
          <li>CTA</li>
          <li>Footer</li>
        </ol>
  
        <p class="docs-text">
          Keep everything in a clear vertical flow.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep It Focused</h3>
  
        <p class="docs-text">
          Don’t try to add too much content.
        </p>
  
        <ol class="resource-ordered-list">
          <li>One main message</li>
          <li>One goal</li>
          <li>One primary action</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use Sections Wisely</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: section selection</span>
        </div>
  
        <p class="docs-text">
          Choose sections that support your message.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles</h3>
  
        <p class="docs-text">
          Use Color Sets and Text Styles to make the page consistent.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final one-page website</span>
        </div>
  
        <p class="docs-text">
          You create a simple, clear, and effective website ready for real use.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Simplicity is powerful. A focused one-page site often performs better than complex layouts.
        </p>
      </div>
    `,
  },
  {
    slug: "build-app-landing-page",
    title: "Build an App Landing Page",
    type: "lesson",
    order: 14,
    isLocked: true,
    category: "Build Websites",
    description: "Learn how to build a modern app landing page using FramerKit.",
    excerpt: "Create a clean app landing page that highlights features and drives downloads.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=App+Landing",
    videoPlanned: true,
    seoIntent: "app landing page framer, mobile app website design, app landing layout",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          App landing pages focus on clarity, visuals, and simplicity. In this lesson, you will build a landing page that showcases an app and encourages users to download it.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">App Page Structure</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: app landing structure</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Hero with app preview</li>
          <li>Features</li>
          <li>Screenshots</li>
          <li>Benefits</li>
          <li>CTA (download)</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Focus on Visuals</h3>
  
        <p class="docs-text">
          App pages rely heavily on visuals.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: app mockups</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Use clean screenshots</li>
          <li>Highlight UI</li>
          <li>Keep layout simple</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep Content Short</h3>
  
        <p class="docs-text">
          Users don’t want to read long explanations.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Short headlines</li>
          <li>Simple descriptions</li>
          <li>Clear benefits</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Strong CTA</h3>
  
        <p class="docs-text">
          The goal is to drive downloads.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: download CTA</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>App Store / Google Play buttons</li>
          <li>Clear action</li>
          <li>Visible placement</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final app page</span>
        </div>
  
        <p class="docs-text">
          You create a clean and focused app landing page ready for real users.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          App pages are about simplicity and visuals. Keep everything focused on the product.
        </p>
      </div>
    `,
  },
  {
    slug: "build-faster-with-templates",
    title: "Build Faster with Templates (Pro Workflow)",
    type: "lesson",
    order: 22,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn how to use templates to build websites even faster using a professional workflow.",
    excerpt: "Understand how to combine templates and sections for maximum speed.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Pro+Workflow",
    videoPlanned: true,
    seoIntent: "framer templates workflow, build faster framer templates, framerkit templates usage",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Templates are one of the fastest ways to build websites in FramerKit. Instead of starting from scratch, you begin with a complete structure and customize it.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Templates Are Powerful</h3>
  
        <p class="docs-text">
          Templates remove the need to think about layout from the beginning.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Pre-built structure</li>
          <li>Proven layout flow</li>
          <li>Faster starting point</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Start with a Template</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: template preview</span>
        </div>
  
        <p class="docs-text">
          Choose a template that matches your goal.
        </p>
  
        <ol class="resource-ordered-list">
          <li>SaaS</li>
          <li>Portfolio</li>
          <li>Agency</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Customize Sections</h3>
  
        <p class="docs-text">
          Templates are flexible — you can replace sections easily.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: replacing sections</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Remove sections you don’t need</li>
          <li>Add new sections from the library</li>
          <li>Adjust layout</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles</h3>
  
        <p class="docs-text">
          Use Color Sets and Text Styles to unify the design.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Apply colors</li>
          <li>Apply typography</li>
        </ol>
  
        <p class="docs-text">
          This makes your template look custom instantly.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Combine Templates + Sections</h3>
  
        <p class="docs-text">
          The most powerful workflow is combining both.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Start with template</li>
          <li>Modify with sections</li>
          <li>Adjust content</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final customized template</span>
        </div>
  
        <p class="docs-text">
          You build high-quality websites in a fraction of the time.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Templates are not limiting — they are a starting point for faster and smarter work.
        </p>
      </div>
    `,
  },
  {
    slug: "deliver-projects-without-revisions",
    title: "How to Deliver Projects (Without Endless Revisions)",
    type: "lesson",
    order: 21,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn how to deliver projects smoothly and avoid endless revisions.",
    excerpt: "Understand how to structure your process to keep projects under control.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Project+Delivery",
    videoPlanned: true,
    seoIntent: "freelance project delivery, avoid revisions web design, client revisions problem",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Many freelancers struggle with endless revisions. Projects drag on, clients keep asking for changes, and the process becomes stressful. This lesson will help you avoid that.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Revisions Never End</h3>
  
        <p class="docs-text">
          Endless revisions usually happen because the process is unclear.
        </p>
  
        <ol class="resource-ordered-list">
          <li>No clear structure</li>
          <li>No defined steps</li>
          <li>No limits</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Define the Process</h3>
  
        <p class="docs-text">
          A clear process solves most problems.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Step 1: Structure approval</li>
          <li>Step 2: Design approval</li>
          <li>Step 3: Final delivery</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: project stages</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Limit Revisions</h3>
  
        <p class="docs-text">
          Always define revision limits before starting.
        </p>
  
        <ol class="resource-ordered-list">
          <li>1–2 revision rounds</li>
          <li>Clear feedback only</li>
          <li>No endless changes</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Get Approval Early</h3>
  
        <p class="docs-text">
          Don’t wait until the end to show your work.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Show structure first</li>
          <li>Confirm direction</li>
          <li>Then continue</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: early feedback</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Stay in Control</h3>
  
        <p class="docs-text">
          You are responsible for guiding the project.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Set boundaries</li>
          <li>Keep communication clear</li>
          <li>Avoid scope creep</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: completed project delivery</span>
        </div>
  
        <p class="docs-text">
          Projects become smoother, faster, and less stressful.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          A clear process protects your time and improves your results.
        </p>
      </div>
    `,
  },
  {
    slug: "how-to-talk-to-clients",
    title: "How to Talk to Clients (Without Stress)",
    type: "lesson",
    order: 20,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn how to communicate with clients clearly and confidently.",
    excerpt: "Understand how to talk to clients, ask the right questions, and avoid confusion.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Client+Communication",
    videoPlanned: true,
    seoIntent: "freelance client communication, talk to clients web design, client questions web design",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Communication is just as important as design. Many beginners lose projects not because of their skills, but because they don’t know how to talk to clients.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Communication Matters</h3>
  
        <p class="docs-text">
          Clear communication builds trust and avoids misunderstandings.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Clients understand what you are doing</li>
          <li>Projects run smoother</li>
          <li>Fewer revisions and problems</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Ask Simple Questions</h3>
  
        <p class="docs-text">
          You don’t need complicated questions. Keep it simple.
        </p>
  
        <ol class="resource-ordered-list">
          <li>What is the goal of the website?</li>
          <li>Who is the target audience?</li>
          <li>What action should users take?</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: simple client brief</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep It Clear</h3>
  
        <p class="docs-text">
          Avoid complex explanations.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Use simple language</li>
          <li>Avoid technical terms</li>
          <li>Be direct</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Set Expectations</h3>
  
        <p class="docs-text">
          Always explain what will happen next.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Timeline</li>
          <li>Deliverables</li>
          <li>Revisions</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: project timeline example</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Show Progress</h3>
  
        <p class="docs-text">
          Don’t disappear during the project.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Share updates</li>
          <li>Show early versions</li>
          <li>Ask for feedback</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Stay Confident</h3>
  
        <p class="docs-text">
          Clients trust you because you are the expert.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Don’t over-explain</li>
          <li>Don’t apologize for everything</li>
          <li>Guide the process</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: smooth project communication</span>
        </div>
  
        <p class="docs-text">
          Projects become easier, clients trust you more, and you feel more confident.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Good communication is simple, clear, and consistent.
        </p>
      </div>
    `,
  },
  {
    slug: "how-to-price-work",
    title: "How to Price Your Work",
    type: "lesson",
    order: 19,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn how to price your web design work correctly as a beginner.",
    excerpt: "Understand how to set prices, avoid underpricing, and grow your income.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Pricing",
    videoPlanned: true,
    seoIntent: "how to price web design, freelance pricing beginner, web design rates",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Pricing your work is one of the hardest parts of freelance. Many beginners undervalue their work and lose money. In this lesson, you will learn how to approach pricing in a simple and practical way.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Pricing Feels Difficult</h3>
  
        <p class="docs-text">
          Beginners often struggle because they don’t know what their work is worth.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Lack of confidence</li>
          <li>No clear benchmarks</li>
          <li>Fear of losing clients</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Start with Simple Pricing</h3>
  
        <p class="docs-text">
          Don’t overcomplicate pricing at the beginning.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Set a fixed price for simple websites</li>
          <li>Keep projects small</li>
          <li>Focus on getting experience</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: simple pricing example</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Think in Value, Not Time</h3>
  
        <p class="docs-text">
          Clients don’t pay for hours — they pay for results.
        </p>
  
        <ol class="resource-ordered-list">
          <li>A website that helps business</li>
          <li>A clean and professional design</li>
          <li>A fast delivery</li>
        </ol>
  
        <p class="docs-text">
          The better the result, the higher the value.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Avoid Underpricing</h3>
  
        <p class="docs-text">
          Charging too little creates problems.
        </p>
  
        <ol class="resource-ordered-list">
          <li>You feel undervalued</li>
          <li>Clients don’t take you seriously</li>
          <li>You burn out faster</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Increase Prices Gradually</h3>
  
        <p class="docs-text">
          You don’t need to jump to high prices immediately.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Start small</li>
          <li>Gain experience</li>
          <li>Increase your price step by step</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: pricing growth</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: completed paid project</span>
        </div>
  
        <p class="docs-text">
          You understand how to price your work confidently and grow your income over time.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Pricing is a skill. The more projects you complete, the better you will understand your value.
        </p>
      </div>
    `,
  },
  {
    slug: "find-first-clients",
    title: "How to Find Your First Clients",
    type: "lesson",
    order: 18,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn simple ways to find your first freelance clients using your skills.",
    excerpt: "Understand where to look for clients and how to get your first projects.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Find+Clients",
    videoPlanned: true,
    seoIntent: "find freelance clients web design, first client web designer, freelance beginners guide",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          One of the biggest challenges for beginners is not building websites — it’s finding clients. In this lesson, you will learn simple and realistic ways to get your first projects.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Start Simple</h3>
  
        <p class="docs-text">
          Your first clients will not come from complex strategies. Start with what you already have.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Friends and acquaintances</li>
          <li>Local businesses</li>
          <li>Small personal projects</li>
        </ol>
  
        <p class="docs-text">
          Focus on getting experience, not perfection.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use Your Portfolio</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: portfolio example</span>
        </div>
  
        <p class="docs-text">
          Even a simple portfolio can help you get your first client.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Show 2–3 projects</li>
          <li>Keep it clean and simple</li>
          <li>Highlight your best work</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Reach Out Directly</h3>
  
        <p class="docs-text">
          Don’t wait for clients to find you.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Contact small businesses</li>
          <li>Offer to improve their website</li>
          <li>Keep your message short</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: simple outreach message</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use Platforms</h3>
  
        <p class="docs-text">
          Freelance platforms can help you get started.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Upwork</li>
          <li>Fiverr</li>
          <li>Freelance marketplaces</li>
        </ol>
  
        <p class="docs-text">
          Start small and build reviews.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Focus on Speed</h3>
  
        <p class="docs-text">
          Your advantage as a beginner is speed and flexibility.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Deliver faster than others</li>
          <li>Communicate clearly</li>
          <li>Keep projects simple</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: completed client project</span>
        </div>
  
        <p class="docs-text">
          You get your first clients, gain experience, and start building confidence.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Getting your first client is not about being perfect — it’s about taking action.
        </p>
      </div>
    `,
  },
  {
    slug: "framerkit-for-freelance",
    title: "How to Use FramerKit for Freelance Work",
    type: "lesson",
    order: 17,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn how to use FramerKit to complete freelance projects faster and more efficiently.",
    excerpt: "Understand how to build client websites quickly and deliver better results.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Freelance+Work",
    videoPlanned: true,
    seoIntent: "framer freelance work, build client websites fast, framerkit freelance workflow",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          FramerKit is not just a design tool — it can significantly improve your freelance workflow. In this lesson, you will learn how to use it to complete projects faster and deliver better results.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The Problem with Freelance Work</h3>
  
        <p class="docs-text">
          Many freelancers spend too much time on repetitive tasks.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Designing layouts from scratch</li>
          <li>Fixing styles repeatedly</li>
          <li>Spending too long on small details</li>
        </ol>
  
        <p class="docs-text">
          This reduces your profit and slows down your growth.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The FramerKit Advantage</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: FramerKit library workflow</span>
        </div>
  
        <p class="docs-text">
          FramerKit allows you to focus on structure and content instead of rebuilding layouts every time.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Use ready sections</li>
          <li>Apply styles instantly</li>
          <li>Build pages much faster</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Typical Workflow</h3>
  
        <p class="docs-text">
          A simple freelance workflow using FramerKit:
        </p>
  
        <ol class="resource-ordered-list">
          <li>Choose a structure (template or sections)</li>
          <li>Build layout quickly</li>
          <li>Replace content</li>
          <li>Apply styles</li>
          <li>Polish and deliver</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: fast build process</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Save Time on Every Project</h3>
  
        <p class="docs-text">
          Instead of spending hours on layout, you can focus on what matters:
        </p>
  
        <ol class="resource-ordered-list">
          <li>Client goals</li>
          <li>Content</li>
          <li>Final polish</li>
        </ol>
  
        <p class="docs-text">
          This allows you to take more projects or finish work faster.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Clients Benefit</h3>
  
        <p class="docs-text">
          Faster workflow also improves the client experience.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Faster delivery</li>
          <li>Cleaner design</li>
          <li>More consistent results</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: finished client website</span>
        </div>
  
        <p class="docs-text">
          You can deliver high-quality websites faster and grow your freelance work more efficiently.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          The goal is not to work more — it’s to work smarter and deliver results faster.
        </p>
      </div>
    `,
  },
  {
    slug: "speed-tricks-framer",
    title: "Speed Tricks: Work 2x Faster in Framer",
    type: "lesson",
    order: 16,
    isLocked: true,
    category: "Freelance & Money",
    description: "Learn simple tricks that help you build pages much faster in Framer.",
    excerpt: "Speed up your workflow by removing unnecessary steps and using smart habits.",
    readTime: "6 min",
    image: "https://via.placeholder.com/1280x720?text=Speed+Tricks",
    videoPlanned: true,
    seoIntent: "framer speed tips, design faster framer, workflow optimization framer",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Speed is one of the biggest advantages of working with FramerKit. Small changes in your workflow can save hours of work.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why You Feel Slow</h3>
  
        <p class="docs-text">
          Most beginners work slowly because they repeat unnecessary steps.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Building sections from scratch</li>
          <li>Changing styles manually</li>
          <li>Fixing layouts again and again</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use Ready Sections</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: selecting sections from library</span>
        </div>
  
        <p class="docs-text">
          Don’t build layouts manually. Use ready-made sections and focus on structure.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Start with Wireframe</h3>
  
        <p class="docs-text">
          Wireframe sections help you build faster without distractions.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: wireframe layout</span>
        </div>
  
        <p class="docs-text">
          Focus on layout first, then design.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles Once</h3>
  
        <p class="docs-text">
          Don’t style everything manually.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Apply Color Set</li>
          <li>Apply Text Styles</li>
        </ol>
  
        <p class="docs-text">
          This instantly updates your entire page.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Reuse Sections</h3>
  
        <p class="docs-text">
          Don’t rebuild the same layouts again.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: duplicated section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Copy existing sections</li>
          <li>Adjust content</li>
          <li>Save time</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep It Simple</h3>
  
        <p class="docs-text">
          Complex layouts slow you down.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Use simple structures</li>
          <li>Avoid over-design</li>
          <li>Focus on clarity</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: fast workflow result</span>
        </div>
  
        <p class="docs-text">
          You build faster, make fewer mistakes, and complete projects quicker.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Speed comes from removing unnecessary work, not from working harder.
        </p>
      </div>
    `,
  },

  {
    slug: "build-agency-website",
    title: "Build an Agency Website",
    type: "lesson",
    order: 13,
    isLocked: true,
    category: "Build Websites",
    description: "Learn how to build a professional agency website using FramerKit.",
    excerpt: "Create an agency website that looks clean, structured, and trustworthy.",
    readTime: "9 min",
    image: "https://via.placeholder.com/1280x720?text=Agency+Website",
    videoPlanned: true,
    seoIntent: "agency website framer, build agency site, web design agency layout",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          In this lesson, you will build an agency website focused on clarity, trust, and strong presentation. Agency websites must communicate expertise and reliability.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Agency Structure</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: agency page structure</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Navbar</li>
          <li>Hero</li>
          <li>Services</li>
          <li>Projects / case studies</li>
          <li>Testimonials</li>
          <li>CTA</li>
          <li>Footer</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Strong Hero</h3>
  
        <p class="docs-text">
          Your hero should clearly explain what your agency does.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: agency hero</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Clear positioning</li>
          <li>Simple message</li>
          <li>Primary CTA</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Services Section</h3>
  
        <p class="docs-text">
          Explain what you offer in a structured way.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: services section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Clear service titles</li>
          <li>Short descriptions</li>
          <li>Focused layout</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: Show Work</h3>
  
        <p class="docs-text">
          Show your projects or case studies to demonstrate experience.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: projects section</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 4: Build Trust</h3>
  
        <p class="docs-text">
          Trust is critical for agencies.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: testimonials</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Testimonials</li>
          <li>Client logos</li>
          <li>Numbers or results</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 5: CTA</h3>
  
        <p class="docs-text">
          Guide users to contact or start a project.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: CTA section</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles</h3>
  
        <p class="docs-text">
          Use Color Sets and Text Styles to keep your design consistent and professional.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final agency page</span>
        </div>
  
        <p class="docs-text">
          You now have a structured agency website that builds trust and presents your services clearly.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Agency websites are about clarity, structure, and trust. Keep everything simple and focused.
        </p>
      </div>
    `,
  },
  {
    slug: "build-portfolio-website",
    title: "Build a Portfolio Website",
    type: "lesson",
    order: 12,
    isLocked: true,
    category: "Build Websites",
    description: "Learn how to build a clean and modern portfolio website using FramerKit.",
    excerpt: "Create a portfolio that showcases your work and builds trust.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Portfolio+Website",
    videoPlanned: true,
    seoIntent: "portfolio website framer, build portfolio website, designer portfolio layout",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          In this lesson, you will build a portfolio website that presents your work clearly and professionally. The goal is to create a simple structure that highlights your projects and builds trust.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Portfolio Structure</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: portfolio page structure</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Navbar</li>
          <li>Hero (intro about you)</li>
          <li>Projects / work section</li>
          <li>About section</li>
          <li>Testimonials (optional)</li>
          <li>CTA / contact</li>
          <li>Footer</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Hero Section</h3>
  
        <p class="docs-text">
          Start with a simple introduction.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: portfolio hero</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Your name or role</li>
          <li>Short description</li>
          <li>CTA (view work / contact)</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Show Your Work</h3>
  
        <p class="docs-text">
          Your projects are the most important part of your portfolio.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: project grid</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Use clean project cards</li>
          <li>Keep titles short</li>
          <li>Show visuals clearly</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: About Section</h3>
  
        <p class="docs-text">
          Tell users who you are and what you do.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: about section</span>
        </div>
  
        <p class="docs-text">
          Keep it short and focused.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 4: Add Trust</h3>
  
        <p class="docs-text">
          Add testimonials or client logos if you have them.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: testimonials</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 5: Contact / CTA</h3>
  
        <p class="docs-text">
          Make it easy for people to contact you.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: contact section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Clear CTA</li>
          <li>Email or form</li>
          <li>Simple message</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles</h3>
  
        <p class="docs-text">
          Use Color Sets and Text Styles to keep your portfolio clean and consistent.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final portfolio page</span>
        </div>
  
        <p class="docs-text">
          You now have a clean portfolio that clearly presents your work and builds trust.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          A good portfolio is simple, focused, and easy to understand. Let your work speak for itself.
        </p>
      </div>
    `,
  },
  {
    slug: "build-saas-landing-page",
    title: "Build a SaaS Landing Page",
    type: "lesson",
    order: 11,
    isLocked: true,
    category: "Build Websites",
    description: "Learn how to build a modern SaaS landing page using FramerKit.",
    excerpt: "Create a clean SaaS landing page with proper structure and flow.",
    readTime: "9 min",
    image: "https://via.placeholder.com/1280x720?text=SaaS+Landing",
    videoPlanned: true,
    seoIntent: "saas landing page framer, build saas website, framerkit saas layout",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          In this lesson, you will build a modern SaaS landing page using FramerKit sections. The goal is to create a clear and structured page that explains your product and drives conversions.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Page Structure</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: SaaS page structure overview</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Navbar</li>
          <li>Hero</li>
          <li>Feature sections</li>
          <li>Product preview</li>
          <li>Testimonials</li>
          <li>Pricing</li>
          <li>CTA</li>
          <li>Footer</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Add Hero Section</h3>
  
        <p class="docs-text">
          Start with a strong hero that clearly explains your product.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: SaaS hero section</span>
        </div>
  
        <p class="docs-text">
          Keep the headline simple and focused on value.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Add Features</h3>
  
        <p class="docs-text">
          Use feature sections to explain what your product does.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: feature sections</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Short titles</li>
          <li>Clear benefits</li>
          <li>Simple layout</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: Show Product</h3>
  
        <p class="docs-text">
          Add a product preview section to demonstrate how your product works.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: product preview section</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 4: Add Testimonials</h3>
  
        <p class="docs-text">
          Build trust with testimonials or logos.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: testimonials</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 5: Add Pricing</h3>
  
        <p class="docs-text">
          Clearly present your pricing options.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: pricing section</span>
        </div>
  
        <p class="docs-text">
          Highlight the main plan.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 6: Add Final CTA</h3>
  
        <p class="docs-text">
          End the page with a strong call to action.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: CTA section</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles</h3>
  
        <p class="docs-text">
          Apply Color Sets and Text Styles to make everything consistent.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final SaaS landing page</span>
        </div>
  
        <p class="docs-text">
          You now have a complete SaaS landing page ready to customize.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          SaaS pages are all about clarity, trust, and structure. Keep it simple and focused.
        </p>
      </div>
    `,
  },
  {
    slug: "common-mistakes-framer",
    title: "Common Mistakes Beginners Make in Framer",
    type: "lesson",
    order: 10,
    isLocked: true,
    category: "Core Skills",
    description: "Avoid the most common mistakes when building pages in Framer.",
    excerpt: "Learn what beginners do wrong and how to fix it quickly.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Common+Mistakes",
    videoPlanned: true,
    seoIntent: "framer mistakes beginners, web design mistakes, landing page errors",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Most beginners struggle not because Framer is difficult, but because they repeat the same mistakes. In this lesson, you will learn how to avoid them.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Mistake 1: Random Sections</h3>
  
        <p class="docs-text">
          Adding sections without thinking about structure creates messy layouts.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: random layout</span>
        </div>
  
        <p class="docs-text">
          Always follow a logical flow: Hero → Features → Trust → CTA.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Mistake 2: Too Much Content</h3>
  
        <p class="docs-text">
          Beginners often try to explain everything at once.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Long paragraphs</li>
          <li>Too many sections</li>
          <li>No clear focus</li>
        </ol>
  
        <p class="docs-text">
          Keep your content simple and focused.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Mistake 3: Ignoring Spacing</h3>
  
        <p class="docs-text">
          Inconsistent spacing makes designs feel unprofessional.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: bad spacing</span>
        </div>
  
        <p class="docs-text">
          Use consistent spacing between sections and elements.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Mistake 4: No Visual Hierarchy</h3>
  
        <p class="docs-text">
          If everything looks the same, users don’t know what to focus on.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: poor hierarchy</span>
        </div>
  
        <p class="docs-text">
          Use headings, spacing, and contrast to guide attention.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Mistake 5: Skipping Mobile</h3>
  
        <p class="docs-text">
          Designing only for desktop leads to broken layouts on mobile.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: broken mobile layout</span>
        </div>
  
        <p class="docs-text">
          Always check and adjust your layout for mobile.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Mistake 6: Overcomplicating Design</h3>
  
        <p class="docs-text">
          Trying to make everything “unique” often makes the design worse.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Too many styles</li>
          <li>Too many colors</li>
          <li>Too many layout variations</li>
        </ol>
  
        <p class="docs-text">
          Simplicity creates better results.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: clean improved layout</span>
        </div>
  
        <p class="docs-text">
          By avoiding these mistakes, your pages will instantly look cleaner and more professional.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Improving your design is not about adding more — it's about removing mistakes.
        </p>
      </div>
    `,
  },
  {
    slug: "speed-workflow-build-fast",
    title: "Speed Workflow: Build Pages in Minutes",
    type: "lesson",
    order: 9,
    isLocked: true,
    category: "Core Skills",
    description: "Learn how to build pages extremely fast using FramerKit workflow.",
    excerpt: "Understand how to reduce build time and create pages in minutes instead of hours.",
    readTime: "6 min",
    image: "https://via.placeholder.com/1280x720?text=Speed+Workflow",
    videoPlanned: true,
    seoIntent: "build website fast framer, framerkit workflow speed, fast landing page design",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          One of the biggest advantages of FramerKit is speed. Instead of building layouts from scratch, you can assemble full pages in minutes.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The Problem</h3>
  
        <p class="docs-text">
          Building pages manually takes time and effort.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Designing each section from scratch</li>
          <li>Adjusting spacing and layout</li>
          <li>Fixing styles repeatedly</li>
        </ol>
  
        <p class="docs-text">
          This slows down your workflow and makes projects harder to finish.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The FramerKit Approach</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: selecting sections from library</span>
        </div>
  
        <p class="docs-text">
          FramerKit allows you to skip repetitive work and focus on building structure.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Choose sections</li>
          <li>Copy into project</li>
          <li>Adjust content</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Build Structure Fast</h3>
  
        <p class="docs-text">
          Start by assembling your layout using ready-made sections.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: quick layout assembly</span>
        </div>
  
        <p class="docs-text">
          Focus on structure, not details.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Apply Styles</h3>
  
        <p class="docs-text">
          Apply Color Sets and Text Styles in seconds.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Apply colors</li>
          <li>Apply typography</li>
        </ol>
  
        <p class="docs-text">
          This step instantly makes your page look polished.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: Adjust Content</h3>
  
        <p class="docs-text">
          Replace placeholder content with your own text.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: editing content</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: finished page in short time</span>
        </div>
  
        <p class="docs-text">
          You can build complete pages in minutes instead of hours.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Speed is not about rushing — it's about removing unnecessary work and focusing on what matters.
        </p>
      </div>
    `,
  },
  {
    slug: "wireframe-design-dark-modes",
    title: "Wireframe, Design, Dark: Choose the Right Version",
    type: "lesson",
    order: 8,
    isLocked: true,
    category: "Core Skills",
    description: "Learn how to choose between wireframe, design, and dark versions in FramerKit.",
    excerpt: "Understand when to use each version to work faster and build better pages.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Wireframe+Design+Dark",
    videoPlanned: true,
    seoIntent: "framer wireframe vs design, dark ui framerkit, section versions framer",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          FramerKit provides multiple versions of the same sections: Wireframe, Design, and Dark. Understanding how to use them correctly will significantly speed up your workflow.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">What Are These Versions?</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: same section in wireframe, design, and dark</span>
        </div>
  
        <p class="docs-text">
          Each section exists in different visual states, but the structure remains the same.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Wireframe — minimal and clean structure</li>
          <li>Design — fully styled section with visuals</li>
          <li>Dark — ready-to-use dark version</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">When to Use Wireframe</h3>
  
        <p class="docs-text">
          Wireframe is best for fast layout building.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: wireframe sections layout</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Building structure quickly</li>
          <li>Planning page flow</li>
          <li>Working without visual distractions</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">When to Use Design</h3>
  
        <p class="docs-text">
          Design version helps you see the final look of the page.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: styled design section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Presenting ideas</li>
          <li>Building visually ready pages</li>
          <li>Working with real content</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">When to Use Dark Version</h3>
  
        <p class="docs-text">
          Dark versions are not generated — they are designed separately and ready to use.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: dark version section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Building dark-themed websites</li>
          <li>Creating contrast-heavy layouts</li>
          <li>Using modern UI styles</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Best Workflow</h3>
  
        <p class="docs-text">
          The most efficient way to use FramerKit is to combine these versions.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Start with Wireframe to build structure</li>
          <li>Switch to Design for visual layout</li>
          <li>Use Dark if your project requires it</li>
        </ol>
  
        <p class="docs-text">
          This approach gives you both speed and flexibility.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final page using chosen versions</span>
        </div>
  
        <p class="docs-text">
          You build faster and make better design decisions by choosing the right version from the start.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          FramerKit is designed to give you options — the key is knowing when to use each one.
        </p>
      </div>
    `,
  },
  {
    slug: "improve-page-small-changes",
    title: "Improve Your Page: Small Changes That Make a Big Difference",
    type: "lesson",
    order: 7,
    isLocked: true,
    category: "Core Skills",
    description: "Learn how small improvements can make your page look more professional and polished.",
    excerpt: "Understand what details separate basic layouts from high-quality designs.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Improve+Your+Page",
    videoPlanned: true,
    seoIntent: "improve web design, ui polish tips, better landing page design",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          A page can be structured correctly but still feel unfinished. The difference between an average layout and a professional one often comes down to small details.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Pages Feel Unfinished</h3>
  
        <p class="docs-text">
          Even good layouts can feel off when small details are ignored.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Inconsistent spacing</li>
          <li>Weak visual hierarchy</li>
          <li>Unbalanced sections</li>
        </ol>
  
        <p class="docs-text">
          Fixing these details instantly improves the quality of your design.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Fix Spacing</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: bad vs good spacing</span>
        </div>
  
        <p class="docs-text">
          Spacing is one of the most important visual signals.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Keep equal spacing between sections</li>
          <li>Avoid random gaps</li>
          <li>Use consistent padding</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Improve Hierarchy</h3>
  
        <p class="docs-text">
          Users should instantly understand what is important.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: heading hierarchy</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Strong headings</li>
          <li>Clear subheadings</li>
          <li>Readable body text</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Align Elements</h3>
  
        <p class="docs-text">
          Misaligned elements make layouts feel unprofessional.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: alignment example</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Align text and buttons</li>
          <li>Keep consistent margins</li>
          <li>Avoid visual noise</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use Contrast</h3>
  
        <p class="docs-text">
          Contrast helps highlight important elements.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: contrast example</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Highlight CTA buttons</li>
          <li>Use color differences</li>
          <li>Separate sections visually</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: polished layout</span>
        </div>
  
        <p class="docs-text">
          Small improvements make your page look more professional and trustworthy.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Good design is built on details. Small changes can completely transform how your page feels.
        </p>
      </div>
    `,
  },
  {
    slug: "content-and-copy-sections",
    title: "Content & Copy: What to Write in Your Sections",
    type: "lesson",
    order: 6,
    isLocked: true,
    category: "Core Skills",
    description: "Learn what to write in each section so your page feels clear and professional.",
    excerpt: "Understand how to write simple and effective content for your layouts.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Content+and+Copy",
    videoPlanned: true,
    seoIntent: "landing page copywriting, what to write landing page, website content structure",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          A good layout is not enough. Even a well-designed page can fail if the content is unclear or too complicated.
        </p>
        <p class="docs-text">
          In this lesson, you will learn what to write in each section to make your page clear, simple, and effective.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Content Matters</h3>
  
        <p class="docs-text">
          Users don’t read everything. They scan quickly and decide in seconds.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Too much text → users skip</li>
          <li>Unclear message → users leave</li>
          <li>No focus → no action</li>
        </ol>
  
        <p class="docs-text">
          Good content is short, clear, and focused.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Hero Section</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: hero section example</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>One clear headline</li>
          <li>Short supporting text</li>
          <li>Primary CTA</li>
        </ol>
  
        <p class="docs-text">
          The goal is simple: explain what this is in one sentence.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Feature Section</h3>
  
        <p class="docs-text">
          This section explains why your product matters.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: feature section example</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Short feature titles</li>
          <li>Simple descriptions</li>
          <li>Focus on value, not features</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Social Proof</h3>
  
        <p class="docs-text">
          Users need trust before taking action.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: testimonials or logos</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Testimonials</li>
          <li>Client logos</li>
          <li>Numbers (users, revenue, etc.)</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">CTA Section</h3>
  
        <p class="docs-text">
          The call to action tells users what to do next.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: CTA section example</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Clear action text</li>
          <li>Simple message</li>
          <li>One main action</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep It Simple</h3>
  
        <p class="docs-text">
          Most beginners try to write too much.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Short sentences work better</li>
          <li>Avoid complex words</li>
          <li>Focus on clarity</li>
        </ol>
  
        <p class="docs-text">
          Simple content is easier to read and more effective.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: clean page with clear content</span>
        </div>
  
        <p class="docs-text">
          Your page becomes easier to understand, and users know exactly what to do.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Good content is not about writing more — it’s about saying the right thing in the simplest way.
        </p>
      </div>
    `,
  },
  {
    slug: "navbar-to-cta-flow",
    title: "Navbar to CTA: Guide Users Through Your Page",
    type: "lesson",
    order: 5,
    isLocked: true,
    category: "Getting Started",
    description: "Learn how to structure your page so users clearly understand what to do and where to click.",
    excerpt: "Understand how to guide users from the first screen to the final action.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Navbar+to+CTA",
    videoPlanned: true,
    seoIntent: "landing page structure ux, navbar to cta flow, conversion design framer",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          A good page is not just a collection of sections. It is a guided experience that leads users from the first impression to a clear action.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Flow Matters</h3>
  
        <p class="docs-text">
          Users don’t read pages randomly. They scan and decide quickly whether to stay or leave.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Confusing layout → users leave</li>
          <li>No clear action → no clicks</li>
          <li>Weak structure → low conversion</li>
        </ol>
  
        <p class="docs-text">
          A clear flow solves this problem.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The Ideal Flow</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: page flow from navbar to CTA</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Navbar — navigation and first action</li>
          <li>Hero — explain what this is</li>
          <li>Feature — explain why it matters</li>
          <li>Social proof — build trust</li>
          <li>CTA — guide user to action</li>
        </ol>
  
        <p class="docs-text">
          Each section has a clear role in guiding the user forward.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Navbar: Keep It Simple</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: simple navbar with one primary button</span>
        </div>
  
        <p class="docs-text">
          Your navbar should not overwhelm the user.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Limit number of links</li>
          <li>Use one primary CTA button</li>
          <li>Keep it clean and readable</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Hero: First Impression</h3>
  
        <p class="docs-text">
          The hero section must instantly explain what your product or service is.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: strong hero section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Clear headline</li>
          <li>Short description</li>
          <li>Primary CTA</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Build Trust</h3>
  
        <p class="docs-text">
          Users need to trust your product before taking action.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: testimonials or logos</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Testimonials</li>
          <li>Client logos</li>
          <li>Numbers or metrics</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">CTA: Make It Clear</h3>
  
        <p class="docs-text">
          The call to action should be obvious and easy to follow.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: strong CTA section</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Clear action text</li>
          <li>Visible button</li>
          <li>No confusion</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: clean user flow from top to bottom</span>
        </div>
  
        <p class="docs-text">
          Users understand your page, trust your product, and know exactly what to do next.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Good design is not just visual — it guides users toward action. A clear flow turns visitors into users.
        </p>
      </div>
    `,
  },
  {
    slug: "responsive-layout-framer",
    title: "Responsive Layout in Framer: Make Your Design Work Everywhere",
    type: "lesson",
    order: 4,
    isLocked: true,
    category: "Getting Started",
    description: "Learn how to make your layouts responsive and look good on all screen sizes.",
    excerpt: "Understand how to adapt your design for desktop, tablet, and mobile in Framer.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Responsive+Layout",
    videoPlanned: true,
    seoIntent: "framer responsive design, framer mobile layout, adaptive design framer",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          A good layout is not only about how it looks on desktop. It must work across all screen sizes, from large monitors to mobile devices.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Responsive Design Matters</h3>
  
        <p class="docs-text">
          Most users will see your site on mobile. If your layout breaks, users leave.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Text becomes unreadable</li>
          <li>Elements overlap</li>
          <li>Buttons are hard to click</li>
        </ol>
  
        <p class="docs-text">
          Responsive design ensures your layout works everywhere.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Breakpoints in Framer</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Desktop / Tablet / Mobile preview switch</span>
        </div>
  
        <p class="docs-text">
          Framer allows you to preview your design across different breakpoints.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Desktop — main layout</li>
          <li>Tablet — medium screens</li>
          <li>Mobile — small screens</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Start with Desktop</h3>
  
        <p class="docs-text">
          Always design your layout for desktop first.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Desktop layout</span>
        </div>
  
        <p class="docs-text">
          Focus on structure and spacing before thinking about smaller screens.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Adjust for Tablet</h3>
  
        <p class="docs-text">
          Tablet layouts usually require small adjustments.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Reduce spacing</li>
          <li>Stack columns</li>
          <li>Simplify layouts</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Tablet layout changes</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: Optimize for Mobile</h3>
  
        <p class="docs-text">
          Mobile layouts require more attention because of limited space.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Stack everything vertically</li>
          <li>Increase text readability</li>
          <li>Make buttons larger</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Mobile layout</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep It Simple</h3>
  
        <p class="docs-text">
          The simpler your layout, the easier it is to make it responsive.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Avoid complex nested layouts</li>
          <li>Use consistent spacing</li>
          <li>Stick to simple structures</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: same layout across all devices</span>
        </div>
  
        <p class="docs-text">
          Your layout works smoothly across all devices and looks clean everywhere.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Responsive design is not about fixing layouts — it's about building them correctly from the start.
        </p>
      </div>
    `,
  },
  {
    slug: "combine-sections-better-layouts",
    title: "Combine Sections: Build Better Layouts",
    type: "lesson",
    order: 3,
    isLocked: true,
    category: "Getting Started",
    description: "Learn how to combine sections правильно to create clean and balanced layouts.",
    excerpt: "Understand how to structure sections so your pages look professional and consistent.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=Combine+Sections",
    videoPlanned: true,
    seoIntent: "framer layout design, combine sections framer, website structure design",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Building a page is not just about adding sections. The way you combine them defines how your layout looks and feels.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Layout Feels Wrong</h3>
  
        <p class="docs-text">
          Even with good sections, layouts can look messy if they are combined incorrectly.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Sections feel disconnected</li>
          <li>Spacing looks random</li>
          <li>No visual flow</li>
        </ol>
  
        <p class="docs-text">
          This usually happens when sections are added without thinking about how they work together.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Build Logical Flow</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: section flow from hero to CTA</span>
        </div>
  
        <p class="docs-text">
          A strong layout follows a clear flow from top to bottom.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Hero — explain what this is</li>
          <li>Feature — explain why it matters</li>
          <li>Social proof — build trust</li>
          <li>CTA — guide the user</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Keep Visual Rhythm</h3>
  
        <p class="docs-text">
          Rhythm is created by consistent spacing and predictable structure.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: consistent spacing between sections</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>Use similar spacing between sections</li>
          <li>Avoid sudden size changes</li>
          <li>Keep alignment consistent</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Avoid Repetition</h3>
  
        <p class="docs-text">
          Using the same type of section too many times makes the page feel boring.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Don't stack similar layouts</li>
          <li>Mix different section types</li>
          <li>Create variation in structure</li>
        </ol>
  
        <p class="docs-text">
          Variety keeps the page visually interesting.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Use Contrast Between Sections</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: light and dark sections contrast</span>
        </div>
  
        <p class="docs-text">
          Contrast helps separate sections and improve readability.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Alternate background colors</li>
          <li>Use different layouts</li>
          <li>Highlight important sections</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: clean structured layout</span>
        </div>
  
        <p class="docs-text">
          When sections are combined правильно, the page feels structured, balanced, and professional.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Good layout is not about adding more sections — it's about connecting them into a clear and consistent flow.
        </p>
      </div>
    `,
  },

  {
    slug: "framerkit-workflow-pages",
    title: "FramerKit Workflow: Build Pages the Right Way",
    type: "lesson",
    order: 2,
    isLocked: true,
    category: "Getting Started",
    description: "Learn the correct workflow for building pages in Framer using FramerKit.",
    excerpt: "Understand how to build pages faster using a structured workflow instead of random design.",
    readTime: "7 min",
    image: "https://via.placeholder.com/1280x720?text=FramerKit+Workflow",
    videoPlanned: true,
    seoIntent: "framer workflow tutorial, build pages framer, framerkit workflow",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Building pages in FramerKit is not about randomly adding sections. A clear workflow helps you move faster, avoid mistakes, and keep your layouts consistent.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The Wrong Way</h3>
  
        <p class="docs-text">
          Most beginners start by randomly adding sections without a clear structure.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Adding random blocks</li>
          <li>Changing styles constantly</li>
          <li>No clear flow</li>
        </ol>
  
        <p class="docs-text">
          This leads to messy layouts and wasted time.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">The Right Workflow</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: clean page structure overview</span>
        </div>
  
        <p class="docs-text">
          A better approach is to build your page step by step with a clear structure.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Start with structure</li>
          <li>Add sections in order</li>
          <li>Apply styles at the end</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 1: Build Structure First</h3>
  
        <p class="docs-text">
          Start with layout only. Don't focus on design yet.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: wireframe sections</span>
        </div>
  
        <p class="docs-text">
          Use wireframe sections if you want to move faster.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 2: Add Content</h3>
  
        <p class="docs-text">
          Fill sections with real content before styling.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Headlines</li>
          <li>Descriptions</li>
          <li>CTA buttons</li>
        </ol>
  
        <p class="docs-text">
          This helps you understand if your layout actually works.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Step 3: Apply Styles</h3>
  
        <p class="docs-text">
          Only after structure and content are ready, apply styles.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Apply Color Set</li>
          <li>Apply Text Styles</li>
        </ol>
  
        <p class="docs-text">
          This keeps your design consistent and clean.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Result</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: final clean page</span>
        </div>
  
        <p class="docs-text">
          You get a clean, structured page built faster and with fewer mistakes.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          A clear workflow is the difference between struggling with design and building pages efficiently.
        </p>
      </div>
    `,
  },
  {
    slug: "build-first-landing-fast",
    title: "Build Your First Landing Fast",
    type: "lesson",
    order: 1,
    isLocked: false,
    category: "Getting Started",
    description: "Build a complete landing page in Framer using FramerKit sections in minutes.",
    excerpt: "Learn how to quickly assemble a landing page using sections and basic structure.",
    readTime: "8 min",
    image: "https://via.placeholder.com/1280x720?text=Build+Landing+Fast",
    videoPlanned: true,
    seoIntent: "framer landing page tutorial, build landing fast framer, framerkit sections",
    // Note: This lesson has a dedicated React component page at /pages/Lessons/BuildFirstLandingFast.tsx
  },
  {
    slug: "templates-vs-sections-framerkit",
    title: "Templates vs Sections in FramerKit",
    type: "article",
    category: "Workflow",
    description: "Understand when to use templates and when to use sections in FramerKit.",
    excerpt: "Learn the difference between templates and sections and how to use both effectively.",
    readTime: "6 min",
    image: "https://via.placeholder.com/1280x720?text=Templates+vs+Sections",
    seoIntent: "framer templates vs sections, framerkit templates, website structure framer",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          FramerKit gives you two ways to build pages: using Sections or using Templates. Understanding the difference between them helps you work faster and choose the right approach for each project.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">What are Sections?</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Library with sections (Hero, Feature, CTA)</span>
        </div>
  
        <p class="docs-text">
          Sections are individual building blocks of a page.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Hero sections</li>
          <li>Feature sections</li>
          <li>CTA blocks</li>
          <li>Footers and navigation</li>
        </ol>
  
        <p class="docs-text">
          You combine sections together to build a full page step by step.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">What are Templates?</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Template preview page</span>
        </div>
  
        <p class="docs-text">
          Templates are complete page structures built from multiple sections.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Full landing pages</li>
          <li>Pre-arranged section flow</li>
          <li>Ready-to-use layouts</li>
        </ol>
  
        <p class="docs-text">
          Instead of building from scratch, you start with a full structure and customize it.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">When to Use Sections</h3>
  
        <ol class="resource-ordered-list">
          <li>When you want full control over layout</li>
          <li>When building custom pages</li>
          <li>When experimenting with structure</li>
        </ol>
  
        <p class="docs-text">
          Sections are flexible and perfect for building unique designs.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">When to Use Templates</h3>
  
        <ol class="resource-ordered-list">
          <li>When you want to build quickly</li>
          <li>When you need a proven layout</li>
          <li>When you don't want to think about structure</li>
        </ol>
  
        <p class="docs-text">
          Templates are ideal for fast results and ready-made page flows.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Best Workflow</h3>
  
        <p class="docs-text">
          The best way to use FramerKit is to combine both approaches.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Start with a template for structure</li>
          <li>Replace sections if needed</li>
          <li>Customize content and styles</li>
        </ol>
  
        <p class="docs-text">
          This gives you both speed and flexibility.
        </p>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Sections give you flexibility. Templates give you speed. Together, they create a powerful workflow inside FramerKit.
        </p>
      </div>
    `,
  },
  {
  slug: "color-palette-in-framerkit",
  title: "Color Palette in FramerKit",
  category: "Design System",
  type: "article",
  description: "Use structured color palettes in FramerKit to build flexible and scalable design systems.",
  excerpt: "Learn how to use color palettes in FramerKit for full control over your design system.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Color+Palette+in+FramerKit",
  seoIntent: "framer color palette, design system colors framer, ui color system",
  content: `
    <div class="docs-content-block">
      <p class="docs-text">
        Color Palette in FramerKit gives you full control over your color system by organizing colors into structured scales. Instead of using random colors across your project, you work with predictable shades that make your design consistent and scalable.
      </p>
    </div>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Color Sets vs Color Palette</h3>
      <p class="docs-text">
        FramerKit provides two different ways to work with colors, and it's important to understand the difference.
      </p>

      <ol class="resource-ordered-list">
        <li>Color Sets — ready-made themed color combinations</li>
        <li>Color Palette — structured color system with shades</li>
      </ol>

      <p class="docs-text">
        Use Color Sets when you want speed. Use Color Palette when you want control.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">How Color Palettes Work</h3>

      <div class="docs-image-placeholder">
        <span>Screenshot: Color palette with multiple shades per color</span>
      </div>

      <p class="docs-text">
        Each color in the palette is divided into multiple shades, from light to dark.
      </p>

      <ol class="resource-ordered-list">
        <li>Lighter tones for backgrounds</li>
        <li>Medium tones for UI elements</li>
        <li>Darker tones for text and contrast</li>
      </ol>

      <p class="docs-text">
        This structure helps you avoid random color usage and keeps your UI visually balanced.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Choosing a Palette</h3>

      <div class="docs-image-placeholder">
        <span>Screenshot: Dropdown with multiple palette options</span>
      </div>

      <p class="docs-text">
        FramerKit includes multiple palette systems you can switch between.
      </p>

      <ol class="resource-ordered-list">
        <li>Default palette</li>
        <li>Apple-inspired palette</li>
        <li>Material-style palette</li>
      </ol>

      <p class="docs-text">
        Each palette is built with different design philosophies, so you can choose what fits your project best.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Applying Colors to Your Project</h3>

      <div class="docs-image-placeholder">
        <span>Screenshot: Add All button for color palette</span>
      </div>

      <p class="docs-text">
        You can apply all colors at once directly from the plugin.
      </p>

      <ol class="resource-ordered-list">
        <li>Select a palette</li>
        <li>Click "Add All"</li>
        <li>Colors are added to your Framer styles</li>
      </ol>

      <div class="docs-image-placeholder">
        <span>Screenshot: Framer color styles panel</span>
      </div>

      <p class="docs-text">
        After applying, all colors become reusable styles across your project.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Best Practices</h3>

      <ol class="resource-ordered-list">
        <li>Use lighter shades for backgrounds</li>
        <li>Use mid tones for UI components</li>
        <li>Use dark tones for text and contrast</li>
        <li>Avoid mixing unrelated palettes</li>
      </ol>

      <p class="docs-text">
        A structured palette makes your design easier to maintain and scale.
      </p>
    </section>

    <div class="docs-content-block">
      <p class="docs-text">
        Color Palette in FramerKit is built to give you flexibility without losing consistency, so you can design faster while keeping full control.
      </p>
    </div>
  `,
},
  {
    slug: "text-styles-in-framerkit",
    title: "Text Styles in FramerKit",
    category: "Design System",
    type: "article",
    description: "Create consistent typography using FramerKit text styles system.",
    excerpt: "Learn how to use text styles in FramerKit to build clean and scalable typography.",
    readTime: "6 min",
    image: "https://via.placeholder.com/1280x720?text=Text+Styles+in+FramerKit",
    seoIntent: "framer text styles, typography system framer, framer fonts setup",
    content: `
      <div class="docs-content-block">
        <p class="docs-text">
          Text Styles in FramerKit help you build consistent typography across your entire website without manually adjusting every text layer. Instead of changing font size, weight, and spacing over and over again, you define a system once and reuse it everywhere.
        </p>
      </div>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Text Styles Matter</h3>
        <p class="docs-text">
          Typography is one of the most important parts of any website. Without a clear system, pages quickly become inconsistent and harder to read.
        </p>
        <p class="docs-text">
          Text Styles solve this by creating a structured hierarchy that keeps your design predictable and easy to scale.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Consistent heading sizes across all pages</li>
          <li>Balanced spacing and readability</li>
          <li>Faster editing when updating fonts or styles</li>
          <li>Clean and professional visual hierarchy</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">What You Get in FramerKit</h3>
        <p class="docs-text">
          FramerKit provides a ready-to-use typography system that includes all standard text levels.
        </p>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Text Styles panel with H1–H6 and Body preview</span>
        </div>
  
        <ol class="resource-ordered-list">
          <li>H1 — main page heading</li>
          <li>H2 — section titles</li>
          <li>H3–H6 — supporting hierarchy</li>
          <li>Body — main readable text</li>
        </ol>
  
        <p class="docs-text">
          Each style already includes size, line height, and spacing tuned for responsive layouts.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Choosing Fonts</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Font dropdown with different font options</span>
        </div>
  
        <p class="docs-text">
          You can quickly change typography by selecting fonts for headings and body text.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Choose a font for headings for stronger visual identity</li>
          <li>Choose a font for body for better readability</li>
          <li>Mix styles carefully to keep visual balance</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Adjusting Font Weight</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Font weight dropdown from Thin to Bold</span>
        </div>
  
        <p class="docs-text">
          Font weight controls how strong or subtle your text appears.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Use Bold for headings to create contrast</li>
          <li>Use Regular for body text for readability</li>
          <li>Avoid too many different weights in one layout</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Apply Styles to Your Project</h3>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Update All Text Styles button</span>
        </div>
  
        <p class="docs-text">
          Once you are happy with your typography setup, you can apply everything instantly.
        </p>
  
        <ol class="resource-ordered-list">
          <li>Click Update All Text Styles</li>
          <li>All text styles are added to your Framer project</li>
          <li>They appear in the Styles panel inside Framer</li>
        </ol>
  
        <div class="docs-image-placeholder">
          <span>Screenshot: Framer Styles panel with applied text styles</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Best Practices</h3>
  
        <ol class="resource-ordered-list">
          <li>Stick to one heading font and one body font</li>
          <li>Keep a clear size hierarchy from H1 to H6</li>
          <li>Avoid random font overrides inside sections</li>
          <li>Always test readability on mobile</li>
        </ol>
      </section>
  
      <div class="docs-content-block">
        <p class="docs-text">
          Text Styles in FramerKit are designed to remove repetitive work and give you a clean, scalable foundation for any project.
        </p>
      </div>
    `,
  },
  {
    slug: "color-sets-in-framerkit",
    title: "Color Sets in FramerKit",
    category: "Design System",
    type: "article",
    description:
      "Use ready-made color sets in FramerKit to keep your design consistent and apply a full color system in seconds.",
    excerpt:
      "Learn how to use Color Sets in FramerKit, why they matter, and how to add them through the plugin inside Framer.",
    readTime: "5 min",
    image: "https://via.placeholder.com/1280x720?text=Color+Sets+in+FramerKit",
    seoIntent:
      "framer color system, framerkit color sets, framer plugin colors, ui color palette",
    content: `
      <section class="docs-content-block">
        <p class="docs-text">
          Design without a clear color system quickly becomes inconsistent.
        </p>
        <p class="docs-text">
          You start with one color, add another, then a third — and the page loses visual balance.
        </p>
        <p class="docs-text">
          FramerKit solves this with <strong>ready-made Color Sets</strong> that you can apply instantly.
        </p>
        <p class="docs-text">
          Instead of manually picking colors, you start with a complete system.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">What are Color Sets?</h3>
        <p class="docs-text">
          Color Sets are pre-built palettes where all colors are already designed to work together.
        </p>
        <p class="docs-text">
          Each set includes primary colors, secondary tones, background colors, and accents.
        </p>
      </section>
  
      <section class="docs-content-block">
        <div class="docs-image-placeholder" style="margin-top: 0;">
           <div class="docs-media">
              <img src="/images/color-sets-list.png" alt="Color Sets in FramerKit" />
            </div>
        </div>
      </section>

  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Example</h3>
        <p class="docs-text">
          A set like <strong>Oceanic Cactus</strong> gives you everything needed for a full page:
          dark base, mid tones, light backgrounds, and an accent color.
        </p>
      </section>
  
      <section class="docs-content-block">
        <div class="docs-image-placeholder" style="margin-top: 0;">
               <div class="docs-media">
              <img src="/images/oceanic-cactus.png" alt="Color Sets in FramerKit" />
            </div>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Why Color Sets Matter</h3>
        <p class="docs-text">
          Using random colors creates inconsistent UI, poor readability, and messy layouts.
        </p>
        <p class="docs-text">
          With Color Sets you get consistency, speed, and better design decisions.
        </p>
        <ol class="resource-ordered-list">
          <li>Consistency — all sections look like one system</li>
          <li>Speed — no need to choose colors manually</li>
          <li>Better design — you use a proven palette instead of guessing</li>
        </ol>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">How to Add Color Sets in Framer</h3>
        <p class="docs-text">
          Open your project in Framer and launch the FramerKit plugin.
        </p>
        <p class="docs-text">
          Then go to <strong>Styles → Color Sets</strong>, choose any palette, and click <strong>Add All</strong>.
        </p>
        <p class="docs-text">
          All colors will be added to your project as styles.
        </p>
      </section>
  
      <section class="docs-content-block">
      <div class="docs-media">
        <video src="/videos/add-color-sets.mp4" autoplay muted loop playsinline></video>
      </div>

     
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Using Colors in Your Design</h3>
        <p class="docs-text">
          Once added, you can apply those colors to text, backgrounds, buttons, and other UI elements.
        </p>
        <p class="docs-text">
          This makes it much easier to keep your project visually consistent from the beginning.
        </p>
      </section>
  
      <section class="docs-content-block">
        <div class="docs-image-placeholder" style="margin-top: 0;">
          <span>Screenshot placeholder: show color styles added in Framer styles panel</span>
        </div>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Pro Tip</h3>
        <p class="docs-text">
          Start your project by applying a Color Set first, then build your layout using sections.
        </p>
        <p class="docs-text">
          This helps you keep design consistency from the start instead of fixing it later.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Next Steps</h3>
        <p class="docs-text">
          Next, you can explore Text Styles and Templates to build a more complete design system inside FramerKit.
        </p>
      </section>
  
      <section class="docs-content-block">
        <h3 class="docs-section-title">Conclusion</h3>
        <p class="docs-text">
          Color Sets let you skip manual color decisions and start with a complete system.
        </p>
        <p class="docs-text">
          You build faster, keep consistency, and focus on the layout instead of choosing colors one by one.
        </p>
        <p class="docs-text">
          One click — and your project already has a solid visual foundation.
        </p>
      </section>
    `,
  },
];

export const RESOURCE_BY_SLUG: Record<string, ResourceItem> = Object.fromEntries(
  RESOURCES.map((item) => [item.slug, item])
);
