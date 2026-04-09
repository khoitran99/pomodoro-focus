// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioPlayer } from "@/components/AudioPlayer";
import { audioTracks } from "@/lib/music";

describe("AudioPlayer", () => {
  let playSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    playSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(
      () => {},
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("preloads the current track before a work session starts", () => {
    render(
      <AudioPlayer
        phase="setup"
        isRunning={false}
        performanceMode="balanced"
        setAudioLoading={vi.fn()}
      />,
    );

    const audio = document.querySelector("audio");
    expect(audio).not.toBeNull();
    expect(audio?.getAttribute("src")).toBe(audioTracks[0]?.src);
    expect(audio?.getAttribute("preload")).toBe("auto");
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("changes tracks when next and previous are clicked", async () => {
    render(
      <AudioPlayer
        phase="work"
        isRunning
        performanceMode="balanced"
        setAudioLoading={vi.fn()}
      />,
    );

    const audio = document.querySelector("audio");
    expect(audio).not.toBeNull();
    expect(audio?.getAttribute("src")).toBe(audioTracks[0]?.src);
    expect(screen.getByText(audioTracks[0]?.name ?? "")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /next track/i }));

    await waitFor(() => {
      expect(screen.getByText(audioTracks[1]?.name ?? "")).not.toBeNull();
      expect(document.querySelector("audio")?.getAttribute("src")).toBe(
        audioTracks[1]?.src,
      );
    });

    fireEvent.click(screen.getByRole("button", { name: /previous track/i }));

    await waitFor(() => {
      expect(screen.getByText(audioTracks[0]?.name ?? "")).not.toBeNull();
      expect(document.querySelector("audio")?.getAttribute("src")).toBe(
        audioTracks[0]?.src,
      );
    });
  });
});
