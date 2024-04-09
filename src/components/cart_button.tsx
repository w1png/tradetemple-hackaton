import { Button } from "./ui/button";

interface CartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  listing_id: string
}

const CartButton = ({ listing_id, ...props }: CartButtonProps) => {
  return (
    <Button {...props}>Добавить в корзину</Button>
  )
}

export default CartButton;
