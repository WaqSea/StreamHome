import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MotionProvider } from "../../motion/motionSystem";
import type { Movie } from "../../types/api";
import { GenreCategoryGallery } from "./GenreCategoryGallery";

const matchMedia = () => ({ matches: false, media: "(prefers-reduced-motion: reduce)", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
const representative: Movie = { id: "action", title: "Action title", description: "", thumbnailUrl: "", bannerUrl: null, videoUrl: "", genres: ["Action"], duration: "", releaseYear: 2026, rating: null, cast: [], director: null, type: "movie", quality: "", languages: [], subtitles: [], voteAverage: 0, voteCount: 0, skipMarkers: {} };

describe("genre category gallery", () => {
  it("renders a separate accessible gallery with pressed state and selection", () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: matchMedia });
    const onSelect = vi.fn();
    render(<MotionProvider><GenreCategoryGallery variant="shared" active="Action" onSelect={onSelect} cards={[
      { value: "Action", label: "Action", count: 2, representative },
      { value: "Drama", label: "Drama", count: 1, representative: { ...representative, id: "drama", title: "Drama title", genres: ["Drama"] } },
    ]} /></MotionProvider>);

    expect(screen.getByRole("heading", { name: "Browse Categories" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Action, 2 titles", pressed: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Drama, 1 title", pressed: false })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Drama, 1 title" }));
    expect(onSelect).toHaveBeenCalledWith("Drama");
  });

  it("does not render an empty gallery", () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: matchMedia });
    const { container } = render(<MotionProvider><GenreCategoryGallery variant="ember" active="recommended" onSelect={() => undefined} cards={[]} /></MotionProvider>);
    expect(container.childElementCount).toBe(0);
  });
});
