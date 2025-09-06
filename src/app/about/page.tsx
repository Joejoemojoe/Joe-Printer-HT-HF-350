export default function AboutPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>About</h1>
      <p>Hi, I&#39;m Joe. This site tracks the evolution of my custom 3D printer platform — design choices, iteration logs, and tuning data so others can learn or replicate aspects of the build.</p>
      <h2>Contact</h2>
      <ul>
        <li>GitHub: <a href="https://github.com/USERNAME" target="_blank" rel="noopener noreferrer">@USERNAME</a></li>
        <li>Issues & suggestions: open a ticket on the repository</li>
      </ul>
      <h2>Tech Stack</h2>
      <ul>
        <li>Next.js App Router</li>
        <li>MDX content</li>
        <li>Tailwind CSS</li>
      </ul>
    </div>
  );
}
