// views/Controls.tsx

import type { HeadProps } from "./general/Head";

import Head from "./general/Head";

export interface ErrorProps extends HeadProps {
  error: string;
  title?: string;
}

export default ({
  title = "Something went wrong...",
  error,
  ...props
}: ErrorProps) => (
  <html>
    <Head {...props} />
    <body>
      <section>
        <h3> {title} </h3>
        <p> {error}</p>
        <hr></hr>
        <p className="small-60">
          Sorry for the trouble. This error has been recorded.
        </p>
        <p className="small-60">
          Go back <a href="/"> home </a>.
        </p>
      </section>
    </body>
  </html>
);
