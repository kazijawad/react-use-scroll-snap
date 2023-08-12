import styled from 'styled-components'

interface TextProps {
    textColor: string;
    children: React.ReactNode | React.ReactNode[];
}

const Container = styled.p<{ $textColor: string }>`
    font-size: 6rem;
    color: ${props => props.$textColor};
`

function Text({ textColor, children }: TextProps) {
    return (
        <Container $textColor={textColor}>
            {children}
        </Container>
    )
}

export default Text
