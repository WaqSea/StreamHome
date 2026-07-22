import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(path), "utf8");

describe("recommendation feedback placement", () => {
  it("keeps explicit feedback out of every catalog card renderer", () => {
    const shared = read("src/pages/dashboard/ThemeDashboard.tsx");
    const ember = read("src/pages/dashboard/ember/EmberDashboard.tsx");

    expect(shared).not.toContain("<RecommendationFeedback compact");
    expect(ember).not.toContain("<RecommendationFeedback compact");
    expect(shared).toContain("useRecommendationExposure");
    expect(ember).toContain("useRecommendationExposure");
  });

  it("retains explicit feedback on the media details page", () => {
    const details = read("src/pages/details/DetailsRouter.tsx");

    expect(details).toContain("Shape your recommendations");
    expect(details).toContain("<RecommendationFeedback movieId={movie.id}");
  });

  it("removes the unused compact card-feedback styling contract", () => {
    const application = read("src/themes/application/application.css");

    expect(application).not.toContain("recommendation-feedback--compact");
  });
});
