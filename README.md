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
    const scrollRef = useRef(null);
    useScrollSnap({ ref: scrollRef, duration: 100, delay: 50 });

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

### Parameter Object

This hook uses JavaScript objects to handle the parameters.

| Parameter   | Description                                   |
|-------------|-----------------------------------------------|
| `ref`       | The React ref that attaches to the container. |
| `duration`  | The snap animation time in miliseconds.       |
| `delay`     | The snap delay time in miliseconds.           |

### Return Value

`scrollIndex`: The index of the child element that the snap is currently on.

## Author

[Kazi Jawad](https://github.com/kazijawad)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/kazijawad/esbuild-plugin-svgr/blob/main/LICENSE.md) file for details.

## Acknowledgements

[Tweezer.js](https://github.com/jaxgeller/tweezer.js/)
