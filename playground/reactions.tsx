import { Button, Popover, Toggle, Tooltip } from "@usememos/ui";
import { SmilePlus } from "lucide-react";

const choices = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "😄", label: "Smile" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "👀", label: "Eyes" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "🙏", label: "Thanks" },
];

type Reaction = { emoji: string; label: string; count: number; pressed: boolean };

// The parent supplies server counts and the current user's selected choices.
export function CompactReactions({ reactions, onPressedChange }: {
  reactions: Reaction[];
  onPressedChange: (emoji: string, pressed: boolean) => void;
}) {
  return (
    <Tooltip.Provider>
      <div className="reaction-strip" role="group" aria-label="Reactions">
        {reactions.filter((reaction) => reaction.count > 0).map((reaction) => (
          <Toggle
            key={reaction.emoji}
            variant="soft" shape="pill" size="sm"
            aria-label={`${reaction.label}, ${reaction.count} reactions`}
            pressed={reaction.pressed}
            onPressedChange={(pressed) => onPressedChange(reaction.emoji, pressed)}
          >
            <span className="reaction-label">
              <span className="mu-body" aria-hidden>{reaction.emoji}</span>
              <span className="mu-caption reaction-count" aria-hidden>{reaction.count}</span>
            </span>
          </Toggle>
        ))}
        <Popover.Root>
          <Tooltip.Root>
            <Tooltip.Trigger render={
              <Popover.Trigger render={
                <Button variant="ghost" shape="pill" size="sm" icon={<SmilePlus />} aria-label="Add reaction" />
              } />
            } />
            <Tooltip.Popup>Add reaction</Tooltip.Popup>
          </Tooltip.Root>
          <Popover.Popup align="start" aria-label="Choose reactions" className="mu-compact reaction-popup">
            <div className="reaction-options">
              {choices.map(({ emoji, label }) => (
                <Tooltip.Root key={emoji}>
                  <Tooltip.Trigger render={
                    <Toggle
                      variant="soft" className="reaction-option"
                      aria-label={label}
                      pressed={reactions.some((reaction) => reaction.emoji === emoji && reaction.pressed)}
                      onPressedChange={(pressed) => onPressedChange(emoji, pressed)}
                    >
                      <span className="mu-body" aria-hidden>{emoji}</span>
                    </Toggle>
                  } />
                  <Tooltip.Popup>{label}</Tooltip.Popup>
                </Tooltip.Root>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Root>
      </div>
    </Tooltip.Provider>
  );
}
