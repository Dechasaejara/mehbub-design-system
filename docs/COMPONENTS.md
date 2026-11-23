# Component usage and accessibility

## Button

Use a native `Button` for an action and keep its accessible name concise and descriptive. The default `type` is `button` so a button inside a form does not submit accidentally. Set `type="submit"` when submitting that form. Native keyboard activation and disabled semantics are preserved.

Choose `primary` for the main action, `secondary` for supporting actions, and `ghost` for low emphasis. Use `sm`, `md`, or `lg` when the surrounding layout calls for a different size. `loading` disables activation, sets `aria-busy`, and replaces the label with “Loading…”. Keep the surrounding context clear so the action remains understandable when its label changes.

```tsx
<Button variant="primary" onClick={saveDraft}>Save draft</Button>
<Button type="submit" loading={isSaving}>Publish</Button>
```

## Input

Provide a visible `label` whenever possible. Use `hint` for instructions that remain useful before and after validation. Use `error` for a current validation failure; the component marks the input invalid, associates the message with the input, and announces the message with an alert role. If a form has other descriptive text, pass its ID through `aria-describedby`; the component preserves and combines it with the hint or error ID.

```tsx
<Input
  id="email"
  label="Work email"
  hint="Use the address connected to your account."
  type="email"
  autoComplete="email"
/>

<Input
  id="email"
  label="Work email"
  type="email"
  aria-describedby="email-policy"
  error="Enter a valid email address."
/>
```

Use `aria-label` when a visible label is not suitable, such as a compact search field. Do not rely on placeholder text as the only accessible name.

## Card

Use `Card` to group related content. Supply a heading in the content and label the section when it represents a named region. Prefer semantic headings and native controls inside it.

## State review

Storybook documents each component's primary, secondary, ghost, disabled, loading, hint, and invalid states. Before adding a component, cover its keyboard and screen-reader behavior, focus appearance, error/disabled/loading states, and any platform-specific interaction in tests and stories.

## Avatar, Badge, and Tag

Use `Avatar` to identify a person or entity. It derives initials from `name` when no image is supplied and uses the name as the image alternative text by default. Set `decorative` when nearby text already names the person.

`Badge` shows a short count or status. Counts above `max` display as `max+`; a dot-only badge requires an accessible `label`. `Tag` is a non-interactive label for categorization. Use a button or link when the label needs to trigger an action.

```tsx
<Inline gap={2}>
  <Avatar name="Amina Yusuf" />
  <Tag tone="green">Active</Tag>
  <Badge value={12} tone="info" />
  <Badge dot label="New updates" tone="success" />
</Inline>
```

## Inline messages

Use `InlineMessage` for feedback next to the content it describes. Info, success, and warning messages use a polite status announcement; errors use an alert. Keep the message concise and provide a clear next step when the user needs to act.

## Layout primitives

`Stack` arranges content vertically; `Inline` arranges it horizontally and can wrap. Their numeric `gap` prop refers to the theme's spacing token key, so a `gap={4}` uses `--agency-space-4` and falls back to 16 pixels. Pass a CSS size string for a one-off gap.
