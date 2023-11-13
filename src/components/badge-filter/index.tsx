import { Badge } from "@/components/ui/badge";

type BadgeFilterProps = {
  badge: {
    value: number;
    name: string;
    type: string;
    isSelected: boolean;
  }[];
  handleBadge: (value: number) => void;
};

const BadgeFilter = ({ badge, handleBadge }: BadgeFilterProps) => {
  return (
    <div className="flex flex-wrap mt-5 justify-center">
      {badge.map((item) => (
        <Badge
          key={`${item.name}-${item.value}`}
          variant={!item.isSelected ? "outline" : "default"}
          className="mr-2 mb-2 cursor-pointer"
          onClick={() => {
            handleBadge(item.value);
          }}
        >
          {item.name}
        </Badge>
      ))}
    </div>
  );
};

export default BadgeFilter;
