import styled from 'styled-components'

interface SectionProps {
    backgroundColor: string;
    children: React.ReactNode | React.ReactNode[];
}

const Container = styled.section<{ $backgroundColor: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: ${props => props.$backgroundColor};
`

function Section({ backgroundColor, children }: SectionProps) {
    return (
        <Container $backgroundColor={backgroundColor}>
            {children}
        </Container>
    )
}

export default Section
