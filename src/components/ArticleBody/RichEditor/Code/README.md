# Code Block Components

This directory contains components for rendering syntax-highlighted code blocks with interactive features like text wrapping toggle and copy functionality.

## Components

### MultiCodeBlock

The main code block component that combines syntax highlighting with interactive controls.

```tsx
<MultiCodeBlock 
  lang="typescript"
  filename="example.ts"
  defaultWrapped={false}
>
  {codeContent}
</MultiCodeBlock>
```

**Props:**
- `children`: string | string[] - The code content to display
- `filename`: string | null - Optional filename to display above the code block
- `lang`: string - Language for syntax highlighting (defaults to 'text')
- `defaultWrapped`: boolean - Whether text should be wrapped by default (defaults to false)

### WrapToggleButton

A button component that toggles text wrapping in code blocks.

```tsx
<WrapToggleButton 
  onToggleWrap={(isWrapped) => console.log(isWrapped)}
  defaultWrapped={false}
/>
```

**Props:**
- `onToggleWrap`: (isWrapped: boolean) => void - Callback when wrap state changes
- `defaultWrapped`: boolean - Initial wrap state (defaults to false)

### CopyButton

A button component that copies text to the clipboard with visual feedback.

```tsx
<CopyButton text="console.log('Hello, World!');" />
```

**Props:**
- `text`: string - The text to copy to clipboard

### Tooltip

A shared tooltip component used by other components.

```tsx
<Tooltip isVisible={showTooltip}>
  Copy code
</Tooltip>
```

**Props:**
- `isVisible`: boolean - Whether the tooltip should be visible
- `children`: React.ReactNode - Tooltip content
- `className`: string - Additional CSS classes

## Hooks

### useTooltip

A custom hook for managing tooltip state.

```tsx
const { isVisible, show, hide, toggle } = useTooltip({
  disabled: false,
  autoHide: true,
  autoHideDelay: 1000
});
```

**Options:**
- `disabled`: boolean - Whether tooltip functionality is disabled
- `autoHide`: boolean - Whether tooltip should auto-hide after showing
- `autoHideDelay`: number - Delay in ms before auto-hiding

## Constants

Shared styling constants are defined in `constants.ts`:

- `CODE_BLOCK_COLORS`: Color values for consistent theming
- `TOOLTIP_STYLES`: Base CSS classes for tooltips
- `BUTTON_BASE_STYLES`: Base CSS classes for buttons
- `ANIMATION_DURATIONS`: Timing constants for animations

## Features

### Accessibility
- All buttons have proper ARIA labels and roles
- Tooltips use `role="tooltip"` and `aria-hidden` attributes
- Buttons indicate pressed state with `aria-pressed`
- Keyboard navigation support

### Performance
- Components use `useCallback` and `useMemo` to prevent unnecessary re-renders
- Code content is memoized in MultiCodeBlock
- Tooltip state is managed efficiently

### Error Handling
- CopyButton includes fallback for browsers without clipboard API support
- Graceful handling of empty or malformed content

### Responsive Design
- Code blocks adapt to different screen sizes
- Tooltips are positioned consistently across breakpoints

## Integration

These components are integrated into the rich text editor through `ReplaceUiParts.lib.tsx`, which parses HTML `<pre><code>` elements and replaces them with `MultiCodeBlock` components.

## Testing

Each component has comprehensive unit tests covering:
- Rendering with different props
- User interactions (clicking, hovering)
- State management
- Accessibility features
- Error scenarios

Run tests with:
```bash
npm test
```

## Storybook

Components are documented in Storybook for visual testing and documentation:

```bash
npm run storybook
```