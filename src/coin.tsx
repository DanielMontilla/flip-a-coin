
interface props {
   face: face
   border?: boolean
   callback?: () => void;
}

const Coin: React.FC<props> = ({ face, border = false, callback = () => {} }) => {
   let style: React.CSSProperties = {
      backgroundColor: `var(--${face})`,
      borderStyle: `${(border) ? 'solid' : 'none'}`
   }

   return <div className={`coin`} style={ style } onClick={ callback } />
}

export default Coin;