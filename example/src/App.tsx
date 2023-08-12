import { useRef } from 'react'
import useScrollSnap from 'react-use-scroll-snap'

import Section from './Section'
import Text from './Text'

function App() {
    const scrollRef = useRef(null)
    useScrollSnap({ ref: scrollRef, duration: 100, delay: 0 })

    return (
        <main ref={scrollRef}>
            <Section backgroundColor="#34495e">
                <Text textColor="#fff">
                    Slide 1
                </Text>
            </Section>
            <Section backgroundColor="#2ecc71">
                <Text textColor="#fff">
                    Slide 2
                </Text>
            </Section>
            <Section backgroundColor="#8e44ad">
                <Text textColor="#fff">
                    Slide 3
                </Text>
            </Section>
            <Section backgroundColor="#e74c3c">
                <Text textColor="#fff">
                    Slide 4
                </Text>
            </Section>
            <Section backgroundColor="#f39c12">
                <Text textColor="#fff">
                    Slide 5
                </Text>
            </Section>
        </main>
    )
}

export default App
