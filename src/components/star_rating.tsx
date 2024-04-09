import { FaStar, FaRegStar } from "react-icons/fa";

function Star({ isActive }: { isActive: boolean }) {
  const cl = "size-4";

  if (!isActive) {
    return <FaRegStar className={`text-foreground/30 ${cl}`} />;
  }

  return <FaStar className={`text-star ${cl}`} />;
}

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex flex-row">
      <Star isActive={rating >= 1} />
      <Star isActive={rating >= 2} />
      <Star isActive={rating >= 3} />
      <Star isActive={rating >= 4} />
      <Star isActive={rating >= 5} />
    </div>
  );
}
