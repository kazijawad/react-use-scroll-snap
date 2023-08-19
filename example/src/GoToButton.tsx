import styled from 'styled-components'

interface GoToButtonProps {
    goto: (index: number) => void;
}

const Button = styled.button`
    position: fixed;
    top: 2rem;
    right: 2rem;
    padding: 1rem 2rem;
    border: none;
    color: inherit;
    outline: inherit;
    cursor: pointer;
`

function GoToButton({ goto }: GoToButtonProps) {
    const handleClick = () => {
        goto(2)
    }

    return (
        <Button onClick={handleClick}>
            Go To Slide 3
        </Button>
    )
}

export default GoToButton
