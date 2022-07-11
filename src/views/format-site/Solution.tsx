// views/format-site/Solution.tsx

interface SolutionProps {
  rationale: string;
}

export default ({ rationale }: SolutionProps) => (
  <section>
    <h2>Solution</h2>
    <blockquote>{rationale}</blockquote>
  </section>
);
