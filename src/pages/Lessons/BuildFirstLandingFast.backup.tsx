// BACKUP: Original lesson data from resourcesData.ts
// This is a backup of the lesson content before refactoring to separate page

export const lessonBackup = {
  slug: "build-first-landing-fast",
  title: "Build Your First Landing Fast",
  type: "lesson" as const,
  order: 1,
  isLocked: false,
  category: "Getting Started",
  description: "Build a complete landing page in Framer using FramerKit sections in minutes.",
  excerpt: "Learn how to quickly assemble a landing page using sections and basic structure.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Build+Landing+Fast",
  videoPlanned: true,
  seoIntent: "framer landing page tutorial, build landing fast framer, framerkit sections",
  content: `
    <div class="docs-content-block">
      <p class="docs-text">
        In this lesson, you will build a complete landing page using FramerKit sections. The goal is not to design from scratch, but to assemble a clean and working structure quickly.
      </p>
    </div>

    <section class="docs-content-block">
      <h3 class="docs-section-title">What You Will Build</h3>

      <div class="docs-image-placeholder">
        <span>Screenshot: Final landing page structure</span>
      </div>

      <p class="docs-text">
        You will create a landing page with a clear structure using ready-made sections.
      </p>

      <ol class="resource-ordered-list">
        <li>Hero section</li>
        <li>Feature section</li>
        <li>Social proof</li>
        <li>CTA section</li>
        <li>Footer</li>
      </ol>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Step 1: Add Hero Section</h3>

      <p class="docs-text">
        Start by adding a Hero section. This is the first thing users see, so keep it simple and clear.
      </p>

      <div class="docs-image-placeholder">
        <span>Screenshot: Hero section in library</span>
      </div>

      <p class="docs-text">
        Choose any Hero you like and copy it into your Framer project.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Step 2: Add Feature Section</h3>

      <p class="docs-text">
        Next, explain your product or service using a Feature section.
      </p>

      <div class="docs-image-placeholder">
        <span>Screenshot: Feature sections</span>
      </div>

      <p class="docs-text">
        Keep the content short and focused on value.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Step 3: Add Social Proof</h3>

      <p class="docs-text">
        Add testimonials or logos to build trust.
      </p>

      <div class="docs-image-placeholder">
        <span>Screenshot: testimonial or logos section</span>
      </div>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Step 4: Add CTA</h3>

      <p class="docs-text">
        Add a clear call to action that tells users what to do next.
      </p>

      <div class="docs-image-placeholder">
        <span>Screenshot: CTA section</span>
      </div>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Step 5: Apply Styles</h3>

      <p class="docs-text">
        Apply a Color Set and Text Styles to make your page consistent.
      </p>

      <ol class="resource-ordered-list">
        <li>Apply Color Set</li>
        <li>Apply Text Styles</li>
      </ol>

      <p class="docs-text">
        This step makes your layout look clean instantly.
      </p>
    </section>

    <section class="docs-content-block">
      <h3 class="docs-section-title">Result</h3>

      <div class="docs-image-placeholder">
        <span>Screenshot: Final clean landing page</span>
      </div>

      <p class="docs-text">
        You now have a complete landing page built in minutes using FramerKit.
      </p>
    </section>

    <div class="docs-content-block">
      <p class="docs-text">
        This approach lets you focus on structure and content instead of spending time building layouts from scratch.
      </p>
    </div>
  `,
};
