# react-use-scroll-snap

A React hook for JavaScript scroll snapping with touch, mouse, and keyboard events.

## Basic Usage

1. Install the plugin in your project:
```bash
npm install react-use-scroll-snap
# or use yarn
yarn add react-use-scroll-snap
```

2. Use the hook inside your React component and attach the ref:
```js
import useScrollSnap from 'react-use-scroll-snap';

function Component() {
    const { scrollRef, scrollIndex } = useScrollSnap({ duration: 500, delay: 200 });

    return (
        <section ref={scrollRef}>
            <div></div>
            <div></div>
            <div></div>
        </section>
    )
}
```

## Documentation

This hook uses JavaScript objects to handle the parameters and return value.

### Parameter Object

| Parameter   | Description                             |
|-------------|-----------------------------------------|
| `duration`  | The snap animation time in miliseconds. |
| `delay`     | The snap delay time in miliseconds.     |

### Return Value Object

| Parameter     | Description                                                       |
|---------------|-------------------------------------------------------------------|
| `scrollRef`   | The React ref that needs to be attached to the container element. |
| `scrollIndex` | The index of the child element that the snap is currently on.     |

## Author

[Kazi Jawad](https://github.com/kazijawad)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/kazijawad/esbuild-plugin-svgr/blob/main/LICENSE.md) file for details.

## Acknowledgements

[Tweezer.js](https://github.com/jaxgeller/tweezer.js/)
