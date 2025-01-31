// openai/moderate.ts

import { setTimeout } from "node:timers/promises";
import fetch from "@adobe/node-fetch-retry";
import _ from "lodash";

// import { memoize } from "../clients/cache";
import { apiKey } from "../env";

export class ContentPolicyError extends Error {
  title: string;
  categories: string[];

  constructor(categories: string[] = [], title = "This shit ain't okay.") {
    const policyUrl: string =
      "https://beta.openai.com/docs/usage-guidelines/content-policy";
    super(`
Your input violates openai content policy and terms under the following categories:
"${categories.join('", "')}".
Please see ${policyUrl} for more info.
`);

    this.categories = categories;
    this.title = title;
  }
}

export interface ModerateResult {
  categories: string[];
  flagged: boolean;
}

export async function moderate(input: string): Promise<ModerateResult> {
  // Stagger requests so rate limit is not triggered
  await setTimeout(_.random(1, 3) * 50);

  let response;

  try {
    response = await fetch("https://api.openai.com/v1/moderations", {
      body: JSON.stringify({ input }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch (e) {
    console.error(e);
    return { categories: [], flagged: false };
  }

  const { results } = await response.json();

  const flagged = !!_(results)
    .map("flagged")
    .reduce((a, b) => a + b, 0);

  const categories = _.entries(
    _(results)
      .map("categories")
      .reduce((c1, c2) => _.assignWith(c1, c2, (v1 = 0, v2 = 0) => v1 + v2), {})
  )
    .filter(([_name, value]) => ((value as any) || 0) > 0)
    .map(([name]) => name);

  return {
    categories,
    flagged,
  };
}

export default moderate;
// export default memoize(moderate);
