export default function AboutPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>About</h1>
      <p>Hi, I&#39;m Joe. This site tracks the evolution of my custom 3D printer platform — design choices, iteration logs, and tuning data so others can learn or replicate aspects of the build.</p>
      <h2>Contact & Links</h2>
      <ul>
        <li>GitHub User: <a href="https://github.com/Joejoemojoe" target="_blank" rel="noopener noreferrer">@Joejoemojoe</a></li>
        <li>Project Repository: <a href="https://github.com/Joejoemojoe/Joe-Printer-HT-HF-350" target="_blank" rel="noopener noreferrer">Joe-Printer-HT-HF-350</a></li>
        <li>Live Site (About Page): <a href="https://joejoemojoe.github.io/Joe-Printer-HT-HF-350/about/" target="_blank" rel="noopener noreferrer">github.io/About</a></li>
        <li>Issues & suggestions: please open a GitHub issue in the repository</li>
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
