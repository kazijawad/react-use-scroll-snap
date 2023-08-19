# react-use-scroll-snap

A minimal React Hook for JavaScript scroll snapping. The Hook primarily snaps to elements using the
[wheel](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event) and
[touchmove](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event) events. Please reference the
[example](example/) folder on how to use the Hook.

## API

### Properties

| Property             | Type                           | Default | Description                                                           | Required |
|----------------------|--------------------------------|---------|-----------------------------------------------------------------------|----------|
| `ref`                | `React.RefObject<HTMLElement>` | N/A     | Parent element of the scroll items.                                   | Yes      |
| `duration`           | `number`                       | 100     | Snap animation length in miliseconds.                                 | No       |
| `isArrowKeysEnabled` | `boolean`                      | True    | Enables the up and down arrow keys for snapping.                      | No       |
| `isDirectionEnabled` | `boolean`                      | True    | Prioritizes scroll direction over element visibility in the viewport. | No       |

### Return Object

| Property | Type                           | Description                                                        |
|----------|--------------------------------|--------------------------------------------------------------------|
| `state`  | `React.RefObject<ScrollState>` | The internal state object used to track scroll information.        |
| `goto`   | `(index: number) => void`      | A function that will scroll to the element at the specified index. |


## Installation

The package can be installed using [npm](https://www.npmjs.com). The package is written in TypeScript and exports the
type declaration file in the distribution.

```bash
npm install react-use-scroll-snap
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
