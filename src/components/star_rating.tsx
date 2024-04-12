import { FaStar, FaRegStar } from "react-icons/fa";

export function Star({ isActive, huge }: { isActive: boolean, huge?: boolean }) {
  const cl = huge ? "size-8" : "size-4";

  if (!isActive) {
    return <FaRegStar className={`text-foreground/30 ${cl}`} />;
  }

  return <FaStar className={`text-star ${cl}`} />;
}

export default function StarRating({ rating, huge }: { rating: number, huge?: boolean }) {
  return (
    <div className="flex flex-row">
      <Star isActive={rating >= 1} huge={huge} />
      <Star isActive={rating >= 2} huge={huge} />
      <Star isActive={rating >= 3} huge={huge} />
      <Star isActive={rating >= 4} huge={huge} />
      <Star isActive={rating >= 5} huge={huge} />
    </div>
  );
}
